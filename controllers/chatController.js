import Chat from "../models/Chat.js";
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";

export const getChats = asyncHandler(async (req, res) => {
  const { userId, otherUserId } = req.params;
  const chats = await Chat.find({
    $or: [
      { sender: userId, receiver: otherUserId },
      { sender: otherUserId, receiver: userId },
    ],
  }).sort({ createdAt: 1 });

  if (!chats) throw new AppError("chat not found", 404);

  res.status(200).json({ chats });
});

export const deleteChat = asyncHandler(async (req, res) => {
  const { userId, otherUserId } = req.params;
  const deleted = await Chat.deleteMany({
    $or: [
      { sender: userId, receiver: otherUserId },
      { sender: otherUserId, receiver: userId },
    ],
  });

  if (!deleted) throw new AppError("chat not found", 404);

  res.status(200).json({
    message: "chat deleted successfully",
  });
});
