import mongoose from "mongoose";

const userDietSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    dietItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DietItem",
      required: true,
    },
    time: { type: String, required: true }, // "HH:mm" format
  },
  { timestamps: true }
);

userDietSchema.index({ user: 1, time: 1 }, { unique: true }); // prevent duplicate time

const UserDiet = mongoose.model("UserDiet", userDietSchema);
export default UserDiet;
