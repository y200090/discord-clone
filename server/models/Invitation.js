const mongoose = require('mongoose');

const InvitationSchema = new mongoose.Schema({
    link: {
        type: String,
        default: ''
    },
    targetServer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Server',
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Invitation', InvitationSchema);
