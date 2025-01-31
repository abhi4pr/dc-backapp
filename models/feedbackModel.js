const mongoose = require('mongoose');
const validator = require("validator");

const feedbackModel = new mongoose.Schema({

    user_name: {
        type: String,
        required: [true, "Name is required"]
    },
    user_email: {
        type: String,
        required: [true, "Email is required"],
        validate: [validator.isEmail, "Please enter a valid email address"]
    },
    feed_message: {
        type: String,
        required: [true, "Feedback message is required"],
        minlength: [10, "Feedback message must be at least 10 characters long"]
    },
    feedback_image: {
        type: String,
        required: false,
        default: ""
    }
}, { timestamps: true });

module.exports = mongoose.model('feedbackModel', feedbackModel);
