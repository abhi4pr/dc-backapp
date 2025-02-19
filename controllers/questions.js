const questionModel = require('../models/questionModel');
const { fileUpload } = require('../fileUpload.js');
const variables = require('../variables.js')

exports.addQuestion = async (req, res) => {
    try {
        const { question, options, question_cat } = req.body;

        if (options.length < 4) {
            return res.status(400).json({ message: "At least four options are required" });
        }

        const newQuestion = new questionModel({
            question,
            options,
            question_cat
        });

        await newQuestion.save();
        res.status(201).json({ message: "Question added successfully", question: newQuestion });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
};

exports.getSingleQuestion = async (req, res) => {
    try {
        const { questionId } = req.params;

        const question = await questionModel.findById(questionId);

        if (!question) {
            return res.status(404).json({ message: "Question not found" });
        }

        res.status(200).json({ message: "Question retrieved successfully", question });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
};

exports.getAllQuestions = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const totalQuestions = await questionModel.countDocuments();

        const questions = await questionModel.find().skip(skip).limit(limit);
        const totalPages = Math.ceil(totalQuestions / limit);

        res.status(200).json({
            message: "Questions retrieved successfully",
            questions,
            pagination: {
                totalQuestions,
                totalPages,
                currentPage: page,
                perPage: limit,
            },
        });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
};

exports.updateQuestion = async (req, res) => {
    try {
        const { questionId } = req.params;
        const { question, options, question_cat } = req.body;

        if (options.length < 4) {
            return res.status(400).json({ message: "At least fourtwo options are required" });
        }

        const updatedData = {};

        if (question) updatedData.question = question;
        if (options) updatedData.options = options;
        if (question_cat) updatedData.question_cat = question_cat;

        const updatedQuestion = await questionModel.findByIdAndUpdate(questionId, updatedData, { new: true });

        if (!updatedQuestion) {
            return res.status(404).json({ message: "Question not found" });
        }

        res.status(200).json({ message: "Question updated successfully", question: updatedQuestion });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
};

exports.deleteQuestion = async (req, res) => {
    try {
        const { questionId } = req.params;

        const deletedQuestion = await questionModel.findByIdAndDelete(questionId);

        if (!deletedQuestion) {
            return res.status(404).json({ message: "Question not found" });
        }

        res.status(200).json({ message: "Question deleted successfully", question: deletedQuestion });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
};
