const router = require('express').Router();
const User = require('../models/User');
const RefreshToken = require('../models/RefreshToken');
const verify = require('../middleware/verify');

router.post('/authenticated', verify, async (req, res) => {
    const refreshToken = req.cookies.refresh_token;

    if (!refreshToken) {
        return res.status(401).json('更新トークンがありません');
    }
    try {
        const token = await RefreshToken.findOne({ refreshToken }).exec();
        const user = await User.findOne({ _id: token.userId }).exec();
        if (!user) {
            return res.status(401).json('ユーザーが存在しません');
        }

        return res.status(200).json(user);
        
    } catch (err) {
        return res.status(500).json(err);
    }
});

router.get('/:uid', verify, async (req, res) => {
    const uid = req.params.uid;

    try {
        const user = await User.findOne({ _id: uid }).exec();
        if (!user) {
            return res.status(401).json('ユーザーが存在しません');
        }

        return res.status(200).json(user);
        
    } catch (err) {
        return res.status(500).json(err);
    }
})

module.exports = router;
