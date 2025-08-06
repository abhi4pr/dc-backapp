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

router.post("/send_patient_data/:_id", authMiddleware, pateintdata);
router.post("/send_search_remedy/:_id", authMiddleware, searchRemedy);
router.post("/send_compare_data/:_id", authMiddleware, compareData);
router.post("/send_ai_report/:_id", authMiddleware, aiReport);
router.post("/send_medicine_detail/:_id", authMiddleware, medicineDetails);

export default router;
