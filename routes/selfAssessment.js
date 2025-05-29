import express from "express";
import {
  addQuestion,
  getAllQuestions,
  getQuestionById,
  updateQuestion,
  deleteQuestion,
  submitAnswer,
  getUserAnswers,
  getUserAnswerById,
  deleteUserAnswer,
} from "../controllers/selfAssessmentController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// ===== Admin Routes =====
router.post("/questions", authMiddleware, addQuestion);
router.get("/questions", authMiddleware, getAllQuestions);
router.get("/questions/:id", authMiddleware, getQuestionById);
router.put("/questions/:id", authMiddleware, updateQuestion);
router.delete("/questions/:id", authMiddleware, deleteQuestion);

// ===== User Routes =====
router.post("/answers", authMiddleware, submitAnswer);
router.get("/answers", authMiddleware, getUserAnswers);
router.get("/answers/:id", authMiddleware, getUserAnswerById);
router.delete("/answers/:id", authMiddleware, deleteUserAnswer);

export default router;
