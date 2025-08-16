import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    surname: {
      type: String,
      required: false,
      default: "",
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    profile_pic: {
      type: String,
      required: false,
      default: "",
    },
    phone: {
      type: String,
      required: false,
      default: 0,
    },
    address: {
      type: String,
      required: false,
      default: "",
    },
    verified: {
      type: Boolean,
      required: false,
      default: false,
    },
    unique_link: {
      type: String,
      // unique: true,
      required: false,
    },
    hit_count: {
      type: Number,
      default: 10,
    },
    hit_limit: {
      type: Number,
      default: 10,
    },
    qualification: {
      type: String,
      required: false,
      default: "",
    },
    specialties: {
      type: String,
      required: false,
      default: ""
    },
    years_experience: {
      type: String,
      required: false,
      default: ""
    },
    license_number: {
      type: String,
      required: false,
      default: ""
    },
    clinic_name: {
      type: String,
      required: false,
      default: ""
    },
    clinic_address: {
      type: String,
      required: false,
      default: ""
    },
    consultation_hours: {
      type: String,
      required: false,
      default: ""
    },
    languages_spoken: {
      type: String,
      required: false,
      default: ""
    },
    fee_structure: {
      type: String,
      required: false,
      default: ""
    },
    emergency_contact: {
      type: String,
      required: false,
      default: ""
    },
    telemedicine_available: {
      type: Boolean
    },
    mfa_enabled: {
      type: Boolean
    },
    profile_visible_to_patients: {
      type: Boolean
    },
    show_license_to_public: {
      type: Boolean
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
