const feedbackModel = require('../models/feedbackModel');
const { fileUpload } = require('../fileUpload.js');
const variables = require('../variables.js')

exports.addFeedback = async (req, res) => {
    try {
        const { user_name, user_email, feed_message } = req.body;
        const feedback_image = req.file;

        let imageUrl = null;
        if (feedback_image) {
            imageUrl = await fileUpload(feedback_image);
        }

        const newFeedback = new feedbackModel({
            user_name,
            user_email,
            feed_message,
            feedback_image: imageUrl
        });

        await newFeedback.save();
        res.status(201).json({ message: "Feedback added successfully", feedback: newFeedback });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
};

exports.getSingleFeedback = async (req, res) => {
    try {
        const { feedbackId } = req.params;

        const feedback = await feedbackModel.findById(feedbackId);

        if (!feedback) {
            return res.status(404).json({ message: "Feedback not found" });
        }

        res.status(200).json({ message: "Feedback retrieved successfully", feedback });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
};

exports.getAllFeedbacks = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const totalFeedbacks = await feedbackModel.countDocuments();

        const feedbacks = await feedbackModel.find().skip(skip).limit(limit);
        const totalPages = Math.ceil(totalFeedbacks / limit);

        res.status(200).json({
            message: "Feedbacks retrieved successfully",
            feedbacks,
            pagination: {
                totalFeedbacks,
                totalPages,
                currentPage: page,
                perPage: limit,
            },
        });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
};

exports.deleteFeedback = async (req, res) => {
    try {
        const { feedbackId } = req.params;

        const deletedFeedback = await feedbackModel.findByIdAndDelete(feedbackId);
        if (!deletedFeedback) {
            return res.status(404).json({ message: "Feedback not found" });
        }

        res.status(200).json({ message: "Feedback deleted successfully", feedback: deletedFeedback });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
};