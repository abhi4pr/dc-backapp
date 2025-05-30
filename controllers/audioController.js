import Audio from "../models/Audio.js";
import AppError from "../utils/AppError.js";
import asyncHandler from "../utils/asyncHandler.js";

// Add audio
export const addAudio = asyncHandler(async (req, res) => {
  const { title, description, category } = req.body;

  if (!title) throw new AppError("Title is required", 400);
  if (!req.file) throw new AppError("Audio file is required", 400);

  const audioPath = req.fileUrl;

  const audio = await Audio.create({
    title,
    description,
    category,
    audioFile: audioPath,
  });

  res.status(201).json({
    message: "Audio added successfully",
    audio,
  });
});

// Get all audios
export const getAllAudios = asyncHandler(async (req, res) => {
  const audios = await Audio.find().sort({ createdAt: -1 });

  res.status(200).json({
    count: audios.length,
    audios,
  });
});

// Get audio by ID
export const getAudioById = asyncHandler(async (req, res) => {
  const audio = await Audio.findById(req.params.id);

  if (!audio) throw new AppError("Audio not found", 404);

  res.status(200).json({ audio });
});

// Update audio
export const updateAudio = asyncHandler(async (req, res) => {
  const updates = req.body;

  if (req.file) {
    updates.audioFile = req.fileUrl;
  }

  const updatedAudio = await Audio.findByIdAndUpdate(
    req.params.id,
    { $set: updates },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!updatedAudio) throw new AppError("Audio not found", 404);

  res.status(200).json({
    message: "Audio updated successfully",
    audio: updatedAudio,
  });
});

// Delete audio
export const deleteAudio = asyncHandler(async (req, res) => {
  const deleted = await Audio.findByIdAndDelete(req.params.id);

  if (!deleted) throw new AppError("Audio not found", 404);

  res.status(200).json({
    message: "Audio deleted successfully",
  });
});
