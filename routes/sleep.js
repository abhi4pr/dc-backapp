import express from "express";
import {
  addSleep,
  upsertSleep,
  // getAllSleepRecords,
  getSleepByUser,
  // deleteSleepRecord,
  getSleepByUserAndDate,
} from "../controllers/sleepController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// router.get("/", authMiddleware, getAllSleepRecords);
router.get("/:user", authMiddleware, getSleepByUser);
router.get("/user/:user/date/:date", authMiddleware, getSleepByUserAndDate);
router.put("/:user/:date", authMiddleware, upsertSleep);
router.post("/", authMiddleware, addSleep);
// router.delete("/:user/:date", authMiddleware, deleteSleepRecord);

export default router;
