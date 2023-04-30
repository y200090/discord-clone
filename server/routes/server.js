const router = require('express').Router();
const User = require('../models/User');
const Server = require('../models/Server');
const Channel = require('../models/Channel');
const verify = require('../middleware/verify');
const Message = require('../models/Message');
const Invitation = require('../models/Invitation');
const crypto = require('crypto');

// サーバー作成
router.post('/create', verify, async (req, res) => {
    const { serverName, photoURL, category, currentUser } = req.body;

    try {        
        // サーバーを新規作成
        let newServer = await Server.create({
            title: serverName,
            photoURL, 
            category,
            members: [currentUser._id],
            owner: currentUser._id,
        });
        
        // カレントユーザーの”参加済みサーバー”配列を更新
        await User.findOneAndUpdate({ _id: currentUser._id }, {
            $addToSet: {
                joinedServers: newServer._id
            }
        }, { runValidators: true });

        // メインテキストチャンネルを作成
        const textChannel = await Channel.create({
            title: '一般',
            parentServer: newServer._id,
            allowedUsers: [currentUser._id]
        });

        // ボイスチャンネルを作成
        const voiceChannel = await Channel.create({
            title: '一般',
            parentServer: newServer._id,
            category: 'ボイスチャンネル',
            allowedUsers: [currentUser._id]
        });

        // 招待URLを作成
        let N = 8;
        let invitationLink = crypto.randomBytes(N).toString('base64').substring(0, N);
        invitationLink = invitationLink.replace(/\//g, '\\');

        await Invitation.create({
            link: invitationLink,
            targetServer: newServer._id,
            sender: currentUser._id,
        });

        // サーバーの”所有チャンネル”配列を更新
        newServer.ownedChannels.push(textChannel._id, voiceChannel._id)
        newServer.invitationLink = invitationLink;
        newServer = await newServer.save();
        newServer = await newServer.populate([
            {path: 'members'},
            {path: 'ownedChannels', populate: [
                {path: 'parentServer', populate: [
                    {path: 'members'},
                    {path: 'owner'},
                ]},
                {path: 'allowedUsers'},
            ]},
            {path: 'owner'},
        ]);

        return res.status(200).json(newServer);
        
    } catch (err) {
        return res.status(500).json(err);
    }
});

// サーバー情報取得
router.get('/info/:serverId', verify, async (req, res) => {
    const serverId = req.params.serverId;

    try {
        const server = await Server.findOne({ _id: serverId }).populate(['members', 'ownedChannels', 'owner']);
        if (!server) {
            return res.status(400).json('サーバーが存在しません');
        }

        return res.status(200).json(server);
        
    } catch (err) {
        return res.status(500).json(err);
    }
});

// router.get('/info/invitation/:invitationLink', verify, async (req, res) => {
//     const invitationLink = req.params.invitationLink;

//     try {
//         const server = await Server.findOne({ invitationLink }).populate([ 'members' ]);

//         return res.status(200).json(server);
        
//     } catch (err) {
//         return res.status(500).json(err);
//     }
// });

router.get('/join/:invitationLink', async (req, res) => {
    const token = req.cookies.access_token;
    console.log(token);
    const appUrl = process.env.CLIENT_APP_URL;
    const invitationLink = req.params.invitationLink;
    res.set({
        'Invited-Host': '',
    });
    return res.redirect(`${appUrl}/invite/${invitationLink}`);
});

router.post('/join', verify, async (req, res) => {
    const { serverId, currentUserId } = req.body;

    try {
        await Server.findByIdAndUpdate(serverId, {
            $addToSet: {
                members: currentUserId
            }
        }, {
            runValidators: true,
        });

        await Channel.updateMany({
            parentServer: serverId,
            privateChannel: false,
        }, {
            $addToSet: {
                allowedUsers: currentUserId,
            }
        }, {
            runValidators: true,
        });

        await User.findByIdAndUpdate(currentUserId, {
            $addToSet: {
                joinedServers: serverId,
            }
        }, {
            runValidators: true,
        });

        return res.status(200).json('サーバーに参加しました');

    } catch (err) {
        console.log(err);
    }
})

// 招待URLを作成・送信
router.post('/invitation/create', verify, async (req, res) => {
    const { link, currentUserId, friendId } = req.body;

    try {
        let newDirectMessage = await Channel.findOne({
            category: 'ダイレクトメッセージ',
            directMessage: true,
            allowedUsers: {
                $all: [
                    currentUserId,
                    friendId,
                ]
            }
        });
        if (!newDirectMessage) {
            return res.status(500).json('DMが存在しません');
        }

        let newMessage = await Message.create({
            postedChannel: newDirectMessage._id,
            type: '招待リンク',
            body: link,
            sender: currentUserId,
            readUsers: [currentUserId],
        });

        newMessage = await newMessage.populate([
            {path: 'postedChannel', populate: {path: 'allowedUsers'}},
            'sender',
            'readUsers',
        ]);

        newDirectMessage.latestMessage = newMessage._id;
        newDirectMessage = await newDirectMessage.save();

        await User.findByIdAndUpdate(currentUserId, {
            $addToSet: {
                setDirectMessages: newDirectMessage._id
            }
        }, { 
            runValidators: true 
        });

        return res.status(200).json({newMessage, newDirectMessage});
        
    } catch (err) {
        return res.status(500).json(err);
    }
});


// // サーバー招待/参加
// router.post('/invitation', verify, async (req, res) => {
//     const { currentUserId, passcode } = req.body;

//     try {
//         let targetServer = await Server.findOne({ _id: passcode });
//         if (!targetServer) {
//             return res.status(400).json('パスコードが正しくありません');
//         }

//         targetServer.members.push(currentUserId);
//         targetServer = await targetServer.save();

//         await User.findOneAndUpdate({ _id: currentUserId }, {
//             $push: {
//                 joinedServers: targetServer._id
//             }
//         }, { runValidators: true });

//         return res.status(200).json('サーバーに参加しました');
        
//     } catch (err) {
//         return res.status(500).json(err);
//     }
// });

// サーバープロフィール編集
router.post('/edit/profile', verify, async (req, res) => {
    const { serverId, newTitle, newPhotoURL, newDescription } = req.body;

    try {
        await User.findOneAndUpdate({ _id: serverId }, {
            $set: {
                title: newTitle,
                photoURL: newPhotoURL,
                description: newDescription
            }
        }, { runValidators: true });

        return res.status(200).json('変更を反映しました');
        
    } catch (err) {
        return res.status(500).json(err);
    }
});

module.exports = router;
