import Feedback from "../models/Feedback.js";
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";

// CREATE
export const addFeedback = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  const image = req.fileUrl || null; // Optional
  const userId = req.user?._id;

  if (!title || !description || !userId) {
    throw new AppError("Title, description, and user are required", 400);
  }

  const newFeedback = await Feedback.create({
    title,
    description,
    image,
    user: userId,
  });

  res.status(201).json({
    message: "Feedback submitted successfully",
    feedback: newFeedback,
  });
});

// READ ALL
export const getAllFeedbacks = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1; // Default to page 1
  const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page
  const skip = (page - 1) * limit;

  const feedbacks = await Feedback.find().populate("user", "name email");

  const totalFeedbacks = await Feedback.countDocuments();

  res.status(200).json({
    count: feedbacks.length,
    total: totalFeedbacks,
    page,
    totalPages: Math.ceil(totalFeedbacks / limit),
    feedbacks,
  });
});

// READ ONE
export const getFeedbackById = asyncHandler(async (req, res) => {
  const feedback = await Feedback.findById(req.params.id).populate(
    "user",
    "name email"
  );

  if (!feedback) throw new AppError("Feedback not found", 404);

  res.status(200).json(feedback);
});

// UPDATE
export const updateFeedback = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  const updates = {};
  if (title !== undefined) updates.title = title;
  if (description !== undefined) updates.description = description;
  if (req.fileUrl) updates.image = req.fileUrl;

  const updatedFeedback = await Feedback.findByIdAndUpdate(
    req.params.id,
    updates,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!updatedFeedback) throw new AppError("Feedback not found", 404);

  res.status(200).json({
    message: "Feedback updated successfully",
    feedback: updatedFeedback,
  });
});

// DELETE
export const deleteFeedback = asyncHandler(async (req, res) => {
  const deleted = await Feedback.findByIdAndDelete(req.params.id);
  if (!deleted) throw new AppError("Feedback not found", 404);

  res.status(200).json({
    message: "Feedback deleted successfully",
  });
});
