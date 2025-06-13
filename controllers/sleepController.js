import Sleep from "../models/Sleep.js";
import AppError from "../utils/AppError.js";
import asyncHandler from "../utils/asyncHandler.js";

// const totalSleepTime = calculateSleepDuration(sleepTime, wakeupTime);

// Add a new sleep record (only if not already exists for user & date)
export const addSleep = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const {
    date,
    sleepTime,
    wakeupTime,
    alarm,
    alarmTime,
    daySleep,
    daySleepTime,
    totalSleepTime,
  } = req.body;

  const existing = await Sleep.findOne({ user: userId, date });
  if (existing)
    throw new AppError("Sleep record already exists for this date", 400);

  const sleep = await Sleep.create({
    user: userId,
    date,
    sleepTime,
    wakeupTime,
    alarm,
    alarmTime,
    daySleep,
    daySleepTime,
    totalSleepTime,
  });

  res.status(201).json({
    message: "Sleep record added",
    sleep,
  });
});

// Helper to calculate total sleep duration in minutes
function calculateSleepDuration(sleepTime, wakeupTime) {
  if (!sleepTime || !wakeupTime) return null;
  const sleep = new Date(sleepTime);
  const wake = new Date(wakeupTime);
  let diff = (wake - sleep) / (1000 * 60); // difference in minutes
  if (diff < 0) diff += 24 * 60; // handle overnight sleep
  return diff;
}

// Upsert sleep record for a specific date (overwrite if exists)
export const upsertSleep = asyncHandler(async (req, res) => {
  const { userId, date } = req.params;

  let {
    sleepTime,
    wakeupTime,
    alarm,
    alarmTime,
    daySleep,
    daySleepTime,
    totalSleepTime,
  } = req.body;

  if (!userId || !date) {
    res.status(400);
    throw new Error("Missing userId or date in URL parameters");
  }

  // Always recalculate totalSleepTime if sleepTime and wakeupTime are provided
  if (sleepTime && wakeupTime) {
    totalSleepTime = calculateSleepDuration(sleepTime, wakeupTime);
  }

  const sleep = await Sleep.findOneAndUpdate(
    { user: userId, date },
    {
      $set: {
        sleepTime,
        wakeupTime,
        alarm,
        alarmTime,
        daySleep,
        daySleepTime,
        totalSleepTime,
      },
    },
    { new: true, upsert: true, runValidators: true }
  );

  res.status(200).json(sleep);
});

// Get all sleep records (admin/analytics)
export const getAllSleepRecords = asyncHandler(async (req, res) => {
  const records = await Sleep.find().populate("user", "-password");

  res.status(200).json({
    count: records.length,
    records,
  });
});

export const getSleepByUserAndDate = asyncHandler(async (req, res) => {
  const { userId, date } = req.params;

  const sleep = await Sleep.findOne({ user: userId, date });

  if (!sleep) throw new AppError("Sleep record not found", 404);

  res.status(200).json({ sleep });
});

// Get sleep records for specific user
export const getSleepByUser = asyncHandler(async (req, res) => {
  const userId = req.params.userId;

  const records = await Sleep.find({ user: userId }).sort({ date: -1 });

  res.status(200).json({ records });
});

// Delete sleep record by user and date
export const deleteSleepRecord = asyncHandler(async (req, res) => {
  const { userId, date } = req.params;

  const record = await Sleep.findOneAndDelete({ user: userId, date });

  if (!record) throw new AppError("Sleep record not found", 404);

  res.status(200).json({
    message: "Sleep record deleted",
  });
});
