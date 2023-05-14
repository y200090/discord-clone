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
        let textChannel = await Channel.create({
            title: '一般',
            parentServer: newServer._id,
            allowedUsers: [currentUser._id]
        });

        const newMessage = await Message.create({
            postedChannel: textChannel?._id,
            type: 'サンプル',
            body: 'チャンネルが作成されました',
        });

        textChannel.latestMessage = newMessage?._id;
        textChannel = await textChannel.save();

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
        if (invitationLink.includes('/')) {
            invitationLink = invitationLink.replace(/\//g, `${Math.random().toString(36).slice(-1)}`);
        }

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
    const invitationLink = req.params.invitationLink;
    const token = req.cookies.access_token;
    console.log(token);
    const appUrl = process.env.CLIENT_APP_URL;
    // res.set({
    //     'Invited-Host': '',
    // });
    return res.redirect(`${appUrl}/invite/${invitationLink}`);
});

// サーバーに参加
router.post('/join', verify, async (req, res) => {
    const { serverId, currentUserId } = req.body;

    try {
        let joiningServer = await Server.findByIdAndUpdate(serverId, {
            $addToSet: {
                members: currentUserId
            }
        }, {
            runValidators: true,
            new: true,
        });

        joiningServer = await joiningServer.populate([
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

        await Channel.updateMany({
            parentServer: serverId,
            privateChannel: false,
        }, {
            $addToSet: {
                allowedUsers: currentUserId,
            }
        }, { runValidators: true });

        const currentUser = await User.findByIdAndUpdate(currentUserId, {
            $addToSet: {
                joinedServers: serverId,
            }
        }, {
            runValidators: true,
            new: true,
        });

        let newMessage = await Message.create({
            postedChannel: joiningServer?.ownedChannels[0]?._id,
            type: 'アナウンス',
            body: `${currentUser?.displayName}が${joiningServer?.title}に参加しました。`,
            sender: currentUserId,
            readUsers: [currentUserId],
        });

        newMessage = await newMessage.populate([
            {path: 'postedChannel', populate: {path: 'allowedUsers'}}, 
            {path: 'sender'}, 
            {path: 'readUsers'}
        ]);

        await Channel.findByIdAndUpdate(joiningServer.ownedChannels[0]._id, {
            $set: {
                latestMessage: newMessage._id,
            },
        }, { runValidators: true });

        return res.status(200).json({
            newMessage,
            currentUser,
            joiningServer
        });

    } catch (err) {
        console.log(err);
    }
});

// 招待URLを作成・DMへ送信
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
        }, { runValidators: true });

        return res.status(200).json({newMessage, newDirectMessage});
        
    } catch (err) {
        return res.status(500).json(err);
    }
});

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

// サーバーを削除
router.delete('/delete', verify, async (req, res) => {
    const { server, password } = req.body;

    try {
        if (password !== server?.title) {
            return res.status(401).json('サーバー名を正しく入力してください。');
        }

        await Server.findByIdAndDelete(server?._id);

        await Channel.deleteMany({ parentServer: server?._id })

        await User.updateMany({ joinedServers: server?._id }, {
            $pull: {
                joinedServers: server?._id,
            }
        }, { runValidators: true });

        const ownedChannelIds = server?.ownedChannels?.map((channel) => {
            return channel?._id;
        });

        await Message.deleteMany({
            postedChannel: {
                $in: ownedChannelIds
            }
        });
        
        return res.status(200).json(server);
        
    } catch (err) {
        return res.status(500).json(err);
    }
});

module.exports = router;
