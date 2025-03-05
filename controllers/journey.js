const journeyCPsModel = require('../models/journeyCPsModel');
const userProgressModel = require('../models/userProgressModel');
const { fileUpload } = require('../fileUpload.js');
const variables = require('../variables.js');

exports.addCheckPointsByAdmin = async (req, res) => {
    try {
        const { cp_title, cp_desc, tasks, position, cp_video } = req.body;
        let videoUrl = cp_video;

        if (req.fileUrl) {
            videoUrl = req.fileUrl;
        }

        const newCheckpoint = new journeyCPsModel({
            cp_title,
            cp_desc,
            tasks,
            position,
            cp_video: videoUrl
        });

        await newCheckpoint.save();
        res.status(201).json({ message: "Checkpoint added successfully", checkpoint: newCheckpoint });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

exports.getAllCheckpoints = async (req, res) => {
    try {
        const checkpoints = await journeyCPsModel.find();
        res.status(200).json({ message: "Checkpoints retrieved successfully", checkpoints });
    } catch (error) {
        res.status(500).json({ message: "Error fetching checkpoints", error: error.message });
    }
};

exports.getCheckpointDetails = async (req, res) => {
    try {
        const { checkpointId } = req.params;
        const checkpoint = await journeyCPsModel.findById(checkpointId);

        if (!checkpoint) {
            return res.status(404).json({ error: "Checkpoint not found" });
        }

        res.status(200).json({ message: "Checkpoint retrieved successfully", checkpoint });
    } catch (error) {
        res.status(500).json({ message: "Error fetching checkpoint details", error: error.message });
    }
};

exports.getUserProgress = async (req, res) => {
    try {
        const { userId } = req.params;
        const progress = await userProgressModel.findOne({ user_id: userId });

        if (!progress)
            return res.status(200).json({ message: 'user progress retrieved successfully', completedCheckpoints: [] });

        res.status(200).json({ message: "User progress retrieved successfully", progress });
    } catch (error) {
        res.status(500).json({ message: "Error fetching user progress", error: error.message });
    }
};

exports.completeCheckpoint = async (req, res) => {
    try {
        const { checkpointId } = req.body;

        const checkpoint = await journeyCPsModel.findById(checkpointId);
        if (!checkpoint) {
            return res.status(404).json({ message: "Checkpoint not found" });
        }

        // Unlock the next checkpoint
        const nextCheckpoint = await journeyCPsModel.findOne({ cp_order: checkpoint.cp_order + 1 });
        if (nextCheckpoint) {
            nextCheckpoint.cp_unlocked = true;
            await nextCheckpoint.save();
        }

        res.status(200).json({ message: "Checkpoint completed, next unlocked!", nextCheckpoint });
    } catch (error) {
        res.status(500).json({ message: "Error completing checkpoint", error: error.message });
    }
};

exports.getTasksForCheckpoint = async (req, res) => {
    try {
        const { checkpointId } = req.params;
        const checkpoint = await journeyCPsModel.findById(checkpointId);

        if (!checkpoint) {
            return res.status(404).json({ error: "Checkpoint not found" });
        }

        res.status(200).json({ message: 'tasks retrieved successfully', tasks: checkpoint.tasks });
    } catch (error) {
        res.status(500).json({ message: "Error fetching tasks", error: error.message });
    }
};

exports.completeJourneyTask = async (req, res) => {
    try {
        const { userId, checkpointId, taskIndex } = req.body;

        let progress = await userProgressModel.findOne({ user_id: userId });

        if (!progress) {
            return res.status(404).json({ error: "User progress not found" });
        }

        if (!progress.completedTasks[checkpointId]) {
            progress.completedTasks[checkpointId] = [];
        }

        if (!progress.completedTasks[checkpointId].includes(taskIndex)) {
            progress.completedTasks[checkpointId].push(taskIndex);
        }

        // If all tasks for the checkpoint are completed, mark the checkpoint as completed
        const checkpoint = await journeyCPsModel.findById(checkpointId);
        if (checkpoint && checkpoint.tasks.length === progress.completedTasks[checkpointId].length) {
            if (!progress.completed_checkpoints.includes(checkpointId)) {
                progress.completed_checkpoints.push(checkpointId);
            }
            progress.current_checkpoint = checkpointId;
        }

        await progress.save();
        res.status(200).json({ message: "Task marked as completed", progress });
    } catch (error) {
        res.status(500).json({ message: "Error updating task progress", error: error.message });
    }
};

exports.startUserJourney = async (req, res) => {
    try {
        const { userId } = req.body;
        let progress = await userProgressModel.findOne({ user_id: userId });

        if (progress) {
            return res.json({ message: "Journey already started", progress });
        }

        const firstCheckpoint = await journeyCPsModel.findOne().sort({ cp_order: 1 });

        if (!firstCheckpoint) {
            return res.status(500).json({ error: "No checkpoints available" });
        }

        progress = new userProgressModel({
            userId,
            completedCheckpoints: [],
            currentCheckpoint: firstCheckpoint._id,
            completedTasks: {}
        });

        await progress.save();
        res.status(200).json({ message: "Journey started successfully", progress });
    } catch (error) {
        res.status(500).json({ message: "Error starting journey", error: error.message });
    }
};

exports.unlockNextCheckpoint = async (req, res) => {
    try {
        const { completedCheckpointId } = req.body;

        // Find the completed checkpoint
        const completedCheckpoint = await journeyCPsModel.findById(completedCheckpointId);
        if (!completedCheckpoint) {
            return res.status(404).json({ message: "Checkpoint not found" });
        }

        // Unlock the next checkpoint
        const nextCheckpoint = await journeyCPsModel.findOne({ cp_order: completedCheckpoint.cp_order + 1 });
        if (nextCheckpoint) {
            nextCheckpoint.cp_unlocked = true;
            await nextCheckpoint.save();
        }

        return res.status(200).json({ message: "Next checkpoint unlocked", nextCheckpoint });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};
