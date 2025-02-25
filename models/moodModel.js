const mongoose = require('mongoose');

const moodModel = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    mood: {
        type: String,
        required: true
    },
    mood_date: {
        type: Date,
        required: true,
        default: Date.now()
    },
}, {
    timestamps: true
});

module.exports = mongoose.model('moodModel', moodModel);