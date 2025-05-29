import DietItem from "../models/DietItem.js";
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";

export const addDietItem = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  if (!title) throw new AppError("Title is required", 400);

  const imagePath = req.file ? `/uploads/${req.file.filename}` : "";

  const item = await DietItem.create({
    title,
    description,
    image: imagePath,
  });

  res.status(201).json({ message: "Diet item added", item });
});

export const getAllDietItems = asyncHandler(async (req, res) => {
  const items = await DietItem.find().sort({ createdAt: -1 });
  res.status(200).json({ count: items.length, items });
});

export const getDietItemById = asyncHandler(async (req, res) => {
  const item = await DietItem.findById(req.params.id);
  if (!item) throw new AppError("Diet item not found", 404);
  res.status(200).json({ item });
});

export const updateDietItem = asyncHandler(async (req, res) => {
  const updates = req.body;
  if (req.file) updates.image = `/uploads/${req.file.filename}`;

  const updated = await DietItem.findByIdAndUpdate(
    req.params.id,
    { $set: updates },
    { new: true }
  );
  if (!updated) throw new AppError("Diet item not found", 404);

  res.status(200).json({ message: "Updated successfully", item: updated });
});

export const deleteDietItem = asyncHandler(async (req, res) => {
  const deleted = await DietItem.findByIdAndDelete(req.params.id);
  if (!deleted) throw new AppError("Diet item not found", 404);
  res.status(200).json({ message: "Deleted successfully" });
});
