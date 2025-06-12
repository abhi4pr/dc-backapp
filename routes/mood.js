import express from "express";
import {
  submitMood,
  getMyMoods,
  getMoodById,
  deleteMood,
  getMoodByUserAndDate,
} from "../controllers/moodController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, submitMood);
router.get("/", authMiddleware, getMyMoods);
router.get("/user/:userId/date/:date", authMiddleware, getMoodByUserAndDate);
router.get("/:id", authMiddleware, getMoodById);
router.delete("/:id", authMiddleware, deleteMood);

export default router;
