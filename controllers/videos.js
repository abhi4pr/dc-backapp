const videoModel = require('../models/videoModel');
const { fileUpload } = require('../fileUpload.js');
const variables = require('../variables.js')

exports.addVideo = async (req, res) => {
    try {
        const { video_title, video_desc, video_url, video_cat } = req.body;
        const video_src = req.fileUrl;

        const newVideo = new videoModel({
            video_title,
            video_desc,
            video_src: video_src,
            video_url,
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

        const existingReward = await videoModel.findById(videoId);
        if (!existingReward) {
            return res.status(404).json({ message: "Video not found" });
        }

        const updatedData = {
            video_title: video_title || existingReward.video_title,
            video_desc: video_desc || existingReward.video_desc,
            video_url: video_url || existingReward.video_url,
            video_src: existingReward.video_src
        };

        if (req.file) {
            updatedData.video_src = req.fileUrl;
        }

        const updatedQuote = await videoModel.findByIdAndUpdate(videoId, updatedData, { new: true });

        res.status(200).json({ message: "Video updated successfully", video: updatedQuote });
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
