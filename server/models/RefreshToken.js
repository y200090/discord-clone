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
    createdAt: {
        type: Date, 
        default: Date.now, 
    }
});

RefreshTokenSchema.index(
    { "createdAt": 1 },
    { expireAfterSeconds: 60 }
);

module.exports = mongoose.model('RefreshToken', RefreshTokenSchema);
