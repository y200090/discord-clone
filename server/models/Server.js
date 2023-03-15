const mongoose = require('mongoose');

const ServerSchema = new mongoose.Schema({
    serverName: {
        type: String, 
        required: true,
    },
    category: {
        type: String,
        default: 'その他'
    },
    tags: {
        type: Array,
        default: [],
    },
    description: {
        type: String, 
        default: '',
    },
    members: {
        type: Array,
        default: [],
    },
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
}, { timestamps: true });

module.exports = mongoose.model('Server', ServerSchema);
