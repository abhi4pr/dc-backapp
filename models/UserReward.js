import mongoose from "mongoose";

const userRewardSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reward: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Reward",
      required: true,
    },
  },
  { timestamps: true }
);

userRewardSchema.index({ user: 1, reward: 1 }, { unique: true });

const UserReward = mongoose.model("UserReward", userRewardSchema);
export default UserReward;
