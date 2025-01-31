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
        required: [true, "Task sequence is required"],
        min: [1, "Sequence must be at least 1"],
        default: 1
    }
}, { timestamps: true });

module.exports = mongoose.model('taskModel', taskModel);
