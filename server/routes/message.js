const router = require('express').Router();
const Message = require('../models/Message');
const verify = require('../middleware/verify');
const Channel = require('../models/Channel');
const Server = require('../models/Server');

// メッセージ送信
router.post('/post', verify, async (req, res) => {
    const { currentUser, message, channelId } = req.body;

    let pattern = /^https?:\/\/[^\s/$.?#].[^\s]*$/i;
    let match;
    if (pattern.test(message)) {
        const baseUrl = process.env.SERVER_API_URL;
        const path = 'server/join';
        pattern = new RegExp(`^${baseUrl}/${path}/(.*)$`);
        match = message.match(pattern);
    }
    
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

        if (match) {
            const invitationLink = match[1];
            const flag = await Server.findOne({invitationLink});
            if (flag) {
                newMessage.type = '招待リンク';
                newMessage = await newMessage.save();
            }
        }

        await Channel.findByIdAndUpdate(channelId, {
            $set: {
                latestMessage: newMessage._id,
            },
        }, {
            runValidators: true,
        });

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
            postedChannel: channelId,
            type: {
                $ne: 'サンプル',
            },
        }).populate([
            {path: 'postedChannel', poupulate: {path: 'allowedUsers'}}, 
            'sender', 
            'readUsers'
        ]);
        
        return res.status(200).json({ 
            messages, 
            currentChannelId: channelId 
        });

    } catch (err) {
        return res.status(500).json(err);
    }
});

module.exports = router;
