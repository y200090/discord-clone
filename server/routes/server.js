const router = require('express').Router();
const Server = require('../models/Server');
const verify = require('../middleware/verify');

router.post('/create', verify, async (req, res) => {
    const { serverName, admin } = req.body;


});
