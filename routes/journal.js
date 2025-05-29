import express from "express";
import {
  addJournal,
  getAllJournals,
  getJournalById,
  updateJournal,
  deleteJournal,
} from "../controllers/journalController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post("/add-journal", authMiddleware, upload.single("image"), addJournal);
router.get("/", authMiddleware, getAllJournals);
router.get("/:id", authMiddleware, getJournalById);
router.put("/:id", authMiddleware, upload.single("image"), updateJournal);
router.delete("/:id", authMiddleware, deleteJournal);

export default router;
