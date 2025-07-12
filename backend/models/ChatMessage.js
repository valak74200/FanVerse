const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema({
    // PAS de champ _id ici.
    roomId: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model('ChatMessage', chatMessageSchema);
