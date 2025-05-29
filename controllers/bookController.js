import Book from "../models/Book.js";
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";

// CREATE
export const addBook = asyncHandler(async (req, res) => {
  const { name, description, category } = req.body;

  if (!req.file) throw new AppError("PDF file is required", 400);

  const pdfPath = `/uploads/${req.file.filename}`;

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
  const books = await Book.find();
  res.status(200).json(books);
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
    updates.pdfFile = `/uploads/${req.file.filename}`;
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
