import express from "express";
import {
  createPayment,
  paymentStatus,
} from "../controllers/paymentController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import upload, { fileUpload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post("/create_payment", createPayment);
router.post("/payment_status", paymentStatus);

export default router;
