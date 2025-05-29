import Contact from "../models/Contact.js";
import AppError from "../utils/AppError.js";
import asyncHandler from "../utils/asyncHandler.js";

export const addContacts = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { contacts } = req.body;

  if (!Array.isArray(contacts)) {
    throw new AppError("Contacts must be an array", 400);
  }

  const existing = await Contact.findOne({ user: userId });
  if (existing) throw new AppError("Contact list already exists", 400);

  const contactList = await Contact.create({
    user: userId,
    contacts,
  });

  res.status(201).json({
    message: "Contact list created",
    contacts: contactList,
  });
});

// Get contact list by user
export const getContactsByUser = asyncHandler(async (req, res) => {
  const contacts = await Contact.findOne({ user: req.params.userId });

  if (!contacts) throw new AppError("Contact list not found", 404);

  res.status(200).json({ contacts });
});

// Upsert (create/update) contact list for user
export const updateContacts = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { contacts } = req.body;

  if (!Array.isArray(contacts)) {
    throw new AppError("Contacts must be an array", 400);
  }

  const updated = await Contact.findOneAndUpdate(
    { user: userId },
    { $set: { contacts } },
    { new: true, upsert: true, runValidators: true }
  );

  res.status(200).json({
    message: "Contacts updated",
    contacts: updated,
  });
});

// Get all users' contacts (admin/analytics)
export const getAllContacts = asyncHandler(async (req, res) => {
  const allContacts = await Contact.find().populate("user", "-password");

  res.status(200).json({
    count: allContacts.length,
    contacts: allContacts,
  });
});

// Delete a contact list by user
export const deleteContactsByUser = asyncHandler(async (req, res) => {
  const contactList = await Contact.findOneAndDelete({
    user: req.params.userId,
  });

  if (!contactList) throw new AppError("Contact list not found", 404);

  res.status(200).json({
    message: "Contact list deleted successfully",
  });
});
