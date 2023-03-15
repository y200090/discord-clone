const mongoose = require('mongoose');

const ChannelShema = new mongoose.Schema({
    ChannelName: {
        type: String,
        required: true,
    },
    visibility: {
        type: String,
        default: 'Public',
    },
    category: {
        type: String,
        default: '',
    },
    description: {
        type: String, 
        default: '',
    }, 
    allowedUser: {
        type: Array, 
        default: [],
    },
}, { timestamps: true });

module.exports = mongoose.model('Channel', ChannelShema);
