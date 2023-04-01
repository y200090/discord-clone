const mongoose = require('mongoose');

const ChannelSchema = new mongoose.Schema({
    title: {
        type: String,
        default: ''
    },
    serverId: {
        type: mongoose.Schema.Types.ObjectId, 
    },
    privateChannel: {
        type: Boolean,
        default: false
    },
    category: {
        type: String,
        default: 'テキストチャンネル'
    },
    description: {
        type: String, 
        default: ''
    }, 
    allowedUser: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    directMessage: {
        type: Boolean,
        default: false
    },
    friends: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    color: {
        type: String,
        default: ''
    }
}, { timestamps: true });

module.exports = mongoose.model('Channel', ChannelSchema);
