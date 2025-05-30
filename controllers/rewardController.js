import Reward from "../models/Reward.js";
import UserReward from "../models/UserReward.js";
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";

// ADMIN: Create reward
export const addReward = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  const image = req.file ? req.fileUrl : null;
  const reward = await Reward.create({ name, description, image });
  res.status(201).json(reward);
});

// GET all rewards
export const getAllRewards = asyncHandler(async (req, res) => {
  const rewards = await Reward.find().sort("level");
  res.status(200).json(rewards);
});

// GET one reward
export const getRewardById = asyncHandler(async (req, res) => {
  const reward = await Reward.findById(req.params.id);
  if (!reward) throw new AppError("Reward not found", 404);
  res.status(200).json(reward);
});

// UPDATE reward
export const updateReward = asyncHandler(async (req, res) => {
  const updates = req.body;
  if (req.file) updates.image = req.fileUrl;

  const reward = await Reward.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true,
  });

  if (!reward) throw new AppError("Reward not found", 404);
  res.status(200).json(reward);
});

// DELETE reward
export const deleteReward = asyncHandler(async (req, res) => {
  const reward = await Reward.findByIdAndDelete(req.params.id);
  if (!reward) throw new AppError("Reward not found", 404);
  res.status(200).json({ message: "Reward deleted" });
});

// ASSIGN reward to user
export const assignRewardToUser = asyncHandler(async (req, res) => {
  const { userId, rewardId } = req.body;

  const reward = await Reward.findById(rewardId);
  if (!reward) throw new AppError("Reward not found", 404);

  const userReward = await UserReward.findOneAndUpdate(
    { user: userId, reward: rewardId },
    {},
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  res.status(200).json({
    message: "Reward assigned",
    userReward,
  });
});

// GET all rewards for a user
export const getUserRewards = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const rewards = await UserReward.find({ user: userId }).populate("reward");
  res.status(200).json(rewards);
});
