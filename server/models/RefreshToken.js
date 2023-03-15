const mongoose = require('mongoose');

const RefreshTokenSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId, 
        required: true
    }, 
    refreshToken: {
        type: String, 
        required: true
    },
    expireAt: {
        type: Date,
        default: Date.now,
        index: {
            expires: '1d'
        }
    }
});

module.exports = mongoose.model('RefreshToken', RefreshTokenSchema);
