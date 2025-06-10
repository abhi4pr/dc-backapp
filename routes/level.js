import express from "express";
import {
  addLevel,
  getAllLevels,
  getLevelByNumber,
  updateLevel,
  deleteLevel,
} from "../controllers/levelController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/add-level", authMiddleware, addLevel);
router.put("/:id", authMiddleware, updateLevel);
router.delete("/:id", authMiddleware, deleteLevel);
router.get("/", authMiddleware, getAllLevels);
router.get("/:levelNumber", authMiddleware, getLevelByNumber);

export default router;
