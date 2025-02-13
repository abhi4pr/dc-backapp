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
        required: [false, "Reward stage is required"]
    }
}, { timestamps: true });

rewardModel.pre('save', async function (next) {
    if (!this.reward_stage) {
        const lastAgency = await this.constructor.findOne({}, {}, { sort: { 'reward_stage': -1 } });

        if (lastAgency && lastAgency.reward_stage) {
            this.reward_stage = lastAgency.reward_stage + 1;
        } else {
            this.reward_stage = 1;
        }
    }
    next();
});

module.exports = mongoose.model('rewardModel', rewardModel);
