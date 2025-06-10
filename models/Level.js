import mongoose from "mongoose";

const optionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  value: { type: String },
  image: { type: String }, // Optional image with option
  nextStepId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Step",
    required: false,
  },
});

const stepSchema = new mongoose.Schema(
  {
    sequenceOrder: { type: Number }, // To maintain flow order
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
        "avatar",
        "communication",
      ],
    },
    content: {
      text: { type: String }, // For quote, dialogue, question, instruction
      src: { type: String }, // For video/image/audio
      sound: { type: String }, // For audio effects
      speaker: { type: String }, // For dialogue speaker name
      avatar: { type: String }, // For avatar image
      dialogues: [{ type: String }], // For multi-line conversations
      options: [optionSchema], // For question-type steps
    },
    isSkippable: { type: Boolean, default: false },
    isMandatory: { type: Boolean, default: true },
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
      unlocks: [{ type: String }], // e.g. ['diary', 'mirror', 'replay']
      message: { type: String }, // e.g. 'Congratulations, you cleared Level 1'
    },
  },
  { timestamps: true }
);

const Level = mongoose.model("Level", levelSchema);
export default Level;
