const mongoose = require('mongoose');

const questionModel = new mongoose.Schema({
    question: {
        type: String,
        required: [true, "Question is required"]
    },
    options: [{
        type: String,
        required: true
    }]
}, { timestamps: true });

module.exports = mongoose.model('questionModel', questionModel);