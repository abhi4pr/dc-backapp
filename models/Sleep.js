import mongoose from "mongoose";

const sleepSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    sleepTime: {
      type: String,
      required: true,
    },
    wakeupTime: {
      type: String, // e.g. "06:30"
      required: true,
    },
    alarm: {
      type: Boolean,
      default: false,
    },
    alarmTime: {
      type: String,
    },
    daySleep: {
      type: Boolean,
      default: false,
    },
    daySleepTime: {
      type: String,
    },
    totalSleepTime: {
      type: String, // e.g. "08:00"
      required: true,
    },
  },
  { timestamps: true }
);

const Sleep = mongoose.model("Sleep", sleepSchema);

export default Sleep;
