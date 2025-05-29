import mongoose from "mongoose";

const userRoutineSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    routineItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DailyRoutineItem",
      required: true,
    },
    time: { type: String, required: true }, // Format: "HH:mm"
  },
  { timestamps: true }
);

userRoutineSchema.index({ user: 1, time: 1 }, { unique: true });

const UserRoutine = mongoose.model("UserRoutine", userRoutineSchema);
export default UserRoutine;
