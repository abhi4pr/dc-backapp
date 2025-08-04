import express from "express";
import { pateintdata } from "../controllers/aiController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import upload, { fileUpload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post("/send_patient_data", authMiddleware, pateintdata);

export default router;
