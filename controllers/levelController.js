import Level from "../models/Level.js";
import AppError from "../utils/AppError.js";
import asyncHandler from "../utils/asyncHandler.js";

// Create level
export const createLevel = asyncHandler(async (req, res) => {
  const level = await Level.create(req.body);
  res.status(201).json({ message: "Level created", level });
});

// Get all levels
export const getAllLevels = asyncHandler(async (req, res) => {
  const levels = await Level.find().sort({ levelNumber: 1 });
  res.status(200).json({ levels });
});

// Get single level
export const getLevelById = asyncHandler(async (req, res) => {
  const level = await Level.findById(req.params.id);
  if (!level) throw new AppError("Level not found", 404);
  res.status(200).json({ level });
});

// Update level
export const updateLevel = asyncHandler(async (req, res) => {
  const level = await Level.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!level) throw new AppError("Level not found", 404);
  res.status(200).json({ message: "Level updated", level });
});

// Delete level
export const deleteLevel = asyncHandler(async (req, res) => {
  const level = await Level.findByIdAndDelete(req.params.id);
  if (!level) throw new AppError("Level not found", 404);
  res.status(200).json({ message: "Level deleted" });
});
