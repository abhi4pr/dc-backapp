import Video from "../models/Video.js";
import AppError from "../utils/AppError.js";
import asyncHandler from "../utils/asyncHandler.js";

// Add video
export const addVideo = asyncHandler(async (req, res) => {
    const { title, description, category } = req.body;

    if (!title) throw new AppError("Title is required", 400);
    if (!req.file) throw new AppError("Video file is required", 400);

    const videoPath = req.fileUrl;

    const video = await Video.create({
        title,
        description,
        category,
        videoFile: videoPath,
    });

    res.status(201).json({
        message: "Video added successfully",
        video,
    });
});

// Get all audios
export const getAllVideos = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1; // Default to page 1
    const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page
    const skip = (page - 1) * limit;

    const videos = await Video.find()
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

    const totalVideos = await Video.countDocuments();

    res.status(200).json({
        count: videos.length,
        total: totalVideos,
        page,
        totalPages: Math.ceil(totalVideos / limit),
        videos,
    });
});

// Get video by ID
export const getVideoById = asyncHandler(async (req, res) => {
    const video = await Video.findById(req.params.id);

    if (!video) throw new AppError("Video not found", 404);

    res.status(200).json({ video });
});

// Update video
export const updateVideo = asyncHandler(async (req, res) => {
    const updates = req.body;

    if (req.file) {
        updates.videoFile = req.fileUrl;
    }

    const updatedVideo = await Video.findByIdAndUpdate(
        req.params.id,
        { $set: updates },
        {
            new: true,
            runValidators: true,
        }
    );

    if (!updatedVideo) throw new AppError("Video not found", 404);

    res.status(200).json({
        message: "Video updated successfully",
        video: updatedVideo,
    });
});

// Delete video
export const deleteVideo = asyncHandler(async (req, res) => {
    const deleted = await Video.findByIdAndDelete(req.params.id);

    if (!deleted) throw new AppError("Video not found", 404);

    res.status(200).json({
        message: "Video deleted successfully",
    });
});
