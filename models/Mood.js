import mongoose from "mongoose";

const moodSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    moodType: {
      type: String,
      required: true,
      //enum: ["happy", "sad", "angry", "anxious", "calm", "excited", "tired", "neutral"], // customizable
    },
    intensity: {
      type: Number,
      min: 1,
      max: 10,
      required: true,
    },
    reason: {
      type: String,
      trim: true,
    },
    note: {
      type: String,
      trim: true,
    },
    date: {
      type: String, // Use string like "2025-05-28" to ensure uniqueness per day
      required: true,
    },
  },
  { timestamps: true }
);

// Ensure only one mood per user per day
moodSchema.index({ user: 1, date: 1 }, { unique: true });

const Mood = mongoose.model("Mood", moodSchema);
export default Mood;
