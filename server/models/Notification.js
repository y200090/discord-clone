const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
    recipient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    content: {
        type: String,
        default: ''
    },
}, {
    timestamps: true
});

module.exports = mongoose.model('Notification', NotificationSchema);
