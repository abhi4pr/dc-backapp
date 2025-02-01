const quoteModel = require('../models/quoteModel');
const { fileUpload } = require('../fileUpload.js');
const variables = require('../variables.js')

exports.addQuote = async (req, res) => {
    try {
        const { quote_title, quote_desc } = req.body;
        const quote_img = req.file;

        if (!quote_img) {
            return res.status(400).json({ message: "Quote image is required" });
        }

        let imageUrl = null;
        if (quote_img) {
            imageUrl = await fileUpload(quote_img);
        }

        const newQuote = new quoteModel({
            quote_title,
            quote_desc,
            quote_img: imageUrl
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

        const updatedData = {};

        if (quote_title) updatedData.quote_title = quote_title;
        if (quote_desc) updatedData.quote_desc = quote_desc;

        const quote_img = req.file;
        if (quote_img) {
            updatedData.quote_img = await fileUpload(quote_img);
        }

        const updatedQuote = await quoteModel.findByIdAndUpdate(quoteId, updatedData, { new: true });

        if (!updatedQuote) {
            return res.status(404).json({ message: "Quote not found" });
        }

        res.status(200).json({ message: "Quote updated successfully", quote: updatedQuote });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
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