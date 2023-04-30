const mongoose = require('mongoose');

const ChannelSchema = new mongoose.Schema({
    title: {
        type: String,
        default: ''
    },
    parentServer: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Server'
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
    allowedUsers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    directMessage: {
        type: Boolean,
        default: false
    },
    color: {
        type: String,
        default: ''
    },
    notifications: [{
        recipient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        content: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Message'
        }
    }],
    latestMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message',
    },
}, { 
    timestamps: true 
});

module.exports = mongoose.model('Channel', ChannelSchema);
