import express from "express";
import {
  addQuote,
  getAllQuotes,
  getQuoteById,
  updateQuote,
  deleteQuote,
} from "../controllers/quoteController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import upload, { fileUpload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post(
  "/add-quote",
  authMiddleware,
  upload.single("image"),
  fileUpload,
  addQuote
);
router.get("/", authMiddleware, getAllQuotes);
router.get("/:id", authMiddleware, getQuoteById);
router.put(
  "/:id",
  authMiddleware,
  upload.single("image"),
  fileUpload,
  updateQuote
);
router.delete("/:id", authMiddleware, deleteQuote);

export default router;
