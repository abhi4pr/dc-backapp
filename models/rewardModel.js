const mongoose = require('mongoose');

const rewardModel = new mongoose.Schema({
    reward_title: {
        type: String,
        required: [true, "Reward title is required"]
    },
    reward_desc: {
        type: String,
        required: [true, "Reward description is required"]
    },
    reward_logo: {
        type: String,
        required: [false, "Reward logo is not required"]
    },
    reward_stage: {
        type: Number,
        required: [true, "Reward stage is required"],
        min: [1, "Stage must be at least 1"],
        max: [90, "Stage must be at most 90"]
    }
}, { timestamps: true });

module.exports = mongoose.model('rewardModel', rewardModel);
