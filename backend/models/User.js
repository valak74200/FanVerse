const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    _id: String, // Correct, car on utilise un ID personnalisé
    socketId: {
        type: String,
        required: true
    },
    fanTokenOwned: { // Ce champ n'est plus vraiment utilisé côté serveur, mais on le garde
        type: Boolean,
        default: true
    },
    chzBalance: {
        type: Number,
        default: 100 // Solde de départ
    },
});

module.exports = mongoose.model('User', userSchema);
