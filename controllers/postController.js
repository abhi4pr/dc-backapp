import Post from "../models/Post.js";
import AppError from "../utils/AppError.js";
import asyncHandler from "../utils/asyncHandler.js";

// Create a post
export const addPost = asyncHandler(async (req, res) => {
  const { title, content, category } = req.body;

  if (!title || !category) {
    throw new AppError("Title and category are required", 400);
  }

  const imagePaths = req.fileUrls || [];

  if (imagePaths.length > 3) {
    throw new AppError("You can upload a maximum of 3 images", 400);
  }

  console.log("files:", req.files);
  console.log("Image paths:", imagePaths);

  const post = await Post.create({
    title,
    content,
    category,
    images: imagePaths,
    user: req.user.id,
  });

  res.status(201).json({
    message: "Post created successfully",
    post,
  });
});

// Get all posts
export const getAllPosts = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1; // Default to page 1
  const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page
  const skip = (page - 1) * limit;

  const posts = await Post.find()
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const totalPosts = await Post.countDocuments();

  res.status(200).json({
    count: posts.length,
    total: totalPosts,
    page,
    totalPages: Math.ceil(totalPosts / limit),
    posts,
  });
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

  if (req.files) {
    const imagePaths = req.fileUrls || []; // Assuming `req.files` contains an array of uploaded files

    if (imagePaths.length > 3) {
      throw new AppError("You can upload a maximum of 3 images", 400);
    }

    updates.images = imagePaths;
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
