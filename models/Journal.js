import { required } from "joi";
import mongoose from "mongoose";

const journalSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 1,
    },
    content: {
      type: String,
      trim: true,
    },
    emoji: {
      type: String,
      required: false,
    },
    journal_date: {
      type: Date,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    image: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

const Journal = mongoose.model("Journal", journalSchema);

export default Journal;
