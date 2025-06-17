import SelfAssessmentQuestion from "../models/SelfAssessmentQuestion.js";
import SelfAssessmentAnswer from "../models/SelfAssessmentAnswer.js";
import AppError from "../utils/AppError.js";
import asyncHandler from "../utils/asyncHandler.js";

// CREATE
export const addQuestion = asyncHandler(async (req, res) => {
  const { question, category, options, note } = req.body;
  if (!options) throw new AppError("options required", 400);
  const newQuestion = await SelfAssessmentQuestion.create({
    question,
    category,
    options,
    note,
  });
  res.status(201).json(newQuestion);
});

// READ ALL
export const getAllQuestions = asyncHandler(async (req, res) => {
  const questions = await SelfAssessmentQuestion.find();
  res.status(200).json(questions);
});

// READ ONE
export const getQuestionById = asyncHandler(async (req, res) => {
  const question = await SelfAssessmentQuestion.findById(req.params.id);
  if (!question) throw new AppError("Question not found", 404);
  res.status(200).json(question);
});

// UPDATE
export const updateQuestion = asyncHandler(async (req, res) => {
  const updated = await SelfAssessmentQuestion.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );
  if (!updated) throw new AppError("Question not found", 404);
  res.status(200).json(updated);
});

// DELETE
export const deleteQuestion = asyncHandler(async (req, res) => {
  const deleted = await SelfAssessmentQuestion.findByIdAndDelete(req.params.id);
  if (!deleted) throw new AppError("Question not found", 404);
  res.status(200).json({ message: "Question deleted" });
});

// CREATE or UPDATE
export const submitAnswer = asyncHandler(async (req, res) => {
  const userId = req.body.user;
  const { questionId, selectedOption, questionText } = req.body;

  const question = await SelfAssessmentQuestion.findById(questionId);
  if (!question) throw new AppError("Invalid question", 404);
  if (!question.options.includes(selectedOption))
    throw new AppError("Invalid option", 400);

  const answer = await SelfAssessmentAnswer.findOneAndUpdate(
    { user: userId, question: questionId },
    { selectedOption, questionText },
    { upsert: true, new: true, runValidators: true }
  );

  res.status(200).json(answer);
});

// READ ALL USER ANSWERS
export const getUserAnswers = asyncHandler(async (req, res) => {
  const answers = await SelfAssessmentAnswer.find({
    user: req.bodu.user,
  }).populate("question");
  res.status(200).json(answers);
});

// READ ONE
export const getUserAnswerById = asyncHandler(async (req, res) => {
  const answer = await SelfAssessmentAnswer.findOne({
    _id: req.params.id,
    user: req.body.user,
  }).populate("question");

  if (!answer) throw new AppError("Answer not found", 404);
  res.status(200).json(answer);
});

// DELETE
export const deleteUserAnswer = asyncHandler(async (req, res) => {
  const deleted = await SelfAssessmentAnswer.findOneAndDelete({
    _id: req.params.id,
    user: req.body.user,
  });

  if (!deleted) throw new AppError("Answer not found", 404);
  res.status(200).json({ message: "Answer deleted" });
});
