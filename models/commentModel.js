const mongoose = require('mongoose');

const commentModel = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, "User ID is required"]
    },
    post_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'postModel',
        required: [true, "Post ID is required"]
    },
    comment_message: {
        type: String,
        required: [true, "Comment message is required"],
        minlength: [1, "Comment must be at least 1 character long"]
    }
}, { timestamps: true });

module.exports = mongoose.model('commentModel', commentModel);
