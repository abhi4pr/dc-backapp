import express from "express";
import {
  createLevel,
  getAllLevels,
  getLevelById,
  updateLevel,
  deleteLevel,
} from "../controllers/levelController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import upload, { fileUpload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, createLevel);
router.get("/", authMiddleware, getAllLevels);
router.get("/:id", authMiddleware, getLevelById);
router.put("/:id", authMiddleware, updateLevel);
router.delete("/:id", authMiddleware, deleteLevel);

export default router;
