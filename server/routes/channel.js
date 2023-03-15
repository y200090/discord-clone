const router = require('express').Router();
const Channel = require('../models/Channel');
const verify = require('../middleware/verify');

router.post('/create', verify, async (req, res) => {
    const { channelName, visibility } = req.body;

});
