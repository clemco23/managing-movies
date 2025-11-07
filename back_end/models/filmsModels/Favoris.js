const mongoose = require('mongoose');
const favorisSchema = new mongoose.Schema({
    film: { type: mongoose.Schema.Types.ObjectId, ref: 'Film', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

exports = module.exports = mongoose.model('Favoris', favorisSchema);