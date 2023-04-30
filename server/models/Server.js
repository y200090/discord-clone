const mongoose = require('mongoose');

const ServerSchema = new mongoose.Schema({
    title: {
        type: String, 
        required: true,
    },
    photoURL: {
        type: String,
        default: '',
    },
    category: {
        type: String,
        default: ''
    },
    tags: {
        type: Array,
        default: [],
    },
    description: {
        type: String, 
        default: '',
    },
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    ownedChannels: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Channel'
    }],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    invitationLink: {
        type: 'String',
        default: ''
    }
}, { 
    timestamps: true 
});

module.exports = mongoose.model('Server', ServerSchema);
