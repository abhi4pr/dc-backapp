const mongoose = require('mongoose');

const taskModel = new mongoose.Schema({
    task_title: {
        type: String,
        required: [true, "Task title is required"]
    },
    task_desc: {
        type: String,
        required: [false, "Task description is required"]
    },
    task_cat: {
        type: String,
        required: [true, "Task category is required"]
    },
    task_seq: {
        type: Number,
        required: [false, "Task sequence is required"],
        min: [1, "Sequence must be at least 1"]
        // default: 1
    }
}, { timestamps: true });

taskModel.pre('save', async function (next) {
    if (!this.task_seq) {
        const lastAgency = await this.constructor.findOne({}, {}, { sort: { 'task_seq': -1 } });

        if (lastAgency && lastAgency.task_seq) {
            this.task_seq = lastAgency.task_seq + 1;
        } else {
            this.task_seq = 1;
        }
    }
    next();
});

module.exports = mongoose.model('taskModel', taskModel);
