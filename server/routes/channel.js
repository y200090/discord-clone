const router = require('express').Router();
const mongoose = require('mongoose');
const Server = require('../models/Server');
const Channel = require('../models/Channel');
const verify = require('../middleware/verify');

// チャンネル作成
router.post('/create', verify, async (req, res) => {
    const { channelName, serverId, category, privateChannel } = req.body;

    try {
        const channel = await Channel.create({
            title: channelName,
            serverId,
            privateChannel,
            category
        });

        await Server.findOne({ _id: serverId }, {
            $push: {
                ownedChannels: channel._id
            }
        }, { runValidators: true });

        return res.status(200).json(channel);
        
    } catch (err) {
        return res.status(500).json(err);
    }
});

// チャンネル情報取得
router.get('/info/:channelId', verify, async (req, res) => {
    const channelId = req.params.channelId;

    try {
        const channel = await Channel.findOne({ _id: channelId }).populate(['allowedUser', 'friends']);
        if (!channel) {
            return res.status(400).json('チャンネルが存在しません');
        }

        return res.status(200).json(channel);
        
    } catch (err) {
        return res.status(500).json(err);
    }
});

// router.get('/infos/owned/:serverId', verify, async (req, res) => {
//     const serverId = req.params.serverId;

//     try {
//         const channels = await Channel.find({ serverId });
//         if (!channels) {
//             return res.status(401).json('チャンネルが見つかりません');
//         }

//         return res.status(200).json(channels);
        
//     } catch (err) {
//         return res.status(500).json(err);
//     }
// })

module.exports = router;
