const router = require('express').Router();
const User = require('../models/User');
const Server = require('../models/Server');
const Invitation = require('../models/Invitation');
const verify = require('../middleware/verify');

router.get('/info/:serverId/:userId', verify, async (req, res) => {
    const { serverId, userId } = req.params;

    console.log(serverId, userId)

    try {
        const invitation = await Invitation.findOne({
            targetServer: serverId,
            sender: userId,
        });

        return res.status(200).json(invitation);
        
    } catch (err) {
        return res.status(500).json(err);
    }
});

router.get('/info.server/:invitationLink', async (req, res) => {
    const invitationLink = req.params.invitationLink;

    try {
        const invitation = await Invitation.findOne({ link: invitationLink })
        .populate([
            {path: 'targetServer', populate: [
                {path: 'members'}
            ]},
            {path: 'sender'}
        ]);

        // const server =invitation.targetServer;

        return res.status(200).json(invitation)
        
    } catch (err) {
        return res.status(500).json(err);
    }
})

module.exports = router;
