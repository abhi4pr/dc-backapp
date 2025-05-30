import DailyRoutineItem from "../models/DailyRoutineItem.js";
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";

// Create a routine item
export const addRoutineItem = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  if (!title) throw new AppError("Title is required", 400);

  const imagePath = req.fileUrl;

  const item = await DailyRoutineItem.create({
    title,
    description,
    image: imagePath,
  });

  res.status(201).json({ message: "Routine item added", item });
});

// Get all routine items
export const getAllRoutineItems = asyncHandler(async (req, res) => {
  const items = await DailyRoutineItem.find().sort({ createdAt: -1 });
  res.status(200).json({ count: items.length, items });
});

// Get one item
export const getRoutineItemById = asyncHandler(async (req, res) => {
  const item = await DailyRoutineItem.findById(req.params.id);
  if (!item) throw new AppError("Routine item not found", 404);
  res.status(200).json({ item });
});

// Update routine item
export const updateRoutineItem = asyncHandler(async (req, res) => {
  const updates = req.body;
  if (req.file) updates.image = req.fileUrl;

  const updated = await DailyRoutineItem.findByIdAndUpdate(
    req.params.id,
    { $set: updates },
    { new: true }
  );
  if (!updated) throw new AppError("Routine item not found", 404);

  res.status(200).json({ message: "Updated successfully", item: updated });
});

// Delete routine item
export const deleteRoutineItem = asyncHandler(async (req, res) => {
  const deleted = await DailyRoutineItem.findByIdAndDelete(req.params.id);
  if (!deleted) throw new AppError("Routine item not found", 404);
  res.status(200).json({ message: "Deleted successfully" });
});
