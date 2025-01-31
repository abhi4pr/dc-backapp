const mongoose = require('mongoose');

const quoteModel = new mongoose.Schema({
    quote_title: {
        type: String,
        required: [true, "Quote title is required"]
    },
    quote_desc: {
        type: String,
        required: false,
    },
    quote_img: {
        type: String,
        required: [true, 'Quote Image is required'],
    },
    quote_seq: {
        type: Number,
        required: [true, "Task sequence is required"],
        min: [1, "Sequence must be at least 1"],
        default: 1
    }
}, { timestamps: true });

module.exports = mongoose.model('quoteModel', quoteModel);
