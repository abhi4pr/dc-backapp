import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
      trim: true,
    },
    options: {
      type: [String],
      trim: true,
      required: true,
    },
    category: {
      type: String,
      required: false,
      trim: true,
    },
    sequence: {
      type: Number,
      required: true,
      unique: true,
    },
  },
  { timestamps: true }
);

const Question = mongoose.model("Question", questionSchema);

export default Question;
