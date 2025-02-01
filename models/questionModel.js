const mongoose = require('mongoose');

const questionModel = new mongoose.Schema({
    question: {
        type: String,
        required: [true, "Question is required"]
    },
    options: [{
        type: String,
        required: true
    }],
    question_seq: {
        type: Number,
        required: [false, "Task sequence is required"],
        min: [1, "Sequence must be at least 1"]
    }
}, { timestamps: true });

questionModel.pre('save', async function (next) {
    if (!this.question_seq) {
        const lastAgency = await this.constructor.findOne({}, {}, { sort: { 'question_seq': -1 } });

        if (lastAgency && lastAgency.question_seq) {
            this.question_seq = lastAgency.question_seq + 1;
        } else {
            this.question_seq = 1;
        }
    }
    next();
});

module.exports = mongoose.model('questionModel', questionModel);