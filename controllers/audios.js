const audioModel = require('../models/audioModel');
const { fileUpload } = require('../fileUpload.js');
const variables = require('../variables.js')

exports.addAudio = async (req, res) => {
    try {
        const { audio_title, audio_desc } = req.body;
        const audio_file = req.fileUrl;

        if (!audio_file) {
            return res.status(400).json({ message: "audio file is required" });
        }

        const newQuote = new audioModel({
            audio_title,
            audio_desc,
            audio_file: audio_file
        });

        await newQuote.save();
        res.status(201).json({ message: "Audio added successfully", audio: newQuote });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
};

exports.getSingleAudio = async (req, res) => {
    try {
        const { audioId } = req.params;

        const audio = await audioModel.findById(audioId);

        if (!audio) {
            return res.status(404).json({ message: "Audio not found" });
        }

        res.status(200).json({ message: "Audio retrieved successfully", audio });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
};

exports.getAllAudio = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const totalAudios = await audioModel.countDocuments();

        const audios = await audioModel.find().skip(skip).limit(limit);
        const totalPages = Math.ceil(totalAudios / limit);

        res.status(200).json({
            message: "audios retrieved successfully",
            audios,
            pagination: {
                totalAudios,
                totalPages,
                currentPage: page,
                perPage: limit,
            },
        });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
};

exports.updateAudio = async (req, res) => {
    try {
        const { audioId } = req.params;
        const { audio_title, audio_desc } = req.body;

        const existingAudio = await audioModel.findById(audioId);
        if (!existingAudio) {
            return res.status(404).json({ message: "Audio not found" });
        }

        const updatedData = {
            audio_title: audio_title || existingAudio.audio_title,
            audio_desc: audio_desc || existingAudio.audio_desc,
            audio_file: existingAudio.audio_file
        };

        if (req.file) {
            updatedData.audio_file = req.fileUrl;
        }

        const updatedAudio = await audioModel.findByIdAndUpdate(audioId, updatedData, { new: true });

        res.status(200).json({ message: "Quote updated successfully", quote: updatedAudio });
    } catch (error) {
        console.error("Error updating quote:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

exports.deleteAudio = async (req, res) => {
    try {
        const { audioId } = req.params;

        const deletedAudio = await audioModel.findByIdAndDelete(audioId);

        if (!deletedAudio) {
            return res.status(404).json({ message: "Audio not found" });
        }

        res.status(200).json({ message: "Audio deleted successfully", audio: deletedAudio });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
};