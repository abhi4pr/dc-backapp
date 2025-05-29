import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    options: {
      type: [String],
      //   validate: {
      //     validator: (val) => val.length === 4,
      //     message: "There must be exactly 4 options",
      //   },
      required: true,
    },
    note: {
      type: String,
    },
  },
  { timestamps: true }
);

const SelfAssessmentQuestion = mongoose.model(
  "SelfAssessmentQuestion",
  questionSchema
);

export default SelfAssessmentQuestion;
