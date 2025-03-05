const mongoose = require("mongoose");

const userProgressModel = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, "User ID is required"]
    },
    completed_checkpoints: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Journey"
    }],
    current_checkpoint: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Checkpoint"
    }
});

module.exports = mongoose.model("userProgressModel", userProgressModel);