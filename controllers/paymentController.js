import User from "../models/User.js";
import AppError from "../utils/AppError.js";
import asyncHandler from "../utils/asyncHandler.js";
import axios from "axios";
import crypto from "crypto";

const PHONEPE_BASE_URL = "https://api.phonepe.com/apis/hermes/pg/v1";
const MERCHANT_ID = process.env.MERCHANT_ID;
const SALT_KEY = process.env.SALT_KEY;
const SALT_INDEX = process.env.SALT_INDEX;

export const createPayment = asyncHandler(async (req, res) => {
  try {
    const { amount } = req.body;
    const transactionId = "TXN_" + Date.now();
    const payload = {
      merchantId: MERCHANT_ID,
      transactionId,
      amount: amount * 100, // Convert to paisa
      redirectUrl: "http://localhost:5173/success",
      callbackUrl: "http://localhost:5000/payment-status",
    };

    const payloadString = JSON.stringify(payload);
    const checksum =
      crypto
        .createHash("sha256")
        .update(payloadString + SALT_KEY)
        .digest("hex") +
      "###" +
      SALT_INDEX;

    const response = await axios.post(`${PHONEPE_BASE_URL}/initiate`, payload, {
      headers: { "X-VERIFY": checksum, "Content-Type": "application/json" },
    });

    await Payment.create({
      userId: req.body._id, // assuming you have auth middleware setting req.user
      transactionId,
      amount,
      status: "PENDING",
      phonepeResponse: response.data,
    });

    res.status(200).json({
      message: "Payment done successfully",
      checkoutPageUrl: response.data.data.instrumentResponse.redirectInfo.url,
    });
  } catch (error) {
    console.error("Payment Error:", error);
    res.status(500).json({ error: "Payment initiation failed" });
  }
});

export const paymentStatus = asyncHandler(async (req, res) => {
  try {
    const { transactionId, code } = req.body; 

    const status = code === "PAYMENT_SUCCESS" ? "SUCCESS" : "FAILED";

    await Payment.findOneAndUpdate(
      { transactionId },
      { status, phonepeResponse: req.body },
      { new: true }
    );

    res.status(200).json({ message: "Payment status updated" });
  } catch (error) {
    console.error("Status Update Error:", error);
    res.status(500).json({ error: "Status update failed" });
  }
});
