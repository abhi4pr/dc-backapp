const quoteModel = require('../models/quoteModel');
const { fileUpload } = require('../fileUpload.js');
const variables = require('../variables.js')

exports.addQuote = async (req, res) => {
    try {
        const { quote_title, quote_desc } = req.body;
        const quote_img = req.fileUrl;

        // if (!quote_img) {
        //     return res.status(400).json({ message: "Quote image is required" });
        // }

        const newQuote = new quoteModel({
            quote_title,
            quote_desc,
            quote_img: quote_img
        });

        await newQuote.save();
        res.status(201).json({ message: "Quote added successfully", quote: newQuote });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
};

exports.getSingleQuote = async (req, res) => {
    try {
        const { quoteId } = req.params;

        const quote = await quoteModel.findById(quoteId);

        if (!quote) {
            return res.status(404).json({ message: "Quote not found" });
        }

        res.status(200).json({ message: "Quote retrieved successfully", quote });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
};

exports.getAllQuotes = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const totalQuotes = await quoteModel.countDocuments();

        const quotes = await quoteModel.find().skip(skip).limit(limit);
        const totalPages = Math.ceil(totalQuotes / limit);

        res.status(200).json({
            message: "Quotes retrieved successfully",
            quotes,
            pagination: {
                totalQuotes,
                totalPages,
                currentPage: page,
                perPage: limit,
            },
        });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
};

exports.updateQuote = async (req, res) => {
    try {
        const { quoteId } = req.params;
        const { quote_title, quote_desc } = req.body;

        const existingQuote = await quoteModel.findById(quoteId);
        if (!existingQuote) {
            return res.status(404).json({ message: "Quote not found" });
        }

        const updatedData = {
            quote_title: quote_title || existingQuote.quote_title,
            quote_desc: quote_desc || existingQuote.quote_desc,
            quote_img: existingQuote.quote_img
        };

        if (req.file) {
            updatedData.quote_img = req.fileUrl;
        }

        const updatedQuote = await quoteModel.findByIdAndUpdate(quoteId, updatedData, { new: true });

        res.status(200).json({ message: "Quote updated successfully", quote: updatedQuote });
    } catch (error) {
        console.error("Error updating quote:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

exports.deleteQuote = async (req, res) => {
    try {
        const { quoteId } = req.params;

        const deletedQuote = await quoteModel.findByIdAndDelete(quoteId);

        if (!deletedQuote) {
            return res.status(404).json({ message: "Quote not found" });
        }

        res.status(200).json({ message: "Quote deleted successfully", quote: deletedQuote });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
};