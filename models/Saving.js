import mongoose from "mongoose";

const savingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    cigarette: {
      type: Boolean,
      default: false,
    },
    dailyCigaretteCost: {
      type: Number,
      default: 0,
    },
    totalCigaretteSaving: {
      type: Number,
      default: 0,
    },
    alcohol: {
      type: Boolean,
      default: false,
    },
    dailyAlcoholCost: {
      type: Number,
      default: 0,
    },
    totalAlcoholSaving: {
      type: Number,
      default: 0,
    },
    weed: {
      type: Boolean,
      default: false,
    },
    dailyWeedCost: {
      type: Number,
      default: 0,
    },
    totalWeedSaving: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Saving = mongoose.model("Saving", savingSchema);

export default Saving;
