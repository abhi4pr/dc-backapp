import express from "express";
import {
  addJournal,
  getAllJournals,
  getJournalById,
  getSingleJournalByDate,
  updateJournal,
  deleteJournal,
} from "../controllers/journalController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import upload, { fileUpload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post(
  "/add_journal",
  authMiddleware,
  upload.single("image"),
  fileUpload,
  addJournal
);
router.get("/", authMiddleware, getAllJournals);
router.get("/:id", authMiddleware, getJournalById);
router.get(
  "/get_single_journal_by_date/:userId",
  authMiddleware,
  getSingleJournalByDate
);
router.put(
  "/:id",
  authMiddleware,
  upload.single("image"),
  fileUpload,
  updateJournal
);
router.delete("/:id", authMiddleware, deleteJournal);

export default router;
