const router = require('express').Router();
const User = require('../models/User');
const FriendRequest = require('../models/FriendRequest');
const Channel = require('../models/Channel');
const verify = require('../middleware/verify');
const Message = require('../models/Message');

// フレンド申請一覧取得
router.get('/request/get/:userId', verify, async (req, res) => {
    const userId = req.params.userId;

    try {
        const requests = await FriendRequest.find({
            $or: [
                { to: userId },
                { from: userId }
            ]
        }).populate([
            {path: 'from'},
            {path: 'to'}
        ]);

        return res.status(200).json(requests);
        
    } catch (err) {
        return res.status(500).json(err);
    }
})

// フレンド申請送信
router.post('/request/post', verify, async (req, res) => {
    const { currentUserId, targetUserTag } = req.body;

    try {
        const targetUser = await User.findOne({ tag: targetUserTag });
        if (!targetUser) {
            return res.status(400).json('フレンドリクエストに失敗しました');
        }

        const alreadyFlag = await FriendRequest.findOne({
            to: targetUser._id,
            from: currentUserId
        });
        if (alreadyFlag) {
            return res.status(400).json('既にフレンドリクエストを送信しています。');
        }

        let newFriendRequest = await FriendRequest.create({
            to: targetUser._id,
            from: currentUserId
        });

        newFriendRequest = await newFriendRequest.populate([
            'to', 'from',
        ]);

        return res.status(200).json({
            message: `成功です！${targetUserTag}さんにフレンドリクエストを送信しました。`,
            request: newFriendRequest,
        });
        
    } catch (err) {
        return res.status(500).json(err);
    }
});

// フレンド申請承諾
router.post('/approve/friend-request', verify, async (req, res) => {
    const { request } = req.body;

    try {
        await FriendRequest.findByIdAndDelete(request._id);

        await User.findByIdAndUpdate(request.to._id, {
            $push: {
                friends: request.from._id
            }
        }, { 
            runValidators: true 
        });

        await User.findByIdAndUpdate(request.from._id, {
            $push: {
                friends: request.to._id
            }
        }, { 
            runValidators: true 
        });

        let newDirectMessage = await Channel.create({
            category: 'ダイレクトメッセージ',
            allowedUsers: [
                request.to._id,
                request.from._id
            ],
            directMessage: true,
        });

        newDirectMessage = await newDirectMessage.populate([
            {path: 'allowedUsers'},
            {path: 'notifications'}
        ]);

        return res.status(200).json({request, newDirectMessage});
        
    } catch (err) {
        return res.status(500).json(err);
    }
});

// フレンド申請削除
router.post('/discard/friend-request', verify, async (req, res) => {
    const { request } = req.body;

    try {
        await FriendRequest.findByIdAndDelete(request._id);

        return res.status(200).json(request);
        
    } catch (err) {
        return res.status(500).json(err);
    }
});

// フレンド削除
router.post('/delete', verify, async (req, res) => {
    const { currentUser, friend } = req.body;

    try {
        await User.findByIdAndUpdate(currentUser._id, {
            $pull: {
                friends: friend._id
            }
        }, { 
            runValidators: true 
        });

        await User.findByIdAndUpdate(friend._id, {
            $pull: {
                friends: currentUser._id
            }
        }, { 
            runValidators: true 
        });

        const deleteChannel = await Channel.findOneAndDelete({
            category: 'ダイレクトメッセージ',
            directMessage: true,
            allowedUsers: {
                $all: [
                    currentUser._id,
                    friend._id
                ]
            }
        });

        await Message.deleteMany({ postedChannel: deleteChannel._id });

        return res.status(200).json(`${friend.displayName}さんをフレンドから削除しました`);
        
    } catch (err) {
        return res.status(500).json(err);
    }
});




// // フレンド申請送信
// router.post('/request/pending', verify, async (req, res) => {
//     const { currentUser, targetTag } = req.body;

//     try {
//         const nonexistenceFlag = await User.findOne({ tag: targetTag });
//         if (!nonexistenceFlag) {
//             return res.status(400).json('フレンドリクエストに失敗しました。');
//         }
        
//         // ターゲットユーザーの保留中リストにカレントユーザーのIDを追加
//         const targetUser = await User.findOneAndUpdate({ tag: targetTag }, {
//             $addToSet: {
//                 'friends.pending': new mongoose.mongo.ObjectId(currentUser._id)
//             }
//         }, { 
//             runValidators: true, 
//             new: true, 
//             upsert: true
//         });

//         const alreadyFlag = await User.findOne({ _id: currentUser._id, 'friends.waiting': targetUser._id});
//         if (alreadyFlag) {
//             return res.status(400).json('既にフレンドリクエストを送信しています。');
//         }

//         // カレントユーザーの返答待ち中リストにターゲットユーザーのIDを追加
//         await User.findOneAndUpdate({ _id: currentUser._id }, {
//             $addToSet: {
//                 'friends.waiting': new mongoose.mongo.ObjectId(targetUser._id)
//             }
//         }, { runValidators: true });

//         return res.status(200).json(`成功です！${targetTag}さんにフレンドリクエストを送信しました。`);
        
//     } catch (err) {
//         return res.status(500).json(err);
//     }
// });

// フレンド申請承諾
// router.post('/approval/pending', verify, async (req, res) => {
//     const { currentUserId, targetUserId } = req.body;

//     try {
//         await User.findOneAndUpdate({ _id: currentUserId }, {
//             $pull: {
//                 'friends.pending': new mongoose.mongo.ObjectId(targetUserId)
//             },
//             $push: {
//                 'friends.friend': new mongoose.mongo.ObjectId(targetUserId)
//             }
//         }, { runValidators: true });


//         await User.findOneAndUpdate({ _id: targetUserId }, {
//             $pull: {
//                 'friends.waiting': new mongoose.mongo.ObjectId(currentUserId)
//             },
//             $push: {
//                 'friends.friend': new mongoose.mongo.ObjectId(currentUserId)
//             }
//         }, { runValidators: true });
        
//         // DM作成
//         await Channel.create({
//             category: 'ダイレクトメッセージ',
//             directMessage: true,
//             friends: [
//                 new mongoose.mongo.ObjectId(currentUserId),
//                 new mongoose.mongo.ObjectId(targetUserId)
//             ]
//         });

//         return res.status(200).json('フレンド申請を承諾しました');
        
//     } catch (err) {
//         return res.status(401).json(err);
//     }
// });

// フレンド申請拒否


// フレンド申請キャンセル


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
// router.get('/infos/:uid', verify, async (req, res) => {
//     const uid = req.params.uid;

//     try {
//         const friends = await User.find({ 
//             friends: { 
//                 friend: new mongoose.mongo.ObjectId(uid) 
//             }
//         });

//         return res.status(200).json(friends);
        
//     } catch (err) {
//         return res.status(401).json(err);
//     }
// });


module.exports = router;
