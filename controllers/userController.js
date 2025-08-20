import User from "../models/User.js";
import AppError from "../utils/AppError.js";
import asyncHandler from "../utils/asyncHandler.js";

export const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params._id).select("-password");

  if (!user) throw new AppError("User not found", 404);

  res.status(200).json({ message: "user retrieved successfully", user });
});

export const updateUser = asyncHandler(async (req, res) => {
  const bodyData = req.body;

  const userId = req.params._id;
  const updates = {};

  if (bodyData.name) updates.name = bodyData.name;
  if (bodyData.surname) updates.surname = bodyData.surname;
  if (bodyData.address) updates.address = bodyData.address;
  if (bodyData.phone) updates.phone = bodyData.phone;
  // if (bodyData.unique_link) updates.unique_link = bodyData.unique_link;
  if (bodyData.qualification) updates.qualification = bodyData.qualification;
  if (bodyData.specialties) updates.specialties = bodyData.specialties;
  if (bodyData.years_experience)
    updates.years_experience = bodyData.years_experience;
  if (bodyData.license_number) updates.license_number = bodyData.license_number;
  if (bodyData.clinic_name) updates.clinic_name = bodyData.clinic_name;
  if (bodyData.clinic_address) updates.clinic_address = bodyData.clinic_address;
  if (bodyData.consultation_hours)
    updates.consultation_hours = bodyData.consultation_hours;
  if (bodyData.languages_spoken)
    updates.languages_spoken = bodyData.languages_spoken;
  if (bodyData.fee_structure) updates.fee_structure = bodyData.fee_structure;
  if (bodyData.emergency_contact)
    updates.emergency_contact = bodyData.emergency_contact;
  if (bodyData.telemedicine_available !== undefined)
    updates.telemedicine_available = bodyData.telemedicine_available;
  if (bodyData.mfa_enabled !== undefined)
    updates.mfa_enabled = bodyData.mfa_enabled;
  if (bodyData.profile_visible_to_patients !== undefined)
    updates.profile_visible_to_patients = bodyData.profile_visible_to_patients;
  if (bodyData.show_license_to_public !== undefined)
    updates.show_license_to_public = bodyData.show_license_to_public;

  if (req.file) {
    const imagePath = req.fileUrl;
    updates.profile_pic = imagePath;
  }

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $set: updates },
    { new: true, runValidators: true }
  ).select("-password");

  if (!updatedUser) throw new AppError("User not found", 404);

  res.status(200).json({
    message: "Profile updated successfully",
    user: updatedUser,
  });
});

export const updatePassword = asyncHandler(async (req, res) => {
  const userId = req.params._id;
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    throw new AppError("Both current and new passwords are required", 400);
  }

  const user = await User.findById(userId);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) {
    throw new AppError("Current password is incorrect", 401);
  }

  user.password = newPassword;
  await user.save();

  res.status(200).json({
    message: "Password updated successfully",
  });
});

export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);

  if (!user) throw new AppError("User not found", 404);

  res.status(200).json({
    message: "User deleted successfully",
  });
});

export const updateUserChatLimit = asyncHandler(async (req, res) => {
  const userId = req.params._id;

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $set: { hit_limit: 100 } },
    { new: true, runValidators: true }
  );

  if (!updatedUser) throw new AppError("User not found", 404);

  res.status(200).json({
    message: "User chat limit updated successfully",
    user: updatedUser,
  });
});
