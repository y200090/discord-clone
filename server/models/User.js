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
    friends: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    setDirectMessages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Channel'
    }],
    joinedServers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Server'
    }],
    online: {
        type: Boolean,
        default: false
    },
    socketId: {
        type: String,
        default: ''
    }
}, { 
    timestamps: true 
});

module.exports = mongoose.model('User', UserSchema);
