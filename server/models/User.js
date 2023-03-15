const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    uid: {
        type: Number,
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
    friends: {
        type: Array, 
        default: [],
    },
    channels: {
        type: Array, 
        default: [],
    },
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
