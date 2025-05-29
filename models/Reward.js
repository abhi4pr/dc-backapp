import mongoose from "mongoose";

const rewardSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    level: {
      type: Number,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      trim: true,
    },
    image: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

rewardSchema.pre("validate", async function (next) {
  if (this.isNew && !this.level) {
    const lastReward = await mongoose.model("Reward").findOne().sort("-level");
    this.level = lastReward ? lastReward.level + 1 : 1;
  }
  next();
});

const Reward = mongoose.model("Reward", rewardSchema);
export default Reward;
