const mongoose = require('mongoose');
const validator = require("validator");

const userModel = new mongoose.Schema({
    user_email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
    },
    user_name: {
        type: String,
        required: [true, "Name is required"]
    },
    user_password: {
        type: String,
        required: [true, "Password is required"],
    },
    user_phone: {
        type: Number,
        required: [true, "Number is required"],
    },
    user_address: {
        type: String,
        required: false,
        default: "India",
    },
    user_status: {
        type: Boolean,
        required: false,
        default: 1
    },
    user_image: {
        type: String,
        required: false,
        default: ""
    }
}, { timestamps: true });

module.exports = mongoose.model('userModel', userModel);