import express from "express";
import {
  pateintdata,
  searchRemedy,
  compareData,
  aiReport,
  medicineDetails,
} from "../controllers/aiController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import upload, { fileUpload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post("/send_patient_data", authMiddleware, pateintdata);
router.post("/send_search_remedy", authMiddleware, searchRemedy);
router.post("/send_compare_data", authMiddleware, compareData);
router.post("/send_ai_report", authMiddleware, aiReport);
router.post("/send_medicine_detail", authMiddleware, medicineDetails);

export default router;
