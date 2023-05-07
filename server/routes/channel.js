const router = require('express').Router();
const Server = require('../models/Server');
const Channel = require('../models/Channel');
const verify = require('../middleware/verify');
const User = require('../models/User');
const Message = require('../models/Message');

// チャンネル作成
router.post('/create', verify, async (req, res) => {
    const { channelName, serverId, category, privateChannel, allowedUsers } = req.body;

    try {
        let newChannel = await Channel.create({
            title: channelName,
            parentServer: serverId,
            privateChannel,
            category,
            allowedUsers
        });

        const newMessage = await Message.create({
            postedChannel: newChannel?._id,
            type: 'サンプル',
            body: 'チャンネルが作成されました',
        });

        newChannel.latestMessage = newMessage?._id;
        newChannel = await newChannel.save();
        newChannel = await newChannel.populate([
            {path: 'parentServer', populate: {path: 'members'}}, 
            {path: 'allowedUsers'}, 
            {path: 'notifications'},
        ]);
            
        await Server.findByIdAndUpdate(serverId, {
            $addToSet: {
                ownedChannels: newChannel._id
            }
        }, { 
            runValidators: true 
        });

        return res.status(200).json(newChannel);
        
    } catch (err) {
        return res.status(500).json(err);
    }
});

// チャンネル情報取得
router.get('/info/:channelId', verify, async (req, res) => {
    const channelId = req.params.channelId;

    try {
        const channel = await Channel.findOne({ _id: channelId }).populate([
            {path: 'parentServer', populate: {path: 'members'}}, 
            {path: 'allowedUsers'}, 
            {path: 'notifications'}
        ]);
        if (!channel) {
            return res.status(400).json('チャンネルが存在しません');
        }

        return res.status(200).json(channel);
        
    } catch (err) {
        return res.status(500).json(err);
    }
});

router.get('/participating-channels/:userId', verify, async (req, res) => {
    const userId = req.params.userId;

    try {
        const participatingChannels = await Channel.find({
            allowedUsers: userId,
        }).populate([
            {path: 'parentServer', populate: [
                {path: 'members'},
                {path: 'owner'},
            ]},
            {path: 'allowedUsers'},
            {path: 'latestMessage'}
        ]);

        return res.status(200).json(participatingChannels);
        
    } catch (err) {
        return res.status(500).json(err);
    }
});

// DMをセットに加える
router.post('/add/direct-message', verify, async (req, res) => {
    const { currentUserId, friendId } = req.body;

    try {
        const DM = await Channel.findOne({
            category: 'ダイレクトメッセージ',
            directMessage: true,
            allowedUsers: {
                $all: [
                    currentUserId,
                    friendId
                ]
            }
        }).populate(['allowedUsers']);
        if (!DM) {
            return res.status(500).json('DMが存在しません');
        }

        await User.findByIdAndUpdate(currentUserId, {
            $addToSet: {
                setDirectMessages: DM._id
            }
        }, { 
            runValidators: true 
        });
        
        return res.status(200).json(DM);
        
    } catch (err) {
        return res.status(500).json(err);
    }
});

// DMをセットから外す
router.post('/remove/direct-message', verify, async (req, res) => {
    const { currentUserId, directMessageId } = req.body;

    try {
        await User.findByIdAndUpdate(currentUserId, {
            $pull: {
                setDirectMessages: directMessageId
            }
        }, { 
            runValidators: true 
        });

        return res.status(200).json(directMessageId);
        
    } catch (err) {
        return res.status(500).json(err);
    }
});

// グループDM作成
router.post('/create/group-direct-message', verify, async (req, res) => {
    const { currentUser, targetUsers } = req.body;

    try {
        const colorCode = '#' + Math.random().toString(16).slice(-6);

        const targetUserIds = targetUsers.map((user) => {
            return user._id;
        });

        const targetUserDisplayNames = targetUsers.map((user) => {
            return user.displayName;
        });

        let newGroupDirectMessage = await Channel.create({
            title: `${currentUser.displayName}, ${targetUserDisplayNames.join(', ')}`,
            category: 'グループダイレクトメッセージ',
            directMessage: true,
            allowedUsers: [
                currentUser._id,
                ...targetUserIds
            ],
            color: colorCode
        });

        const newMessage = await Message.create({
            postedChannel: newGroupDirectMessage?._id,
            type: 'サンプル',
            body: 'チャンネルが作成されました',
        });

        newGroupDirectMessage.latestMessage = newMessage?._id;
        newGroupDirectMessage = await newGroupDirectMessage.save();
        newGroupDirectMessage = await newGroupDirectMessage.populate([
            {path: 'parentServer', populate: {path: 'members'}},
            {path: 'allowedUsers'},
            {path: 'notifications'},
        ]);

        await User.updateMany({
            _id: {
                $in: [
                    currentUser._id,
                    ...targetUserIds
                ]
            }
        }, {
            $addToSet: {
                setDirectMessages: newGroupDirectMessage._id
            }
        }, { 
            runValidators: true 
        });

        return res.status(200).json(newGroupDirectMessage);
        
    } catch (err) {
        return res.status(500).json(err);
    }
});

router.post('/withdraw', verify, async (req, res) => {
    const { channelId, withDrawnUser, isChecked } = req.body;
    
    try {
        let targetChannel = await Channel.findByIdAndUpdate(channelId, {
            $pull: {
                allowedUsers: withDrawnUser?._id,
            },
        }, {
            runValidators: true,
            new: true,
        });

        if (!isChecked) {
            let newMessage = await Message.create({
                postedChannel: channelId,
                type: 'アナウンス',
                body: `${withDrawnUser?.displayName}が${targetChannel?.title}を退出しました。`,
                sender: withDrawnUser?._id,
                readUsers: [withDrawnUser?._id],
            });

            newMessage = await newMessage.populate([
                {path: 'postedChannel', populate: {path: 'allowedUsers'}}, 
                {path: 'sender'}, 
                {path: 'readUsers'}
            ]);

            targetChannel.latestMessage = newMessage?._id;
            targetChannel = await targetChannel.save();
            targetChannel = await targetChannel.populate([
                {path: 'allowedUsers'},
                {path: 'latestMessage'},
            ]);

            return res.status(200).json({
                targetChannel,
                withDrawnUser, 
                newMessage,
            });
        }

        targetChannel = await targetChannel.populate([
            {path: 'allowedUsers'},
        ]);

        return res.status(200).json({
            targetChannel,
            withDrawnUser,
        });
        
    } catch (err) {
        return res.status(500).json(err);
    }
});

module.exports = router;
