import UserDiet from "../models/UserDiet.js";
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";

export const assignUserDiet = asyncHandler(async (req, res) => {
  const { dietItem, time } = req.body;
  const userId = req.user.id;

  if (!dietItem || !time)
    throw new AppError("Diet item and time are required", 400);

  const exists = await UserDiet.findOne({ user: userId, time });
  if (exists)
    throw new AppError(`You already have a diet item at ${time}`, 400);

  const newDiet = await UserDiet.create({
    user: userId,
    dietItem,
    time,
  });

  res.status(201).json({ message: "Diet assigned", diet: newDiet });
});

export const getUserDiets = asyncHandler(async (req, res) => {
  const diets = await UserDiet.find({ user: req.user.id }).populate("dietItem");
  res.status(200).json({ count: diets.length, diets });
});

export const deleteUserDiet = asyncHandler(async (req, res) => {
  const deleted = await UserDiet.findOneAndDelete({
    _id: req.params.id,
    user: req.user.id,
  });
  if (!deleted) throw new AppError("Diet item not found or not yours", 404);
  res.status(200).json({ message: "Diet item removed" });
});
