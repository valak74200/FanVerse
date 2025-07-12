const mongoose = require('mongoose');

const emotionSchema = new mongoose.Schema({
    // PAS de champ _id ici.
    userId: {
        type: String,
        required: true
    },
    emotionType: {
        type: String,
        required: true
    },
    lastActivationTime: {
        type: Date,
        default: Date.now
    },
});

// Index pour optimiser la recherche et la suppression des émotions expirées
emotionSchema.index({ lastActivationTime: 1 });
emotionSchema.index({ userId: 1, emotionType: 1 }, { unique: true });


module.exports = mongoose.model('Emotion', emotionSchema);
