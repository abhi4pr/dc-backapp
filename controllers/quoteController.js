import Quote from "../models/Quote.js";
import AppError from "../utils/AppError.js";
import asyncHandler from "../utils/asyncHandler.js";

// Add quote
export const addQuote = asyncHandler(async (req, res) => {
  const { title, content } = req.body;
  if (!title) throw new AppError("Title is required", 400);

  const imagePath = req.file ? `/uploads/${req.file.filename}` : "";

  const quote = await Quote.create({
    title,
    content,
    image: imagePath,
  });

  res.status(201).json({
    message: "Quote added successfully",
    quote,
  });
});

// Get all quotes
export const getAllQuotes = asyncHandler(async (req, res) => {
  const quotes = await Quote.find().sort({ createdAt: -1 });
  res.status(200).json({ count: quotes.length, quotes });
});

// Get quote by ID
export const getQuoteById = asyncHandler(async (req, res) => {
  const quote = await Quote.findById(req.params.id);
  if (!quote) throw new AppError("Quote not found", 404);
  res.status(200).json({ quote });
});

// Update quote
export const updateQuote = asyncHandler(async (req, res) => {
  const updates = req.body;

  if (req.file) {
    updates.image = `/uploads/${req.file.filename}`;
  }

  const updatedQuote = await Quote.findByIdAndUpdate(
    req.params.id,
    { $set: updates },
    { new: true, runValidators: true }
  );

  if (!updatedQuote) throw new AppError("Quote not found", 404);

  res.status(200).json({
    message: "Quote updated successfully",
    quote: updatedQuote,
  });
});

// Delete quote
export const deleteQuote = asyncHandler(async (req, res) => {
  const quote = await Quote.findByIdAndDelete(req.params.id);
  if (!quote) throw new AppError("Quote not found", 404);

  res.status(200).json({
    message: "Quote deleted successfully",
  });
});
