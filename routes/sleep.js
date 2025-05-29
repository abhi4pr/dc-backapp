import express from "express";
import {
  addSleep,
  upsertSleep,
  getAllSleepRecords,
  getSleepByUser,
  deleteSleepRecord,
} from "../controllers/sleepController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, getAllSleepRecords);
router.get("/:userId", authMiddleware, getSleepByUser);
router.post("/add", authMiddleware, addSleep);
router.post("/", authMiddleware, upsertSleep);
router.delete("/:userId/:date", authMiddleware, deleteSleepRecord);

export default router;
