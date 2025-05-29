import express from "express";
import {
  submitMood,
  getMyMoods,
  getMoodById,
  deleteMood,
} from "../controllers/moodController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, submitMood);
router.get("/", authMiddleware, getMyMoods);
router.get("/:id", authMiddleware, getMoodById);
router.delete("/:id", authMiddleware, deleteMood);

export default router;
