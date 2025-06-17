import mongoose from "mongoose";

const answerSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    question: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SelfAssessmentQuestion",
      required: true,
    },
    questionText: {
      type: String,
      required: false,
      default: "",
    },
    selectedOption: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// answerSchema.index({ user: 1, question: 1 }, { unique: true });

const SelfAssessmentAnswer = mongoose.model(
  "SelfAssessmentAnswer",
  answerSchema
);

export default SelfAssessmentAnswer;
