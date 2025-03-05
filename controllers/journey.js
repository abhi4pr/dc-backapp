const journeyCPsModel = require('../models/journeyCPsModel');
const userProgressModel = require('../models/userProgressModel');
const { fileUpload } = require('../fileUpload.js');
const variables = require('../variables.js');

exports.getUserProgress = async (req, res) => {
    try {
        const { userId } = req.params;

        // Get all checkpoints user has interacted with
        const progress = await userProgressModel.find({ user_id: userId }).populate("checkpoint_id");

        // Find the current checkpoint (first one that is not completed)
        let completedCheckpoints = [];
        let currentCheckpoint = null;

        for (let record of progress) {
            if (record.tasks_completed.every(Boolean)) {
                completedCheckpoints.push(record.checkpoint_id);
            } else {
                currentCheckpoint = record.checkpoint_id;
                break;
            }
        }

        res.status(200).json({
            completed: completedCheckpoints,
            current: currentCheckpoint,
            progress: (completedCheckpoints.length / (completedCheckpoints.length + 1)) * 100 || 0
        });

    } catch (error) {
        res.status(500).json({ message: "Error fetching user progress", error });
    }
};

exports.getAllCheckpoints = async (req, res) => {
    try {
        const checkpoints = await journeyCPsModel.find().sort({ cp_order: 1 });
        res.status(200).json({ message: 'checkpoints retrieved successfully', checkpoints });
    } catch (error) {
        res.status(500).json({ message: "Error fetching checkpoints", error });
    }
};

exports.getCheckpointUserid = async (req, res) => {
    try {
        const { userId } = req.params;
        const checkpoints = await journeyCPsModel.find().sort("cp_order");
        const userProgress = await userProgressModel.find({ user_id: userId });

        // Map progress data with checkpoint details
        const journeyData = checkpoints.map(cp => {
            const userCp = userProgress.find(up => up.checkpoint_id.toString() === cp._id.toString());
            return {
                _id: cp._id,
                cp_title: cp.cp_title,
                cp_order: cp.cp_order,
                position: cp.position,
                cp_unlocked: userCp ? userCp.cp_unlocked : false,
                tasks_completed: userCp ? userCp.tasks_completed : false
            };
        });

        res.status(200).json({ message: 'user wise checkpoint detail retrieved', journeyData });
    } catch (error) {
        console.error("Error fetching journey checkpoints:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

exports.checkpointWithUser = async (req, res) => {
    try {
        const { checkpoint_id, user_id } = req.params;

        // Find the checkpoint by its _id
        // const checkpoint = await journeyCPsModel.findOne({ _id: checkpoint_id });
        // if (!checkpoint) {
        //     return res.status(404).json({ message: "Checkpoint not found" });
        // }

        // Find or create user progress for this checkpoint
        let userProgress = await userProgressModel.findOne({ user_id, checkpoint_id });

        if (!userProgress) {
            const firstCheckpoint = await journeyCPsModel.findOne().sort({ _id: 1 });
            const isFirstCheckpoint = firstCheckpoint && firstCheckpoint._id.toString() === checkpoint_id;

            userProgress = new userProgressModel({
                user_id,
                checkpoint_id,
                video_shown: false,
                description_shown: false,
                tasks_completed: [],
                cp_unlocked: isFirstCheckpoint ? true : false,
            });

            await userProgress.save();
        }

        res.status(200).json({ userProgress });
    } catch (error) {
        console.error("Error fetching checkpoint:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

exports.updateVideoSeen = async (req, res) => {
    try {
        const { user_id, checkpoint_id } = req.body;

        const progress = await userProgressModel.findOneAndUpdate(
            { user_id, checkpoint_id },
            { video_shown: true },
            { new: true, upsert: true }
        );

        res.json({ message: "Video marked as shown", progress });
    } catch (error) {
        console.error("Error updating video status:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

exports.updateDescSeen = async (req, res) => {
    try {
        const { user_id, checkpoint_id } = req.body;

        const progress = await userProgressModel.findOneAndUpdate(
            { user_id, checkpoint_id },
            { description_shown: true },
            { new: true, upsert: true }
        );

        res.json({ message: "Description marked as shown", progress });
    } catch (error) {
        console.error("Error updating description status:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

exports.updateTasksDone = async (req, res) => {
    try {
        const { user_id, checkpoint_id } = req.body;

        const progress = await userProgressModel.findOneAndUpdate(
            { user_id, checkpoint_id },
            { tasks_completed: true },
            { new: true, upsert: true }
        );

        res.json({ message: "Tasks marked as completed", progress });
    } catch (error) {
        console.error("Error updating tasks status:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

exports.unLockNextCheckpoint = async (req, res) => {
    try {
        const { user_id, checkpoint_id } = req.body;

        const currentCheckpoint = await journeyCPsModel.findById(checkpoint_id);
        if (!currentCheckpoint) {
            return res.status(404).json({ message: "Checkpoint not found" });
        }

        const nextCheckpoint = await JourneyCP.findOne({ cp_order: currentCheckpoint.cp_order + 1 });

        if (!nextCheckpoint) {
            return res.json({ message: "No more checkpoints to unlock", nextCheckpoint: null });
        }

        const progress = await userProgressModel.findOneAndUpdate(
            { user_id, checkpoint_id: nextCheckpoint._id },
            { cp_unlocked: true },
            { new: true, upsert: true }
        );

        res.json({ message: "Next checkpoint unlocked", progress });
    } catch (error) {
        console.error("Error unlocking next checkpoint:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

exports.getCheckpointDetails = async (req, res) => {
    try {
        const { _id } = req.params; // Correct parameter usage
        const checkpoint = await journeyCPsModel.findById(_id);

        if (!checkpoint) {
            return res.status(404).json({ message: "Checkpoint not found" });
        }

        res.status(200).json({ checkpoint });
    } catch (error) {
        console.error("Error fetching checkpoint details:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};
