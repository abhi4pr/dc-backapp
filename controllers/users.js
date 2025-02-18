const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel.js');
const variables = require('../variables.js')
const nodemailer = require("nodemailer");
const CryptoJS = require("crypto-js");
const { fileUpload } = require('../fileUpload.js');

const encryptPassword = (password) => {
  return CryptoJS.AES.encrypt(password, variables.PASS_KEY).toString();
};

const decryptPassword = (encryptedPassword) => {
  const bytes = CryptoJS.AES.decrypt(encryptedPassword, variables.PASS_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
};

exports.addUser = async (req, res) => {
  try {
    const { user_email, user_name, user_password, user_phone, user_address } = req.body;
    const user_image = req.file;

    const existingUser = await userModel.findOne({ user_email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const encryptedPassword = encryptPassword(user_password);

    let imageUrl = null;
    if (user_image) {
      imageUrl = await fileUpload(user_image);
    }

    const newUser = new userModel({
      user_email,
      user_name,
      user_password: encryptedPassword,
      user_phone,
      user_address,
      // user_status,
      user_image: imageUrl
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

exports.getSingleUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User retrieved successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const totalUsers = await userModel.countDocuments({ user_status: 1 });

    const users = await userModel.find({ user_status: 1 }).skip(skip).limit(limit);
    const totalPages = Math.ceil(totalUsers / limit);

    res.status(200).json({
      message: "Users retrieved successfully",
      users,
      pagination: {
        totalUsers,
        totalPages,
        currentPage: page,
        perPage: limit,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { user_name, user_email, user_phone, user_address, user_password } = req.body;

    const updatedData = {};

    if (user_name) updatedData.user_name = user_name;
    if (user_email) updatedData.user_email = user_email;
    if (user_phone) updatedData.user_phone = user_phone;
    if (user_address) updatedData.user_address = user_address;

    if (user_password) {
      updatedData.user_password = encryptPassword(user_password);
    }

    const updatedUser = await userModel.findByIdAndUpdate(userId, updatedData, { new: true });
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User updated successfully", user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { user_email, user_password } = req.body;

    const user = await userModel.findOne({ user_email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (user.user_status === 0) {
      return res.status(403).json({ message: "Your account is deactivated. Please contact support." });
    }

    const decryptedPassword = decryptPassword(user.user_password);
    if (decryptedPassword !== user_password) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id, user_email: user.user_email }, "your_jwt_secret", { expiresIn: "1h" });

    res.status(200).json({ message: "Login successful", token, user });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const updatedUser = await User.findByIdAndUpdate(userId, { user_status: 0 }, { new: true });
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deactivated successfully", user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};