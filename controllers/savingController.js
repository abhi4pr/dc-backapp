import Saving from "../models/Saving.js";
import AppError from "../utils/AppError.js";
import asyncHandler from "../utils/asyncHandler.js";
import mongoose from "mongoose";

export const addSaving = asyncHandler(async (req, res) => {
  const userId = req.body.user;
  const date = req.body.date;
  const existing = await Saving.findOne({ user: userId, date });

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
  const saving = await Saving.find({ user: req.params.userId });

  if (!saving) throw new AppError("Saving record not found", 404);

  res.status(200).json({ saving });
});

export const getSavingByUserAndDate = asyncHandler(async (req, res) => {
  const { userId, date } = req.params;

  const saving = await Saving.findOne({ user: userId, date });

  if (!saving) throw new AppError("saving not found", 404);

  res.status(200).json({ saving });
});

// Create or update saving record
export const updateSaving = asyncHandler(async (req, res) => {
  const userId = req.body.user;
  const date = req.body.date;
  const bodyData = req.body;

  const updates = {
    ...bodyData,
    user: userId,
    date,
  };

  // Find by user and date, update if exists, else create new
  const saving = await Saving.findOneAndUpdate(
    { user: userId, date: date },
    { $set: updates },
    { new: true, upsert: true, runValidators: true }
  );

  res.status(200).json({
    message: "Saving record updated or created",
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

// Get total savings for a specific user
export const getTotalSavingsByUser = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const result = await Saving.aggregate([
    { $match: { user: new mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: "$user",
        cigarette: { $sum: "$cigarette" },
        alcohol: { $sum: "$alcohol" },
        weed: { $sum: "$weed" },
      },
    },
  ]);

  if (!result.length) {
    return res.status(404).json({ message: "No savings found for this user" });
  }

  res.status(200).json({
    userId,
    totalCigarette: result[0].cigarette,
    totalAlcohol: result[0].alcohol,
    totalWeed: result[0].weed,
  });
});
