const videoModel = require('../models/videoModel');
const { fileUpload } = require('../fileUpload.js');
const variables = require('../variables.js')

exports.addVideo = async (req, res) => {
    try {
        const { video_title, video_desc, video_url, video_cat } = req.body;

        const video_src = req.files.video_src;
        const video_thumb = req.files.video_thumb;

        if (!video_src) {
            return res.status(400).json({ message: "Video file is required" });
        }

        let videoSrcUrl = null;
        if (video_src && video_src[0]) {
            videoSrcUrl = await fileUpload(video_src[0]);
        }

        let thumbUrl = null;
        if (video_thumb && video_thumb[0]) {
            thumbUrl = await fileUpload(video_thumb[0]);
        }

        const newVideo = new videoModel({
            video_title,
            video_desc,
            video_src: videoSrcUrl,
            video_url,
            video_thumb: thumbUrl,
            video_cat
        });

        await newVideo.save();
        res.status(201).json({ message: "Video added successfully", video: newVideo });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
};

exports.getSingleVideo = async (req, res) => {
    try {
        const { videoId } = req.params;

        const video = await videoModel.findById(videoId);

        if (!video) {
            return res.status(404).json({ message: "Video not found" });
        }

        res.status(200).json({ message: "Video retrieved successfully", video });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
};

exports.getAllVideos = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const totalVideos = await videoModel.countDocuments();

        const videos = await videoModel.find().skip(skip).limit(limit);
        const totalPages = Math.ceil(totalVideos / limit);

        res.status(200).json({
            message: "Videos retrieved successfully",
            videos,
            pagination: {
                totalVideos,
                totalPages,
                currentPage: page,
                perPage: limit,
            },
        });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
};

exports.updateVideo = async (req, res) => {
    try {
        const { videoId } = req.params;
        const { video_title, video_desc, video_url, video_cat } = req.body;

        const video_src = req.files.video_src;
        const video_thumb = req.files.video_thumb;

        const updatedData = {};

        if (video_title) updatedData.video_title = video_title;
        if (video_desc) updatedData.video_desc = video_desc;
        if (video_url) updatedData.video_url = video_url;
        if (video_cat) updatedData.video_cat = video_cat;

        if (video_src && video_src[0]) {
            updatedData.video_src = await fileUpload(video_src[0]);
        }

        if (video_thumb && video_thumb[0]) {
            updatedData.video_thumb = await fileUpload(video_thumb[0]);
        }

        const updatedVideo = await videoModel.findByIdAndUpdate(videoId, updatedData, { new: true });

        if (!updatedVideo) {
            return res.status(404).json({ message: "Video not found" });
        }

        res.status(200).json({ message: "Video updated successfully", video: updatedVideo });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
};


exports.deleteVideo = async (req, res) => {
    try {
        const { videoId } = req.params;

        const deletedVideo = await videoModel.findByIdAndDelete(videoId);

        if (!deletedVideo) {
            return res.status(404).json({ message: "Video not found" });
        }

        res.status(200).json({ message: "Video deleted successfully", video: deletedVideo });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
};
