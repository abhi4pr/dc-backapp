const mongoose = require("mongoose");

const userProgressModel = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    checkpoint_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "JourneyCP",
        required: true
    },
    video_shown: {
        type: Boolean,
        default: false
    },
    description_shown: {
        type: Boolean,
        default: false
    },
    tasks_completed: [{ type: Boolean, default: false }],
    cp_unlocked: { type: Boolean, default: false },
});

module.exports = mongoose.model("userProgressModel", userProgressModel);