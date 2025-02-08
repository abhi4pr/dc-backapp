const mongoose = require('mongoose');

const postsModel = new mongoose.Schema({
    user_name: {
        type: String,
        required: [true, "Posted by user is required"],
        minlength: [3, "Posted by user must be at least 3 characters long"]
    },
    post_title: {
        type: String,
        required: [true, "Post title is required"],
        minlength: [5, "Post title must be at least 5 characters long"]
    },
    post_message: {
        type: String,
        required: [true, "Post message is required"],
        minlength: [10, "Post message must be at least 10 characters long"]
    },
    post_image: {
        type: String,
        required: false,
        default: ""
    }
}, { timestamps: true });

module.exports = mongoose.model('postsModel', postsModel);