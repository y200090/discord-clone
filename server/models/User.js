const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    tag: {
        type: String,
        default: '',
    },
    email: {
        type: String, 
        required: true,
        unique: true,
    }, 
    password: {
        type: String, 
        required: true,
    },
    displayName: {
        type: String,
        default: '',
    },
    photoURL: {
        type: String, 
        default: '',
    },
    color: {
        type: String,
        default: '',
    },
    description: {
        type: String, 
        default: '',
    },
    friends: {
        // フレンド状態
        friend: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }], 
        // 保留中
        pending: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }],
        // 返答待ち中
        waiting: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }],
        // ブロック中
        blocking: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }],
        // 被フロック中
        blocked: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }],
        // DM
        dm: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Channel'
        }]
    },
    joinedServers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Server'
    }],
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
