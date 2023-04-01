const mongoose = require('mongoose');

const ThreadSchema = new mongoose.Schema({
    messageId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message'
    },
    body: {
        type: String,
        default: ''
    },
    sendedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, { timestamps: true });

module.exports = mongoose.model('Thread', ThreadSchema);
