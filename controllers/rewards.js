const rewardModel = require('../models/rewardModel');
const { fileUpload } = require('../fileUpload.js');
const variables = require('../variables.js')

exports.addReward = async (req, res) => {
    try {
        const { reward_title, reward_desc, reward_stage } = req.body;
        const reward_logo = req.file;

        let logoUrl = null;
        if (reward_logo) {
            logoUrl = await fileUpload(reward_logo);
        }

        const newReward = new rewardModel({
            reward_title,
            reward_desc,
            reward_logo: logoUrl,
            reward_stage
        });

        await newReward.save();
        res.status(201).json({ message: "Reward added successfully", reward: newReward });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
};

exports.getSingleReward = async (req, res) => {
    try {
        const { rewardId } = req.params;

        const reward = await rewardModel.findById(rewardId);

        if (!reward) {
            return res.status(404).json({ message: "Reward not found" });
        }

        res.status(200).json({ message: "Reward retrieved successfully", reward });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
};

exports.getAllRewards = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const totalRewards = await rewardModel.countDocuments();

        const rewards = await rewardModel.find().skip(skip).limit(limit);
        const totalPages = Math.ceil(totalRewards / limit);

        res.status(200).json({
            message: "Rewards retrieved successfully",
            rewards,
            pagination: {
                totalRewards,
                totalPages,
                currentPage: page,
                perPage: limit,
            },
        });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
};

exports.updateReward = async (req, res) => {
    try {
        const { rewardId } = req.params;
        const { reward_title, reward_desc, reward_stage } = req.body;

        const updatedData = {};

        if (reward_title) updatedData.reward_title = reward_title;
        if (reward_desc) updatedData.reward_desc = reward_desc;
        if (reward_stage) updatedData.reward_stage = reward_stage;

        const reward_logo = req.file;
        if (reward_logo) {
            updatedData.reward_logo = await fileUpload(reward_logo);
        }

        const updatedReward = await rewardModel.findByIdAndUpdate(rewardId, updatedData, { new: true });

        if (!updatedReward) {
            return res.status(404).json({ message: "Reward not found" });
        }

        res.status(200).json({ message: "Reward updated successfully", reward: updatedReward });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
};

exports.deleteReward = async (req, res) => {
    try {
        const { rewardId } = req.params;

        const deletedReward = await rewardModel.findByIdAndDelete(rewardId);

        if (!deletedReward) {
            return res.status(404).json({ message: "Reward not found" });
        }

        res.status(200).json({ message: "Reward deleted successfully", reward: deletedReward });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
};
