const mongoose = require('mongoose');

const videoModel = new mongoose.Schema({
    video_title: {
        type: String,
        required: [true, "Video title is required"]
    },
    video_desc: {
        type: String,
        required: [true, "Video description is required"]
    },
    video_src: {
        type: String,
        required: [false, "Video source is required"]
    },
    video_url: {
        type: String,
        required: [false, "Video URL is required"],
    },
    video_thumb: {
        type: String,
        required: [false, "Video thumbnail is not required"]
    },
    video_cat: {
        type: String,
        required: [true, "Video category is required"]
    }
}, { timestamps: true });

module.exports = mongoose.model('videoModel', videoModel);
