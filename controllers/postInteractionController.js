import Like from "../models/Like.js";
import Comment from "../models/Comment.js";
import AppError from "../utils/AppError.js";
import asyncHandler from "../utils/asyncHandler.js";

// Like a post
export const likePost = asyncHandler(async (req, res) => {
  const { postId } = req.params;

  const existing = await Like.findOne({ post: postId, user: req.user.id });
  if (existing) throw new AppError("You already liked this post", 400);

  await Like.create({ post: postId, user: req.user.id });

  res.status(201).json({ message: "Post liked" });
});

// Unlike a post
export const unlikePost = asyncHandler(async (req, res) => {
  const { postId } = req.params;

  const like = await Like.findOneAndDelete({ post: postId, user: req.user.id });

  if (!like) throw new AppError("Like not found", 404);

  res.status(200).json({ message: "Post unliked" });
});

// Comment on a post
export const addComment = asyncHandler(async (req, res) => {
  const { postId } = req.params;
  const { content } = req.body;

  if (!content) throw new AppError("Comment content is required", 400);

  const comment = await Comment.create({
    post: postId,
    user: req.user.id,
    content,
  });

  res.status(201).json({ message: "Comment added", comment });
});

// Delete a comment
export const deleteComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;

  const comment = await Comment.findOneAndDelete({
    _id: commentId,
    user: req.user.id,
  });

  if (!comment) throw new AppError("Comment not found or not authorized", 404);

  res.status(200).json({ message: "Comment deleted" });
});

// Get all comments for a post
export const getCommentsByPost = asyncHandler(async (req, res) => {
  const { postId } = req.params;

  const comments = await Comment.find({ post: postId })
    .populate("user", "name email profileImage")
    .sort({ createdAt: -1 });

  res.status(200).json({ count: comments.length, comments });
});

export const getLikeCount = asyncHandler(async (req, res) => {
  const { postId } = req.params;

  const count = await Like.countDocuments({ post: postId });

  res.status(200).json({ postId, likeCount: count });
});

// Comment Count
export const getCommentCount = asyncHandler(async (req, res) => {
  const { postId } = req.params;

  const count = await Comment.countDocuments({ post: postId });

  res.status(200).json({ postId, commentCount: count });
});
