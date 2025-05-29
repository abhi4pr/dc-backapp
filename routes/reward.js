import express from "express";
import {
  addReward,
  getAllRewards,
  getRewardById,
  updateReward,
  deleteReward,
  assignRewardToUser,
  getUserRewards,
} from "../controllers/rewardController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post("/add-reward", authMiddleware, upload.single("image"), addReward);
router.put("/:id", authMiddleware, upload.single("image"), updateReward);
router.delete("/:id", authMiddleware, deleteReward);

router.post("/assign", authMiddleware, assignRewardToUser);
router.get("/", authMiddleware, getAllRewards);
router.get("/user", authMiddleware, getUserRewards);
router.get("/:id", authMiddleware, getRewardById);

export default router;
