const router = require('express').Router();
const mongoose = require('mongoose');
const Message = require('../models/Message');
const Channel = require('../models/Channel');
const verify = require('../middleware/verify');

router.post('/post', verify, async (req, res) => {
    const { currentUser, message, channelId } = req.body;

    try {
        await Message.create({
            channelId,
            body: message,
            sendedBy: currentUser._id
        });

        return res.status(200).json('メッセージを送信しました');
        
    } catch (err) {
        return res.status(500).json(err);
    }
});

router.get('/history/:channelId', verify, async (req, res) => {
    const channelId = req.params.channelId;
    try {
        const messages = await Message.find({
            channelId: new mongoose.mongo.ObjectId(channelId)
        }).populate(['channelId', 'sendedBy']);

        return res.status(200).json(messages);
        
    } catch (err) {
        return res.status(500).json(err);
    }
})

module.exports = router;
