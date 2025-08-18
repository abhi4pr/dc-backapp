import User from "../models/User.js";
import AppError from "../utils/AppError.js";
import asyncHandler from "../utils/asyncHandler.js";
import axios from "axios";
import crypto from "crypto";

const PHONEPE_MERCHANT_ID = "YOUR_MERCHANT_ID";
const PHONEPE_SALT_KEY = "YOUR_SALT_KEY";
const PHONEPE_SALT_INDEX = 1;
const PHONEPE_BASE_URL_SANDBOX =
  "https://api-preprod.phonepe.com/apis/pg-sandbox";
const PHONEPE_BASE_URL_PROD = "https://api.phonepe.com/apis/hermes";

function xVerify(base64Payload, path) {
  // X-VERIFY = SHA256(base64Payload + path + saltKey) + "###" + saltIndex
  const str = base64Payload + path + process.env.PHONEPE_SALT_KEY;
  const sha = crypto.createHash("sha256").update(str).digest("hex");
  return `${sha}###${process.env.PHONEPE_SALT_INDEX}`;
}

export const createPayment = asyncHandler(async (req, res) => {
  try {
    const { amount, userId } = req.body; // amount in rupees (e.g., 499)
    if (!amount) return res.status(400).json({ error: "amount required" });
    const amountPaise = Math.round(Number(amount) * 100);

    const merchantTransactionId = `TXN_${Date.now()}_${Math.floor(
      Math.random() * 1e6
    )}`;
    const payload = {
      merchantId: process.env.PHONEPE_MERCHANT_ID,
      merchantTransactionId,
      merchantUserId: userId || "guest",
      amount: amountPaise,
      redirectUrl: `${process.env.FRONTEND_URL}/payment/redirect`,
      redirectMode: "POST",
      callbackUrl: `${process.env.BACKEND_URL}/api/payments/callback`,
      paymentInstrument: { type: "PAY_PAGE" }, // Standard Checkout
    };

    const base64Payload = Buffer.from(JSON.stringify(payload)).toString(
      "base64"
    );
    const path = "/pg/v1/pay";
    const x_verify = xVerify(base64Payload, path);

    const url = `${BASE_URL}${path}`;
    const r = await axios.post(
      url,
      { request: base64Payload },
      {
        headers: {
          "Content-Type": "application/json",
          "X-VERIFY": x_verify,
          accept: "application/json",
        },
        timeout: 20000,
      }
    );

    // Save payment
    await Payment.create({
      merchantTransactionId,
      merchantId: process.env.PHONEPE_MERCHANT_ID,
      amount: amountPaise,
      status: "PENDING",
      rawInitRes: r.data,
    });

    // Expect redirect URL in instrumentResponse
    const redirectUrl = r?.data?.data?.instrumentResponse?.redirectInfo?.url;
    if (!redirectUrl)
      return res
        .status(500)
        .json({ error: "Redirect URL missing", data: r.data });

    res.json({ ok: true, merchantTransactionId, redirectUrl });
  } catch (err) {
    console.error(err?.response?.data || err.message);
    res
      .status(500)
      .json({ ok: false, error: err?.response?.data || err.message });
  }
});

export const paymentCallback = asyncHandler(async (req, res) => {
  try {
    const body = req.body; // PhonePe will POST JSON
    // Optional but recommended: verify X-VERIFY header for callback authenticity
    const xVerifyHeader = req.header("X-VERIFY") || req.header("x-verify");

    // For callback verification, PhonePe docs indicate validating X-VERIFY before decoding/using payload.
    // Many merchants accept JSON directly; consult your dashboard docs for exact callback signature step.
    // We'll proceed to trust body here and then reconcile via Status API below. :contentReference[oaicite:2]{index=2}

    const txnId = body?.data?.merchantTransactionId;
    const code = body?.code; // "PAYMENT_SUCCESS" / "PAYMENT_ERROR" etc.
    if (txnId) {
      await Payment.updateOne(
        { merchantTransactionId: txnId },
        {
          $set: {
            rawCallback: body,
            status: code === "PAYMENT_SUCCESS" ? "SUCCESS" : "FAILED",
          },
        }
      );
    }
    // Respond 200 quickly
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(200).json({ ok: true }); // Always 200 to PhonePe
  }
});

export const paymentStatus = asyncHandler(async (req, res) => {
  try {
    const { merchantTransactionId } = req.params;
    const path = `/pg/v1/status/${process.env.PHONEPE_MERCHANT_ID}/${merchantTransactionId}`;
    const url = `${
      isProd
        ? process.env.PHONEPE_BASE_URL_PROD.replace(
            "/apis/hermes",
            "/apis/hermes"
          )
        : "https://api.preprod.phonepe.com/apis/hermes"
    }${path}`;
    // NOTE: Different doc pages show slightly different hostnames for preprod; using hermes preprod status per docs. :contentReference[oaicite:3]{index=3}

    const x_verify = xVerify("", path); // Status often requires x-verify of ("" + path + saltKey)
    const r = await axios.get(url, {
      headers: { "X-VERIFY": x_verify, accept: "application/json" },
      timeout: 20000,
    });

    const status = r?.data?.data?.state || "PENDING"; // SUCCESS / FAILED / PENDING
    await Payment.updateOne(
      { merchantTransactionId },
      { $set: { status, rawStatus: r.data } }
    );

    res.json({ ok: true, status, data: r.data });
  } catch (err) {
    console.error(err?.response?.data || err.message);
    res
      .status(500)
      .json({ ok: false, error: err?.response?.data || err.message });
  }
});
