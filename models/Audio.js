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
      enum: [
        "General",
        "Spiritual",
        "Bhakti & Mantra",
        "Guided Meditation",
        "De-addiction Support",
        "Emotional Healing",
        "Mind Detox",
        "Motivational",
        "Sleep & Relaxation",
        "Inner Child Healing",
        "Daily Mental Dose Morning/night ritual audios",
        "Wisdom",
        "User Stories/Real Talks",
        "Binaural beats",
        "Frequency Healing",
      ],
      trim: true,
      default: "General",
    },
  },
  { timestamps: true }
);

const Audio = mongoose.model("Audio", audioSchema);

export default Audio;
