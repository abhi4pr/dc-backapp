import UserRoutine from "../models/UserRoutine.js";
import DailyRoutineItem from "../models/DailyRoutineItem.js";
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";

// Assign a routine to user
export const assignUserRoutine = asyncHandler(async (req, res) => {
  const { routineItem, time } = req.body;
  const userId = req.user.id;

  if (!routineItem || !time)
    throw new AppError("Routine item and time are required", 400);

  const exists = await UserRoutine.findOne({ user: userId, time });
  if (exists) throw new AppError(`You already have a routine at ${time}`, 400);

  const newRoutine = await UserRoutine.create({
    user: userId,
    routineItem,
    time,
  });

  res.status(201).json({ message: "Routine assigned", routine: newRoutine });
});

// Get all routines of current user
export const getUserRoutines = asyncHandler(async (req, res) => {
  const routines = await UserRoutine.find({ user: req.user.id }).populate(
    "routineItem"
  );
  res.status(200).json({ count: routines.length, routines });
});

// Delete a user routine
export const deleteUserRoutine = asyncHandler(async (req, res) => {
  const deleted = await UserRoutine.findOneAndDelete({
    _id: req.params.id,
    user: req.user.id,
  });
  if (!deleted) throw new AppError("Routine not found or not yours", 404);
  res.status(200).json({ message: "Routine removed" });
});
