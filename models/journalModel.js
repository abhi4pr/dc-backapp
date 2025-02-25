const mongoose = require('mongoose');

const journalModel = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    journal_desc: {
        type: String,
        required: true
    },
    journal_date: {
        type: Date,
        required: true,
        default: Date.now()
    },
}, {
    timestamps: true
});

module.exports = mongoose.model('journalModel', journalModel);