import Journal from "../models/Journal.js";
import AppError from "../utils/AppError.js";
import asyncHandler from "../utils/asyncHandler.js";

// Add journal entry
export const addJournal = asyncHandler(async (req, res) => {
  const { title, content, journal_date } = req.body;

  if (!title || !journal_date) {
    throw new AppError("Title and journal_date are required", 400);
  }

  const imagePath = req.fileUrl;

  const journal = await Journal.create({
    title,
    content,
    journal_date,
    user: req.user.id,
    image: imagePath,
  });

  res.status(201).json({
    message: "Journal entry added successfully",
    journal,
  });
});

// Get all journal entries for logged in user with pagination
export const getAllJournals = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1; // Default to page 1
  const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page
  const skip = (page - 1) * limit;

  const journals = await Journal.find({ user: req.user.id })
    .sort({ journal_date: -1 })
    .skip(skip)
    .limit(limit);

  const totalJournals = await Journal.countDocuments({ user: req.user.id });

  res.status(200).json({
    count: journals.length,
    total: totalJournals,
    page,
    totalPages: Math.ceil(totalJournals / limit),
    journals,
  });
});

// Get journal by ID (only if belongs to user)
export const getJournalById = asyncHandler(async (req, res) => {
  const journal = await Journal.findOne({
    _id: req.params.id,
    user: req.user.id,
  });

  if (!journal) throw new AppError("Journal not found", 404);

  res.status(200).json({ journal });
});

// Update journal entry (only if belongs to user)
export const updateJournal = asyncHandler(async (req, res) => {
  const updates = req.body;

  if (req.file) {
    updates.image = req.fileUrl;
  }

  const updatedJournal = await Journal.findOneAndUpdate(
    { _id: req.params.id, user: req.user.id },
    { $set: updates },
    { new: true, runValidators: true }
  );

  if (!updatedJournal) throw new AppError("Journal not found", 404);

  res.status(200).json({
    message: "Journal updated successfully",
    journal: updatedJournal,
  });
});

// Delete journal entry (only if belongs to user)
export const deleteJournal = asyncHandler(async (req, res) => {
  const deleted = await Journal.findOneAndDelete({
    _id: req.params.id,
    user: req.user.id,
  });

  if (!deleted) throw new AppError("Journal not found", 404);

  res.status(200).json({
    message: "Journal deleted successfully",
  });
});
