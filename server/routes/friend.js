const router = require('express').Router();
const mongoose = require('mongoose');
const User = require('../models/User');
const Channel = require('../models/Channel');
const verify = require('../middleware/verify');

// フレンド申請送信
router.post('/request/pending', verify, async (req, res) => {
    const { currentUser, targetTag } = req.body;

    try {
        const nonexistenceFlag = await User.findOne({ tag: targetTag });
        if (!nonexistenceFlag) {
            return res.status(400).json('フレンドリクエストに失敗しました。');
        }
        
        // ターゲットユーザーの保留中リストにカレントユーザーのIDを追加
        const targetUser = await User.findOneAndUpdate({ tag: targetTag }, {
            $addToSet: {
                'friends.pending': new mongoose.mongo.ObjectId(currentUser._id)
            }
        }, { 
            runValidators: true, 
            new: true, 
            upsert: true
        });

        const alreadyFlag = await User.findOne({ _id: currentUser._id, 'friends.waiting': targetUser._id});
        if (alreadyFlag) {
            return res.status(400).json('既にフレンドリクエストを送信しています。');
        }

        // カレントユーザーの返答待ち中リストにターゲットユーザーのIDを追加
        await User.findOneAndUpdate({ _id: currentUser._id }, {
            $addToSet: {
                'friends.waiting': new mongoose.mongo.ObjectId(targetUser._id)
            }
        }, { runValidators: true });

        return res.status(200).json(`成功です！${targetTag}さんにフレンドリクエストを送信しました。`);
        
    } catch (err) {
        return res.status(500).json(err);
    }
});

// フレンド申請承諾
router.post('/approval/pending', verify, async (req, res) => {
    const { currentUserId, targetUserId } = req.body;

    try {
        await User.findOneAndUpdate({ _id: currentUserId }, {
            $pull: {
                'friends.pending': new mongoose.mongo.ObjectId(targetUserId)
            },
            $push: {
                'friends.friend': new mongoose.mongo.ObjectId(targetUserId)
            }
        }, { runValidators: true });


        await User.findOneAndUpdate({ _id: targetUserId }, {
            $pull: {
                'friends.waiting': new mongoose.mongo.ObjectId(currentUserId)
            },
            $push: {
                'friends.friend': new mongoose.mongo.ObjectId(currentUserId)
            }
        }, { runValidators: true });
        
        // DM作成
        await Channel.create({
            category: 'ダイレクトメッセージ',
            directMessage: true,
            friends: [
                new mongoose.mongo.ObjectId(currentUserId),
                new mongoose.mongo.ObjectId(targetUserId)
            ]
        });

        return res.status(200).json('フレンド申請を承諾しました');
        
    } catch (err) {
        return res.status(401).json(err);
    }
});

// フレンド申請拒否
router.post('/denial/pending', verify, async (req, res) => {
    const { currentUserId, targetUserId } = req.body;

    try {
        await User.findOneAndUpdate({ _id: currentUserId }, {
            $pull: {
                'friends.pending': new mongoose.mongo.ObjectId(targetUserId)
            }
        }, { runValidators: true });

        await User.findOneAndUpdate({ _id: targetUserId }, {
            $pull: {
                'friends.waiting': new mongoose.mongo.ObjectId(currentUserId)
            }
        }, { runValidators: true });

        return res.status(200).json('フレンド申請を拒否しました');
        
    } catch (err) {
        return res.status(401).json(err);
    }
});

// フレンド申請キャンセル
router.post('/cancel/pending', verify, async (req, res) => {
    const { currentUserId, targetUserId } = req.body;

    try {
        await User.findOneAndUpdate({ _id: currentUserId }, {
            $pull: {
                'friends.waiting': new mongoose.mongo.ObjectId(targetUserId)
            }
        }, { runValidators: true });

        await User.findOneAndUpdate({ _id: targetUserId }, {
            $pull: {
                'friends.pending': new mongoose.mongo.ObjectId(currentUserId)
            }
        }, { runValidators: true });

        return res.status(200).json('フレンド申請をキャンセルしました');
        
    } catch (err) {
        return res.status(500).json(err);        
    }
})

// フレンドをブロック
// router.patch('/block/:currentUserId/blocking/:uid', verify, async (req, res) => {
//     const { currentUserId, uid } = req.params;

//     try {
//         // ブロックする側
//         await User.findOneAndUpdate({ _id: currentUserId }, {
//             $pull: {
//                 friends: [{
//                     friend: new mongoose.mongo.ObjectId(uid),
//                 }]
//             },
//             $push: {
//                 friends: [{
//                     blocking: new mongoose.mongo.ObjectId(uid),
//                 }]
//             },
//         }, { runValidators: true });

//         // ブロックされた側
//         await User.findOneAndUpdate({ _id: uid }, {
//             $pull: {
//                 friends: [{
//                     friend: new mongoose.mongo.ObjectId(currentUserId),
//                 }]
//             },
//             $push: {
//                 friends: [{
//                     blocked: new mongoose.mongo.ObjectId(currentUserId),
//                 }]
//             }
//         }, { runValidators: true });

//         return res.status(200).json('ブロックしました');
        
//     } catch (err) {
//         return res.status(401).json(err);
//     }
// });

// // ブロック解除
// router.patch('/unblock/:currentUserId/blocking/:uid', verify, async (req, res) => {
//     const { currentUserId, uid } = req.params;

//     try {
//         // ブロックした側
//         await User.findOneAndUpdate({ _id: currentUserId }, {
//             $pull: {
//                 friends: [{
//                     blocking: new mongoose.mongo.ObjectId(uid),
//                 }]
//             },
//             $push: {
//                 friends: [{
//                     friend: new mongoose.mongo.ObjectId(uid),
//                 }]
//             }
//         }, { runValidators: true });

//         // ブロックされた側
//         await User.findOneAndUpdate({ _id: uid }, {
//             $pull: {
//                 friends: [{
//                     blocked: new mongoose.mongo.ObjectId(currentUserId),
//                 }]
//             },
//             $push: {
//                 friends: [{
//                     friend: new mongoose.mongo.ObjectId(currentUserId),
//                 }]
//             }
//         }, { runValidators: true });

//         return res.status(200).json('ブロックを解除しました');
        
//     } catch (err) {
//         return res.status(401).json(err);
//     }
// });

// // フレンド削除
// router.delete('/delete/:currentUserId/delete/:uid', verify, async (req, res) => {
//     const { currentUserId, uid } = req.params;

//     try {
//         await User.findOneAndUpdate({ _id: currentUserId }, {
//             $pull: {
//                 friends: [{
//                     friend: new mongoose.mongo.ObjectId(uid),
//                 }]
//             }
//         }, { runValidators: true });

//         await User.findOneAndUpdate({ _id: uid }, {
//             $pull: {
//                 friends: [{
//                     friend: new mongoose.mongo.ObjectId(currentUserId),
//                 }]
//             }
//         }, { runValidators: true });
        
//     } catch (err) {
//         return res.status(401).json(err);
//     }
// });

// フレンド一覧を取得
router.get('/infos/:uid', verify, async (req, res) => {
    const uid = req.params.uid;

    try {
        const friends = await User.find({ 
            friends: { 
                friend: new mongoose.mongo.ObjectId(uid) 
            }
        });

        return res.status(200).json(friends);
        
    } catch (err) {
        return res.status(401).json(err);
    }
});

// DMを追加
router.post('/add/dm', verify, async (req, res) => {
    const { currentUserId, targetUserIds } = req.body;

    try {
        let channel = await Channel.findOne({ 
            directMessage: true, 
            friends: {
                $all: [
                    currentUserId,
                    ...targetUserIds
                ]
            }
        });

        if (!channel) {
            const colorCode = '#' + Math.random().toString(16).slice(-6);
            
            channel = await Channel.create({
                title: 'グループ',
                category: 'ダイレクトメッセージ',
                directMessage: true,
                friends: [
                    currentUserId,
                    ...targetUserIds
                ],
                color: colorCode
            });
        }

        await User.findOneAndUpdate({ _id: currentUserId }, {
            $addToSet: {
                'friends.dm': new mongoose.mongo.ObjectId(channel._id)
            }
        }, { runValidators: true });

        return res.status(200).json(channel._id);
        
    } catch (err) {
        return res.status(500).json(err);
    }
});

// DMを除外
router.post('/remove/dm', verify, async (req, res) => {
    const { currentUserId, directMessageId } = req.body;

    try {
        await User.findOneAndUpdate({ _id: currentUserId }, {
            $pull: {
                'friends.dm': new mongoose.mongo.ObjectId(directMessageId)
            }
        }, { runValidators: true });

        return res.status(200).json('DMを除外しました');
        
    } catch (err) {
        return res.status(500).json(err);
    }
});

module.exports = router;
