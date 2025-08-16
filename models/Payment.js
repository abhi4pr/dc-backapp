import mongoose from "mongoose";
const PaymentSchema = new mongoose.Schema(
  {
    merchantTransactionId: {
      type: String,
      index: true,
      unique: true
    },
    merchantId: String,
    amount: Number, // paise
    currency: {
      type: String,
      default: "INR"
    },
    userId: String,
    status: {
      type: String,
      enum: ["CREATED", "PENDING", "SUCCESS", "FAILED", "CANCELLED"],
      default: "CREATED"
    },
    rawInitRes: Object,
    rawCallback: Object,
    rawStatus: Object,
  },
  { timestamps: true }
);
export default mongoose.model("Payment", PaymentSchema);
