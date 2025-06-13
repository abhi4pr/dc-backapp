import express from "express";
import {
  getSavingByUserId,
  updateSaving,
  getAllSavings,
  deleteSavingByUserId,
  addSaving,
  getSavingByUserAndDate,
  getTotalSavingsByUser,
} from "../controllers/savingController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/add-saving", authMiddleware, addSaving);
router.get("/", authMiddleware, getAllSavings);
router.get("/user-savings/:userId", authMiddleware, getTotalSavingsByUser);
router.get("/:userId", authMiddleware, getSavingByUserId);
router.get("/user/:userId/date/:date", authMiddleware, getSavingByUserAndDate);
router.put("/", authMiddleware, updateSaving);
router.delete("/:userId", authMiddleware, deleteSavingByUserId);

export default router;
