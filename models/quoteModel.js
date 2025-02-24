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
        required: [false, 'Quote Image is not required'],
    },
    quote_seq: {
        type: Number,
        required: [false, "Task sequence is required"],
        min: [1, "Sequence must be at least 1"]
        // default: 1
    }
}, { timestamps: true });

quoteModel.pre('save', async function (next) {
    if (!this.quote_seq) {
        const lastAgency = await this.constructor.findOne({}, {}, { sort: { 'quote_seq': -1 } });

        if (lastAgency && lastAgency.quote_seq) {
            this.quote_seq = lastAgency.quote_seq + 1;
        } else {
            this.quote_seq = 1;
        }
    }
    next();
});

module.exports = mongoose.model('quoteModel', quoteModel);