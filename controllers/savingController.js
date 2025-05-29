import Saving from "../models/Saving.js";
import AppError from "../utils/AppError.js";
import asyncHandler from "../utils/asyncHandler.js";

export const addSaving = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const existing = await Saving.findOne({ user: userId });

  if (existing) throw new AppError("Saving record already exists", 400);

  const saving = await Saving.create({
    user: userId,
    ...req.body,
  });

  res.status(201).json({
    message: "Saving record created",
    saving,
  });
});

// Get a single saving record by user ID
export const getSavingByUserId = asyncHandler(async (req, res) => {
  const saving = await Saving.findOne({ user: req.params.userId });

  if (!saving) throw new AppError("Saving record not found", 404);

  res.status(200).json({ saving });
});

// Create or update saving record
export const updateSaving = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const bodyData = req.body;

  const updates = {
    ...bodyData,
    user: userId,
  };

  const saving = await Saving.findOneAndUpdate(
    { user: userId },
    { $set: updates },
    { new: true, upsert: true, runValidators: true }
  );

  res.status(200).json({
    message: "Saving record updated",
    saving,
  });
});

// Get all savings
export const getAllSavings = asyncHandler(async (req, res) => {
  const savings = await Saving.find().populate("user", "-password");

  res.status(200).json({
    count: savings.length,
    savings,
  });
});

// Delete a saving record by user ID
export const deleteSavingByUserId = asyncHandler(async (req, res) => {
  const saving = await Saving.findOneAndDelete({ user: req.params.userId });

  if (!saving) throw new AppError("Saving record not found", 404);

  res.status(200).json({
    message: "Saving record deleted successfully",
  });
});
