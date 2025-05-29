import mongoose from "mongoose";

const audioSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
    },
    description: {
      type: String,
      trim: true,
    },
    audioFile: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      enum: ["General", "Music", "Podcast", "Audiobook"],
      trim: true,
      default: "General",
    },
  },
  { timestamps: true }
);

const Audio = mongoose.model("Audio", audioSchema);

export default Audio;
