import Book from "../models/Book.js";
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";

// CREATE
export const addBook = asyncHandler(async (req, res) => {
  const { name, description, category } = req.body;

  if (!req.file) throw new AppError("PDF file is required", 400);

  const pdfPath = req.fileUrl;

  const newBook = await Book.create({
    name,
    description,
    category,
    pdfFile: pdfPath,
  });

  res.status(201).json({
    message: "Book added successfully",
    book: newBook,
  });
});

// READ ALL
export const getAllBooks = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1; // Default to page 1
  const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page
  const skip = (page - 1) * limit;

  const books = await Book.find()
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const totalBooks = await Book.countDocuments();

  res.status(200).json({
    count: books.length,
    total: totalBooks,
    page,
    totalPages: Math.ceil(totalBooks / limit),
    books,
  });
});

// READ ONE
export const getBookById = asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id);
  if (!book) throw new AppError("Book not found", 404);
  res.status(200).json(book);
});

// UPDATE
export const updateBook = asyncHandler(async (req, res) => {
  const { name, description, category } = req.body;
  const updates = { name, description, category };

  if (req.file) {
    updates.pdfFile = req.fileUrl;
  }

  const updatedBook = await Book.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true,
  });

  if (!updatedBook) throw new AppError("Book not found", 404);

  res.status(200).json({
    message: "Book updated successfully",
    book: updatedBook,
  });
});

// DELETE
export const deleteBook = asyncHandler(async (req, res) => {
  const deleted = await Book.findByIdAndDelete(req.params.id);
  if (!deleted) throw new AppError("Book not found", 404);

  res.status(200).json({
    message: "Book deleted successfully",
  });
});
