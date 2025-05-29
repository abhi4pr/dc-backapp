import express from "express";
import {
  getSavingByUserId,
  updateSaving,
  getAllSavings,
  deleteSavingByUserId,
  addSaving,
} from "../controllers/savingController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/add-saving", authMiddleware, addSaving);
router.get("/", authMiddleware, getAllSavings);
router.get("/:userId", authMiddleware, getSavingByUserId);
router.post("/", authMiddleware, updateSaving);
router.delete("/:userId", authMiddleware, deleteSavingByUserId);

export default router;
