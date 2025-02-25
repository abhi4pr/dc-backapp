const mongoose = require('mongoose');
const taskStatusModel = require('../models/taskStatusModel');
const taskModel = require('../models/taskModel');

exports.getUserTaskStatuses = async (req, res) => {
    try {
        const { userId } = req.params;

        // Calculate the offset based on the current day
        const today = new Date();
        const dayNumber = Math.floor((today - new Date(today.getFullYear(), 0, 1)) / (24 * 60 * 60 * 1000)); // Day of the year
        const offset = (dayNumber % Math.ceil(await taskModel.countDocuments() / 3)) * 3; // Rotate tasks every 3 days

        // Fetch 3 tasks based on the offset
        const taskStatuses = await taskModel.find().sort('task_seq').skip(offset).limit(3);
        const userTaskStatuses = await taskStatusModel.find({ user_id: userId });

        const tasksWithStatus = taskStatuses.map(task => {
            const statusRecord = userTaskStatuses.find(status => status.task_id.toString() === task._id.toString());
            return {
                task_id: task._id,
                task_title: task.task_title,
                task_desc: task.task_desc,
                status: statusRecord ? statusRecord.status : false
            };
        });

        if (!tasksWithStatus.length) {
            return res.status(404).json({ message: "No tasks found for this user" });
        }

        res.status(200).json({ message: "User tasks retrieved successfully", tasks: tasksWithStatus });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
};

exports.updateTaskStatus = async (req, res) => {
    try {
        const { userId, taskId } = req.params;
        const { status } = req.body;

        const existingStatus = await taskStatusModel.findOne({ user_id: userId, task_id: taskId });

        let updatedTaskStatus;
        if (existingStatus) {
            updatedTaskStatus = await taskStatusModel.findByIdAndUpdate(existingStatus._id, { status, updated_at: Date.now() }, { new: true });
        } else {
            updatedTaskStatus = new taskStatusModel({ user_id: userId, task_id: taskId, status });
            await updatedTaskStatus.save();
        }

        res.status(200).json({ message: "Task status updated successfully", taskStatus: updatedTaskStatus });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
};
