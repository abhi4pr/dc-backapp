import mongoose from "mongoose";

const savingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: String,
      required: false,
    },
    cigarette: {
      type: Number,
      default: false,
    },
    dailyCigaretteCost: {
      type: Number,
      default: 0,
    },
    alcohol: {
      type: Number,
      default: false,
    },
    dailyAlcoholCost: {
      type: Number,
      default: 0,
    },
    weed: {
      type: Number,
      default: false,
    },
    dailyWeedCost: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Saving = mongoose.model("Saving", savingSchema);

export default Saving;
