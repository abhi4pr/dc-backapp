import MedicineOrder from "../models/MedicineOrder.js";
import AppError from "../utils/AppError.js";
import asyncHandler from "../utils/asyncHandler.js";

// Create a post
export const addOrder = asyncHandler(async (req, res) => {
  const { medicine, user, quantity, payment_mode, status } = req.body;

  if (!medicine || !user) {
    throw new AppError("medicine and user are required", 400);
  }

  const order = await MedicineOrder.create({
    medicine,
    user,
    quantity,
    payment_mode,
    status,
  });

  res.status(201).json({
    message: "MedicineOrder created successfully",
    order,
  });
});

// Get all posts
export const getAllOrders = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1; // Default to page 1
  const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page
  const skip = (page - 1) * limit;

  const orders = await MedicineOrder.find()
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const totalOrders = await MedicineOrder.countDocuments();

  res.status(200).json({
    count: orders.length,
    total: totalOrders,
    page,
    totalPages: Math.ceil(totalOrders / limit),
    orders,
  });
});

// Get post by ID
export const getOrderById = asyncHandler(async (req, res) => {
  const post = await MedicineOrder.findById(req.params.id);

  if (!post) throw new AppError("MedicineOrder not found", 404);

  res.status(200).json({ post });
});

// Update post
export const updateOrder = asyncHandler(async (req, res) => {
  const updates = req.body;

  const updatedPost = await MedicineOrder.findByIdAndUpdate(
    req.params.id,
    { $set: updates },
    { new: true, runValidators: true }
  );

  if (!updatedPost) throw new AppError("MedicineOrder not found", 404);

  res.status(200).json({
    message: "MedicineOrder updated successfully",
    order: updatedPost,
  });
});

// Delete post
export const deleteOrder = asyncHandler(async (req, res) => {
  const post = await MedicineOrder.findByIdAndDelete(req.params.id);

  if (!post) throw new AppError("MedicineOrder not found", 404);

  res.status(200).json({
    message: "MedicineOrder deleted successfully",
  });
});
