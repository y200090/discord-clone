const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    postedChannel: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Channel'
    },
    type: {
        type: String,
        default: 'テキスト'
    },
    body: {
        type: String,
        default: ''
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    readUsers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    reactions: {},
    threads: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Thread'
    }]
}, { 
    timestamps: true 
});

module.exports = mongoose.model('Message', MessageSchema);
