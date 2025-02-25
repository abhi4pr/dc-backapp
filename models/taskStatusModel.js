const mongoose = require('mongoose');

const taskStatusModel = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    task_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task',
        required: true
    },
    status: {
        type: Boolean,
        required: false,
        default: 0
    },
}, {
    timestamps: true
});

module.exports = mongoose.model('taskStatusModel', taskStatusModel);