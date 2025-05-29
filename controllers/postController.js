import Post from "../models/Post.js";
import AppError from "../utils/AppError.js";
import asyncHandler from "../utils/asyncHandler.js";

// Create a post
export const addPost = asyncHandler(async (req, res) => {
  const { title, content, category } = req.body;

  if (!title || !category) {
    throw new AppError("Title and category are required", 400);
  }

  const imagePath = req.file ? `/uploads/${req.file.filename}` : "";

  const post = await Post.create({
    title,
    content,
    category,
    images: imagePath,
    user: req.user.id,
  });

  res.status(201).json({
    message: "Post created successfully",
    post,
  });
});

// Get all posts
export const getAllPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find();

  res.status(200).json({ count: posts.length, posts });
});

// Get post by ID
export const getPostById = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);

  if (!post) throw new AppError("Post not found", 404);

  res.status(200).json({ post });
});

// Update post
export const updatePost = asyncHandler(async (req, res) => {
  const updates = req.body;

  if (req.file) {
    updates.images = `/uploads/${req.file.filename}`;
  }

  const updatedPost = await Post.findByIdAndUpdate(
    req.params.id,
    { $set: updates },
    { new: true, runValidators: true }
  );

  if (!updatedPost) throw new AppError("Post not found", 404);

  res.status(200).json({
    message: "Post updated successfully",
    post: updatedPost,
  });
});

// Delete post
export const deletePost = asyncHandler(async (req, res) => {
  const post = await Post.findByIdAndDelete(req.params.id);

  if (!post) throw new AppError("Post not found", 404);

  res.status(200).json({
    message: "Post deleted successfully",
  });
});
