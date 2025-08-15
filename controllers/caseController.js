import Case from "../models/Case.js";
import AppError from "../utils/AppError.js";
import asyncHandler from "../utils/asyncHandler.js";

export const addPost = asyncHandler(async (req, res) => {
  const imagePath = req.fileUrl || "";

  const post = await Case.create({
    ...req.body,
    image: imagePath,
  });

  res.status(201).json({
    message: "Case created successfully",
    post,
  });
});

export const getPostById = asyncHandler(async (req, res) => {
  const post = await Case.findById(req.params._id).populate(
    "user",
    "-password"
  );

  if (!post) throw new AppError("Case not found", 404);

  res.status(200).json({ message: "Case retrieved successfully", post });
});

export const updatePost = asyncHandler(async (req, res) => {
  const updates = {
    ...req.body,
  };

  if (req.file) {
    updates.image = req.fileUrl;
  }

  const updatedPost = await Case.findByIdAndUpdate(
    req.params._id,
    { $set: updates },
    { new: true }
  );

  if (!updatedPost) throw new AppError("Case not found", 404);

  res.status(200).json({
    message: "Case updated successfully",
    post: updatedPost,
  });
});

export const deletePost = asyncHandler(async (req, res) => {
  const post = await Case.findByIdAndDelete(req.params._id);

  if (!post) throw new AppError("Case not found", 404);

  res.status(200).json({
    message: "Case deleted successfully",
  });
});

export const getAllPostsOfUser = asyncHandler(async (req, res) => {
  const userId = req.params._id;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const posts = await Case.find({ user: userId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate("user", "-password");

  const totalPosts = await Case.countDocuments({ user: userId });

  res.status(200).json({
    count: posts.length,
    total: totalPosts,
    page,
    totalPages: Math.ceil(totalPosts / limit),
    posts,
  });
});

export const searchPosts = asyncHandler(async (req, res) => {
  const { q } = req.query;

  if (!q || q.trim() === "") {
    throw new AppError("Search query is required", 400);
  }

  const words = q.trim().split(/\s+/); // split by whitespace
  const regexes = words.map((word) => new RegExp(word, "i"));

  const posts = await Case.find({
    $or: [{ title: { $in: regexes } }, { center_address: { $in: regexes } }],
  }).populate("user", "-password");

  res.status(200).json({
    message: "Posts found successfully",
    count: posts.length,
    posts,
  });
});
