import Question from "../models/Question.js";
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";

// CREATE
export const addQuestion = asyncHandler(async (req, res) => {
  const { question, options, extra, sequence } = req.body;

  if (
    !question ||
    !options ||
    !Array.isArray(options) ||
    options.length === 0 ||
    sequence === undefined
  ) {
    throw new AppError(
      "Required fields: question, options (array), and sequence",
      400
    );
  }

  const newQuestion = await Question.create({
    question,
    options,
    extra,
    sequence,
  });

  res.status(201).json({
    message: "Question added successfully",
    question: newQuestion,
  });
});

// READ ALL
export const getAllQuestions = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1; // Default to page 1
  const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page
  const skip = (page - 1) * limit;

  const questions = await Question.find()
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const totalQuestions = await Question.countDocuments();

  res.status(200).json({
    count: questions.length,
    total: totalQuestions,
    page,
    totalPages: Math.ceil(totalQuestions / limit),
    questions,
  });
});

// READ ONE
export const getQuestionById = asyncHandler(async (req, res) => {
  const question = await Question.findById(req.params.id);
  if (!question) throw new AppError("Question not found", 404);

  res.status(200).json(question);
});

// UPDATE
export const updateQuestion = asyncHandler(async (req, res) => {
  const { question, options, extra, sequence } = req.body;

  const updates = {};
  if (question !== undefined) updates.question = question;
  if (options !== undefined) updates.options = options;
  if (extra !== undefined) updates.extra = extra;
  if (sequence !== undefined) updates.sequence = sequence;

  const updatedQuestion = await Question.findByIdAndUpdate(
    req.params.id,
    updates,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!updatedQuestion) throw new AppError("Question not found", 404);

  res.status(200).json({
    message: "Question updated successfully",
    question: updatedQuestion,
  });
});

// DELETE
export const deleteQuestion = asyncHandler(async (req, res) => {
  const deleted = await Question.findByIdAndDelete(req.params.id);
  if (!deleted) throw new AppError("Question not found", 404);

  res.status(200).json({
    message: "Question deleted successfully",
  });
});
