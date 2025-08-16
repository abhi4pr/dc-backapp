import express from "express";
import {
  createPayment,
  paymentCallback,
  paymentStatus,
} from "../controllers/paymentController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import upload, { fileUpload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post("/create_payment", createPayment);
router.post("/payment_callback", paymentCallback)
router.post("/payment_status/:id", paymentStatus);

export default router;
