import Level from "../models/Level.js";
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";

// CREATE
export const addLevel = asyncHandler(async (req, res) => {
  const newLevel = await Level.create(req.body);
  res.status(201).json({
    message: "Level created successfully",
    level: newLevel,
  });
});

// READ ALL
export const getAllLevels = asyncHandler(async (req, res) => {
  const levels = await Level.find().sort({ levelNumber: 1 });
  res.status(200).json({
    count: levels.length,
    levels,
  });
});

// READ ONE
export const getLevelByNumber = asyncHandler(async (req, res) => {
  const level = await Level.findOne({ levelNumber: req.params.levelNumber });
  if (!level) throw new AppError("Level not found", 404);
  res.status(200).json(level);
});

// UPDATE
export const updateLevel = asyncHandler(async (req, res) => {
  const updated = await Level.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!updated) throw new AppError("Level not found", 404);
  res.status(200).json({
    message: "Level updated successfully",
    level: updated,
  });
});

// DELETE
export const deleteLevel = asyncHandler(async (req, res) => {
  const deleted = await Level.findByIdAndDelete(req.params.id);
  if (!deleted) throw new AppError("Level not found", 404);
  res.status(200).json({
    message: "Level deleted successfully",
  });
});
