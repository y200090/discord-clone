const router = require('express').Router();
const Message = require('../models/Message');
const verify = require('../middleware/verify');
const Channel = require('../models/Channel');

// メッセージ送信
router.post('/post', verify, async (req, res) => {
    const { currentUser, message, channelId } = req.body;

    try {
        let newMessage = await Message.create({
            postedChannel: channelId,
            body: message,
            sender: currentUser._id,
            readUsers: [currentUser._id]
        });

        newMessage = await newMessage.populate([
            {path: 'postedChannel', populate: {path: 'allowedUsers'}}, 
            'sender', 
            'readUsers'
        ]);

        return res.status(200).json(newMessage);
        
    } catch (err) {
        return res.status(500).json(err);
    }
});

// メッセージ一覧取得
router.get('/history/:channelId', verify, async (req, res) => {
    const channelId = req.params.channelId;

    try {
        const messages = await Message.find({
            postedChannel: channelId
        }).populate([
            {path: 'postedChannel', poupulate: {path: 'allowedUsers'}}, 
            'sender', 
            'readUsers'
        ]);
        if (messages.length) {
            return res.status(200).json(messages);

        } else {
            return res.status(200).json(null);
        }

        
    } catch (err) {
        return res.status(500).json(err);
    }
});

module.exports = router;
