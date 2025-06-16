import Sleep from "../models/Sleep.js";
import AppError from "../utils/AppError.js";
import asyncHandler from "../utils/asyncHandler.js";

export const addSleep = asyncHandler(async (req, res) => {
  // const userId = req.user.id;
  const {
    user,
    date,
    sleepTime,
    wakeupTime,
    alarm,
    alarmTime,
    daySleep,
    daySleepTime,
    totalSleepTime,
  } = req.body;

  const existing = await Sleep.findOne({
    user: req.body.user,
    date: req.body.date,
  });
  if (existing)
    throw new AppError("Sleep record already exists for this date", 400);

  const sleep = await Sleep.create({
    user: req.body.user,
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

function parseTimeString(timeStr) {
  if (!/^\d{2}:\d{2}$/.test(timeStr)) return null;
  const [hours, minutes] = timeStr.split(":").map(Number);
  return hours * 60 + minutes;
}

function calculateSleepDuration(sleepTime, wakeupTime) {
  // Accepts "HH:mm" format
  const sleepMins = parseTimeString(sleepTime);
  const wakeMins = parseTimeString(wakeupTime);
  if (sleepMins === null || wakeMins === null) return null;
  let diff = wakeMins - sleepMins;
  if (diff < 0) diff += 24 * 60;
  return diff;
}

// Upsert sleep record for a specific date (overwrite if exists)
export const upsertSleep = asyncHandler(async (req, res) => {
  const { user, date } = req.params;

  let {
    sleepTime,
    wakeupTime,
    alarm,
    alarmTime,
    daySleep,
    daySleepTime,
    totalSleepTime,
  } = req.body;

  if (!user || !date) {
    res.status(400);
    throw new Error("Missing user or date in URL parameters");
  }

  // Always recalculate totalSleepTime if sleepTime and wakeupTime are provided
  if (sleepTime && wakeupTime) {
    totalSleepTime = calculateSleepDuration(sleepTime, wakeupTime);
  }

  const sleep = await Sleep.findOneAndUpdate(
    { user: user, date: date },
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

export const getSleepByUserAndDate = asyncHandler(async (req, res) => {
  const { user, date } = req.params;

  const sleep = await Sleep.findOne({ user: user, date });

  if (!sleep) throw new AppError("Sleep record not found", 404);

  res.status(200).json({ sleep });
});

// Get sleep records for specific user
export const getSleepByUser = asyncHandler(async (req, res) => {
  const user = req.params.user;

  const records = await Sleep.find({ user: user }).sort({ date: -1 });

  res.status(200).json({ records });
});
