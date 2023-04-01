const router = require('express').Router();
const mongoose = require('mongoose');
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
            members: [new mongoose.mongo.ObjectId(currentUser._id)],
            owner: currentUser._id,
        });
        
        // カレントユーザーの”参加済みサーバー”配列を更新
        await User.findOneAndUpdate({ _id: currentUser._id }, {
            $push: {
                joinedServers: server._id
            }
        }, { runValidators: true });

        // メインテキストチャンネルを作成
        const textChannel = await Channel.create({
            title: '一般',
            serverId: server._id,
        });

        // ボイスチャンネルを作成
        const voiceChannel = await Channel.create({
            title: '一般',
            serverId: server._id,
            category: 'ボイスチャンネル'
        });

        // サーバーの”所有チャンネル”配列を更新
        server.ownedChannels.push(textChannel._id, voiceChannel._id)
        server = await server.save();

        return res.status(200).json(server);
        
    } catch (err) {
        return res.status(500).json(err);
    }
});

// router.patch('/join/:serverId', verify, async (req, res) => {
//     const serverId = req.params.serverId;
//     const currentUser = req.body.currentUser;

//     try {
//         await Server.findOneAndUpdate({ _id: serverId }, {
//             $push: {
//                 members: [{
//                     userId: currentUser._id,
//                 }]
//             }
//         }, { runValidators: true });

//         await User.findOneAndUpdate({ _id: currentUser._id }, {
//             $push: {
//                 joinedServers: serverId
//             }
//         }, { runValidators: true });

//         return res.status(200).json('サーバーに参加しました');
        
//     } catch (err) {
//         return res.status(500).json(err);
//     }
// });

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

// router.get('/infos/joined/:uid', verify, async (req, res) => {
//     const uid = req.params.uid;

//     try {
//         const servers = await Server.find({ 
//             members: { 
//                 $elemMatch: { 
//                     userId: new mongoose.mongo.ObjectId(uid) 
//                 } 
//             } 
//         });
//         if (!servers) {
//             return res.status(400).json('サーバーが存在しません');
//         }

//         return res.status(200).json(servers);
        
//     } catch (err) {
//         return res.status(500).json(err);
//     }
// })

module.exports = router;
