const mongoose = require('mongoose');

const postsModel = new mongoose.Schema({
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