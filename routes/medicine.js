import express from "express";
import {
  getAllMedicines,
  getMedicineById,
  deleteMedicine,
  updateMedicine,
  addMedicine,
} from "../controllers/medicineController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import upload, { fileUploads } from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post(
  "/add-medicine",
  authMiddleware,
  upload.array("images", 3),
  fileUploads,
  addMedicine
);
router.get("/:id", authMiddleware, getMedicineById);
router.put(
  "/update-medicine",
  authMiddleware,
  upload.array("images", 3),
  fileUploads,
  updateMedicine
);
router.get("/get_all_medicines", authMiddleware, getAllMedicines);
router.delete("/:id", authMiddleware, deleteMedicine);

export default router;
