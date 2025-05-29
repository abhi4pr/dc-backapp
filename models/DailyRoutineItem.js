import mongoose from "mongoose";

const dailyRoutineItemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    image: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

const DailyRoutineItem = mongoose.model(
  "DailyRoutineItem",
  dailyRoutineItemSchema
);

export default DailyRoutineItem;
