import mongoose from "mongoose";

const optionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  value: { type: String },
  nextStepId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Step",
    required: false,
  },
});

const stepSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: [
        "quote",
        "video",
        "dialogue",
        "question",
        "image",
        "result",
        "instruction",
      ],
    },
    content: {
      text: { type: String },
      src: { type: String },
      sound: { type: String },
      speaker: { type: String },
      avatar: { type: String },
      dialogues: [{ type: String }],
      options: [optionSchema],
    },
  },
  { _id: false }
);

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    isCompleted: { type: Boolean, default: false },
    type: {
      type: String,
      enum: ["quiz", "drag-drop", "timer", "gesture", "custom"],
      default: "quiz",
    },
    data: { type: mongoose.Schema.Types.Mixed },
  },
  { _id: false }
);

const levelSchema = new mongoose.Schema(
  {
    levelNumber: { type: Number, required: true, unique: true },
    title: { type: String, required: true },
    isLocked: { type: Boolean, default: true },
    steps: [stepSchema],
    tasks: [taskSchema],
    rewards: {
      unlocks: [{ type: String }],
      message: { type: String },
    },
  },
  { timestamps: true }
);

const Level = mongoose.model("Level", levelSchema);
export default Level;
