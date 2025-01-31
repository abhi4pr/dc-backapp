const mongoose = require('mongoose');

const likeModel = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, "User ID is required"]
    },
    post_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'postModel',
        required: [true, "Post ID is required"]
    }
}, { timestamps: true });

module.exports = mongoose.model('likeModel', likeModel);