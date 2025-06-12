import express from "express";
import {
  addSleep,
  upsertSleep,
  getAllSleepRecords,
  getSleepByUser,
  deleteSleepRecord,
  getSleepByUserAndDate,
} from "../controllers/sleepController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, getAllSleepRecords);
router.get("/:userId", authMiddleware, getSleepByUser);
router.get("/user/:userId/date/:date", authMiddleware, getSleepByUserAndDate);
router.put("/:userId/:date", authMiddleware, addSleep);
router.post("/", authMiddleware, upsertSleep);
router.delete("/:userId/:date", authMiddleware, deleteSleepRecord);

export default router;
