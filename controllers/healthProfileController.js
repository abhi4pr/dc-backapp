import HealthProfile from "../models/HealthProfile.js";
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";

export const addHealthProfile = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const body = req.body;

  const reports = req.files?.reports?.map((file) => req.fileUrl) || [];
  const doctorFiles = req.files?.doctorFiles?.map((file) => req.fileUrl) || [];

  const newProfile = new HealthProfile({
    ...body,
    user: userId,
    attachments: {
      reports,
      doctorFiles,
    },
  });

  await newProfile.save();
  res
    .status(201)
    .json({ message: "Health profile created", profile: newProfile });
});

export const updateHealthProfile = asyncHandler(async (req, res) => {
  const profileId = req.params.id;
  const userId = req.user.id;
  const body = req.body;

  const reports = req.files?.reports?.map((file) => req.fileUrl) || [];
  const doctorFiles = req.files?.doctorFiles?.map((file) => req.fileUrl) || [];

  const updated = await HealthProfile.findOneAndUpdate(
    { _id: profileId, user: userId },
    {
      ...body,
      $push: {
        "attachments.reports": { $each: reports },
        "attachments.doctorFiles": { $each: doctorFiles },
      },
    },
    { new: true, runValidators: true }
  );

  if (!updated) throw new AppError("Profile not found or unauthorized", 404);

  res.status(200).json({ message: "Health profile updated", profile: updated });
});

export const getMyHealthProfiles = asyncHandler(async (req, res) => {
  const profiles = await HealthProfile.find({ user: req.user.id }).sort({
    createdAt: -1,
  });
  res.status(200).json(profiles);
});

export const getHealthProfileById = asyncHandler(async (req, res) => {
  const profile = await HealthProfile.findById(req.params.id).populate(
    "user",
    "name email"
  );
  if (!profile) throw new AppError("Profile not found", 404);
  res.status(200).json(profile);
});

export const getAllHealthProfiles = asyncHandler(async (req, res) => {
  const profiles = await HealthProfile.find().populate("user", "name email");
  res.status(200).json(profiles);
});

export const deleteHealthProfile = asyncHandler(async (req, res) => {
  const deleted = await HealthProfile.findByIdAndDelete(req.params.id);
  if (!deleted) throw new AppError("Profile not found", 404);
  res.status(200).json({ message: "Health profile deleted" });
});
