import Sleep from "../models/Sleep.js";
import AppError from "../utils/AppError.js";
import asyncHandler from "../utils/asyncHandler.js";

function calculateSleepDuration(sleepTime, wakeupTime) {
  const [sleepHour, sleepMinute] = sleepTime.split(":").map(Number);
  const [wakeHour, wakeMinute] = wakeupTime.split(":").map(Number);

  const sleepDate = new Date();
  sleepDate.setHours(sleepHour, sleepMinute, 0);

  const wakeDate = new Date();
  wakeDate.setHours(wakeHour, wakeMinute, 0);
  if (wakeDate <= sleepDate) wakeDate.setDate(wakeDate.getDate() + 1);

  const diffMs = wakeDate - sleepDate;
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs / (1000 * 60)) % 60);

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
    2,
    "0"
  )}`;
}

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

// Upsert sleep record for a specific date (overwrite if exists)
export const upsertSleep = asyncHandler(async (req, res) => {
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

  res.status(200).json({
    message: "Sleep record updated",
    sleep,
  });
});

// Get all sleep records (admin/analytics)
export const getAllSleepRecords = asyncHandler(async (req, res) => {
  const records = await Sleep.find().populate("user", "-password");

  res.status(200).json({
    count: records.length,
    records,
  });
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
