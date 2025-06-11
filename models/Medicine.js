import mongoose from "mongoose";

const medicineSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 1,
    },
    images: {
      type: [String],
      // validate: [arrayLimit, "{PATH} exceeds the limit of 3"],
      default: [],
    },
    category: {
      type: String,
      trim: true,
      default: "General",
      enum: [
        "General",
        "Homeopathy Remedies",
        "Ayurvedic Formulas",
        "Freedom In-House Combos Emotional Healing Kits",
        "Detox Kits",
        "Supplementary Support (Oils, Tonics, Teas)",
      ],
    },
  },
  { timestamps: true }
);

const Medicine = mongoose.model("Medicine", medicineSchema);

export default Medicine;
