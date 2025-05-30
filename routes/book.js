import express from "express";
import {
  addBook,
  getAllBooks,
  getBookById,
  updateBook,
  deleteBook,
} from "../controllers/bookController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import upload, { fileUpload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post(
  "/add-book",
  authMiddleware,
  upload.single("pdfFile"),
  fileUpload,
  addBook
);
router.put(
  "/:id",
  authMiddleware,
  upload.single("pdfFile"),
  fileUpload,
  updateBook
);
router.delete("/:id", authMiddleware, deleteBook);
router.get("/", authMiddleware, getAllBooks);
router.get("/:id", authMiddleware, getBookById);

export default router;
