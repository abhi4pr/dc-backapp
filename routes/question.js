import express from "express";
import {
  addQuestion,
  getAllQuestions,
  getQuestionById,
  updateQuestion,
  deleteQuestion,
} from "../controllers/questionController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import upload, { fileUpload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, addQuestion);
router.get("/", authMiddleware, getAllQuestions);
router.get("/:id", authMiddleware, getQuestionById);
router.put("/:id", authMiddleware, updateQuestion);
router.delete("/:id", authMiddleware, deleteQuestion);

export default router;
