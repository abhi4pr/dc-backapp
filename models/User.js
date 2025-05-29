import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 30,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    phone: {
      type: String,
      trim: true,
      maxlength: 10,
    },
    address: {
      type: String,
      trim: true,
    },
    profileImage: {
      type: String,
      trim: true,
    },
    language: {
      type: String,
      enum: ["en", "hi"],
      default: "en",
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
