const { fileUpload } = require('../fileUpload.js');
const variables = require('../variables.js')
const taskModel = require('../models/taskModel');

exports.addTask = async (req, res) => {
    try {
        const { task_title, task_desc, task_cat } = req.body;

        const newTask = new taskModel({
            task_title,
            task_desc,
            task_cat,
            // task_seq
        });

        await newTask.save();
        res.status(201).json({ message: "Task added successfully", task: newTask });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
};

exports.getSingleTask = async (req, res) => {
    try {
        const { taskId } = req.params;

        const task = await taskModel.findById(taskId);

        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        res.status(200).json({ message: "Task retrieved successfully", task });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
};

exports.getAllTasks = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const totalTasks = await taskModel.countDocuments();

        const tasks = await taskModel.find().skip(skip).limit(limit);
        const totalPages = Math.ceil(totalTasks / limit);

        res.status(200).json({
            message: "Tasks retrieved successfully",
            tasks,
            pagination: {
                totalTasks,
                totalPages,
                currentPage: page,
                perPage: limit,
            },
        });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
};

exports.updateTask = async (req, res) => {
    try {
        const { taskId } = req.params;
        const { task_title, task_desc, task_cat } = req.body;

        const updatedData = {};

        if (task_title) updatedData.task_title = task_title;
        if (task_desc) updatedData.task_desc = task_desc;
        if (task_cat) updatedData.task_cat = task_cat;
        // if (task_seq) updatedData.task_seq = task_seq;

        const updatedTask = await taskModel.findByIdAndUpdate(taskId, updatedData, { new: true });

        if (!updatedTask) {
            return res.status(404).json({ message: "Task not found" });
        }

        res.status(200).json({ message: "Task updated successfully", task: updatedTask });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
};

exports.deleteTask = async (req, res) => {
    try {
        const { taskId } = req.params;

        const deletedTask = await taskModel.findByIdAndDelete(taskId);

        if (!deletedTask) {
            return res.status(404).json({ message: "Task not found" });
        }

        res.status(200).json({ message: "Task deleted successfully", task: deletedTask });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
};
