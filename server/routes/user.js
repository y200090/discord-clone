const router = require('express').Router();
const User = require('../models/User');
const RefreshToken = require('../models/RefreshToken');
const verify = require('../middleware/verify');

// カレントユーザー認証
router.get('/authenticated', verify, async (req, res) => {
    const refreshToken = req.cookies.refresh_token;
    if (!refreshToken) {
        return res.status(204).json('更新トークンがありません');
    }

    try {
        const token = await RefreshToken.findOne({ refreshToken });
        if (!token) {
            return res.status(403).json('トークンが見つかりません');
        }
        
        const user = await User.findOne({ 
            _id: token.userId 
        }).populate([
            {path: 'friends'}, 
            {path: 'setDirectMessages', populate: [
                {path: 'allowedUsers'},
                {path: 'notifications.recipient'},
                {path: 'notifications.content'}
            ]},
            {path: 'joinedServers', populate: [
                {path: 'members'},
                {path: 'ownedChannels'},
                {path: 'owner'}
            ]}, 
        ]);

        return res.status(200).json(user);
        
    } catch (err) {
        return res.status(401).json(err);
    }
});

// ユーザープロフィール編集
router.post('/edit/profile', verify, async (req, res) => {
    const { currentUserId, newPhotoURL, newBannerColor, newDescription } = req.body;

    try {
        await User.findOneAndUpdate({ _id: currentUserId }, {
            $set: {
                photoURL: newPhotoURL,
                color: newBannerColor,
                description: newDescription,
            }
        }, { runValidators: true });

        return res.status(200).json('変更を反映しました');
        
    } catch (err) {
        return res.status(500).json(err);
    }
});

module.exports = router;
