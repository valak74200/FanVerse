const mongoose = require('mongoose');

const collectiveActionSchema = new mongoose.Schema({
    // PAS de champ _id ici.
    action: {
        type: String,
        required: true
    },
    proposer: {
        type: String,
        required: true
    },
    yesVotes: {
        type: Number,
        default: 0
    },
    noVotes: {
        type: Number,
        default: 0
    },
    voters: { // Important pour suivre qui a voté
        type: [String],
        default: []
    },
    status: {
        type: String,
        enum: ['active', 'success', 'failed', 'expired'],
        default: 'active'
    },
    startTime: {
        type: Date,
        default: Date.now
    },
    endTime: {
        type: Date,
        required: true
    }
});

module.exports = mongoose.model('CollectiveAction', collectiveActionSchema);
