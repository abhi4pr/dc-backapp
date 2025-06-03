import mongoose from "mongoose";

const medicineOrderSchema = new mongoose.Schema(
  {
    medicine: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Medicine",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    payment_mode: {
      type: String,
      enum: ["Cash", "UPI"],
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "Completed", "Cancelled"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

const MedicineOrder = mongoose.model("MedicineOrder", medicineOrderSchema);

export default MedicineOrder;
