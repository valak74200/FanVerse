const mongoose = require('mongoose');

const betSchema = new mongoose.Schema({
    // PAS de champ _id ici, Mongoose va le générer automatiquement.
    question: {
        type: String,
        required: true
    },
    options: [String],
    bets: [{
        userId: String,
        option: String,
        amount: Number
    }],
    status: {
        type: String,
        enum: ['active', 'resolved', 'expired'], // Statuts possibles
        default: 'active'
    },
    winningOption: {
        type: String,
        default: null
    },
    totalPot: {
        type: Number,
        default: 0
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

module.exports = mongoose.model('Bet', betSchema);
