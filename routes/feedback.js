import express from "express";
import {
  addFeedback,
  getAllFeedbacks,
  getFeedbackById,
  updateFeedback,
  deleteFeedback,
} from "../controllers/feedbackController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import upload, { fileUpload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post(
  "/",
  authMiddleware,
  upload.single("image"),
  fileUpload,
  addFeedback
);
router.get("/", authMiddleware, getAllFeedbacks);
router.get("/:id", authMiddleware, getFeedbackById);
router.put(
  "/:id",
  authMiddleware,
  upload.single("image"),
  fileUpload,
  updateFeedback
);
router.delete("/:id", authMiddleware, deleteFeedback);

export default router;
