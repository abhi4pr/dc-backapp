import express from "express";
import {
  addDietItem,
  getAllDietItems,
  getDietItemById,
  updateDietItem,
  deleteDietItem,
} from "../controllers/dietController.js";
import upload from "../middleware/uploadMiddleware.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, upload.single("image"), addDietItem);
router.get("/", authMiddleware, getAllDietItems);
router.get("/:id", authMiddleware, getDietItemById);
router.put("/:id", authMiddleware, upload.single("image"), updateDietItem);
router.delete("/:id", authMiddleware, deleteDietItem);

export default router;
