const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
    channelId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Channel'
    },
    body: {
        type: String,
        default: ''
    },
    sendedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    threadIds: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Thread'
    }]
}, { timestamps: true });

module.exports = mongoose.model('Message', MessageSchema);
