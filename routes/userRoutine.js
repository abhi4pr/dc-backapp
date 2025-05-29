import express from "express";
import {
  assignUserRoutine,
  getUserRoutines,
  deleteUserRoutine,
} from "../controllers/userRoutineController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, assignUserRoutine);
router.get("/", authMiddleware, getUserRoutines);
router.delete("/:id", authMiddleware, deleteUserRoutine);

export default router;
