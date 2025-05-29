import express from "express";
import {
  assignUserDiet,
  getUserDiets,
  deleteUserDiet,
} from "../controllers/userDietController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, assignUserDiet);
router.get("/", authMiddleware, getUserDiets);
router.delete("/:id", authMiddleware, deleteUserDiet);

export default router;
