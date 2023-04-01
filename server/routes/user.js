const router = require('express').Router();
const mongoose = require('mongoose');
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
        
        const user = await User.findOne({ _id: token.userId }).populate([{path: 'joinedServers'}, {path: 'friends.friend'}, {path: 'friends.pending'}, {path: 'friends.waiting'}, {path: 'friends.blocking'}, {path: 'friends.blocked'}, {path: 'friends.dm', populate: {path: 'friends'}}]);

        return res.status(200).json(user);
        
    } catch (err) {
        return res.status(401).json(err);
    }
});

router.get('/info/:uid', verify, async (req, res) => {
    const uid = req.params.uid;

    try {
        const user = await User.findOne({ _id: uid });
        if (!user) {
            return res.status(200).json('ユーザーが存在しません');
        }

        return res.status(200).json(user);
        
    } catch (err) {
        return res.status(401).json(err);
    }
});

// router.get('/infos/friends/pendingUser/:uid', verify, async (req, res) => {
//     const uid = req.params.uid;

//     try {
//         const pendingUser = await User.find({
//             'friends.waiting': new mongoose.mongo.ObjectId(uid)
//         });

//         return res.status(200).json(pendingUser);
        
//     } catch (err) {
//         return res.status(500).json(err);
//     }
// });

// router.get('/infos/friends/waitingUser/:uids', verify, async (req, res) => {
//     const uids = req.params.uids;
//     if (uids === 'none') {
//         return res.status(200).json([]);
//     }
//     const datas = uids.split(',');

//     try {
//         const waitingUsers = await User.find({ _id: { $in: datas } });

//         return res.status(200).json(waitingUsers);
        
//     } catch (err) {
//         return res.status(500).json(err);
//     }
// });

// router.get('/infos/select/:uids', verify, async (req, res) => {
//     const uids = req.params.uids;
    // const datas = uids.split(',');

//     try {
//         const selectUsers = await User.find({ _id: { $in: datas } });

//         return res.status(200).json(selectUsers);
        
//     } catch (err) {
//         return res.status(500).json(err);
//     }
// });

module.exports = router;
