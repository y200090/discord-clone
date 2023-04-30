const router = require('express').Router();
const User = require('../models/User');
const verify = require('../middleware/verify');
const Server = require('../models/Server');

router.get('/get/info/:userId', verify, async (req, res) => {
    const userId = req.params.userId;

    try{
        const user = await User.findById(userId)
        .select('-password')
        .populate([
            {path: 'friends'}, 
            {path: 'setDirectMessages', populate: [
                {path: 'allowedUsers'},
                {path: 'notifications.recipient'},
                {path: 'notifications.content'}
            ]},
            {path: 'joinedServers', populate: [
                {path: 'members'},
                {path: 'ownedChannels', populate: [
                    {path: 'parentServer', populate: [
                        {path: 'members'},
                        {path: 'owner'},
                    ]},
                    {path: 'allowedUsers'},
                ]},
                {path: 'owner'}
            ]}, 
        ]);

        return res.status(200).json(user);

    } catch (err) {
        return res.status(500).json(err);
    }
});

router.get('/joined-servers/:userId', verify, async (req, res) => {
    const userId = req.params.userId;

    try {
        const joinedServers = await Server.find({ members: userId })
        .populate([
            {path: 'members'},
            {path: 'ownedChannels', populate: [
                {path: 'parentServer', populate: [
                    {path: 'members'},
                    {path: 'owner'},
                ]},
                {path: 'allowedUsers'},
            ]},
            {path: 'owner'}
        ]);

        return res.status(200).json(joinedServers);
        
    } catch (err) {
        return res.status(500).json(err);
    }
});

router.post('/edit/profile', verify, async (req, res) => {
    const { currentUserId, newPhotoURL, newBannerColor, newDescription } = req.body;

    try {
        await User.findOneAndUpdate({ _id: currentUserId }, {
            $set: {
                photoURL: newPhotoURL,
                color: newBannerColor,
                description: newDescription,
            }
        }, { 
            runValidators: true, 
        });

        return res.status(200).json('変更を反映しました');
        
    } catch (err) {
        return res.status(500).json(err);
    }
});

module.exports = router;
