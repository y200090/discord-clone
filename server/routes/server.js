const router = require('express').Router();
const User = require('../models/User');
const Server = require('../models/Server');
const Channel = require('../models/Channel');
const verify = require('../middleware/verify');

// サーバー作成
router.post('/create', verify, async (req, res) => {
    const { serverName, photoURL, category, currentUser } = req.body;

    try {
        // サーバーを新規作成
        let server = await Server.create({
            title: serverName,
            photoURL, 
            category,
            members: [currentUser._id],
            owner: currentUser._id,
        });
        
        // カレントユーザーの”参加済みサーバー”配列を更新
        await User.findOneAndUpdate({ _id: currentUser._id }, {
            $addToSet: {
                joinedServers: server._id
            }
        }, { runValidators: true });

        // メインテキストチャンネルを作成
        const textChannel = await Channel.create({
            title: '一般',
            parentServer: server._id,
            allowedUsers: [currentUser._id]
        });

        // ボイスチャンネルを作成
        const voiceChannel = await Channel.create({
            title: '一般',
            parentServer: server._id,
            category: 'ボイスチャンネル',
            allowedUsers: [currentUser._id]
        });

        // サーバーの”所有チャンネル”配列を更新
        server.ownedChannels.push(textChannel._id, voiceChannel._id)
        server = await server.save();

        return res.status(200).json(server);
        
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

// サーバー参加
router.post('/join', verify, async (req, res) => {
    const { serverId, currentUserId } = req.body;

    try {
        await Server.findOneAndUpdate({ _id: serverId }, {
            $addToSet: {
                members: currentUserId
            }
        }, { runValidators: true });

        await Channel.updateMany({
            parentServer: serverId,
            privateChannel: false,
        }, {
            $addToSet: {
                allowedUsers: currentUserId
            }
        }, { runValidators: true });

        await User.findOneAndUpdate({ _id: currentUserId }, {
            $addToSet: {
                joinedServers: serverId
            }
        }, { runValidators: true });

        return res.status(200).json('サーバーに参加しました');
        
    } catch (err) {
        return res.status(500).json(err);
    }
});

// サーバー招待/参加
router.post('/invitation', verify, async (req, res) => {
    const { currentUserId, passcode } = req.body;

    try {
        let targetServer = await Server.findOne({ _id: passcode });
        if (!targetServer) {
            return res.status(400).json('パスコードが正しくありません');
        }

        targetServer.members.push(currentUserId);
        targetServer = await targetServer.save();

        await User.findOneAndUpdate({ _id: currentUserId }, {
            $push: {
                joinedServers: targetServer._id
            }
        }, { runValidators: true });

        return res.status(200).json('サーバーに参加しました');
        
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

module.exports = router;
