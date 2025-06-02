import Mood from "../models/Mood.js";
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";

// Add or Update Mood (1 per day)
export const submitMood = asyncHandler(async (req, res) => {
  const { moodType, intensity, reason, note } = req.body;
  const userId = req.user.id;

  const today = new Date().toISOString().split("T")[0]; // "YYYY-MM-DD"

  const updatedMood = await Mood.findOneAndUpdate(
    { user: userId, date: today },
    {
      user: userId,
      moodType,
      intensity,
      reason,
      note,
      date: today,
    },
    { upsert: true, new: true, runValidators: true }
  );

  res.status(200).json({
    message: "Mood recorded",
    mood: updatedMood,
  });
});

// Get all moods for a user
export const getMyMoods = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const page = parseInt(req.query.page) || 1; // Default to page 1
  const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page
  const skip = (page - 1) * limit;

  const moods = await Mood.find({ user: userId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const totalMoods = await Mood.countDocuments();

  res.status(200).json({
    count: moods.length,
    total: totalMoods,
    page,
    totalPages: Math.ceil(totalMoods / limit),
    moods,
  });
});

// Get single mood by ID
export const getMoodById = asyncHandler(async (req, res) => {
  const mood = await Mood.findById(req.params.id);
  if (!mood) throw new AppError("Mood not found", 404);
  res.status(200).json(mood);
});

// Delete a mood by ID
export const deleteMood = asyncHandler(async (req, res) => {
  const mood = await Mood.findOneAndDelete({
    _id: req.params.id,
    user: req.user.id,
  });
  if (!mood) throw new AppError("Mood not found or unauthorized", 404);

  res.status(200).json({ message: "Mood deleted" });
});
