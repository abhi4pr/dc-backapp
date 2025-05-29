import mongoose from "mongoose";

const healthProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      default: "Untitled Profile",
    },
    basicInfo: {
      age: Number,
      gender: { type: String, enum: ["male", "female", "other"] },
      lifestyle: String,
      occupation: String,
    },
    physicalConditions: {
      currentCondition: String,
    },
    dietHabits: {
      currentDiet: String,
    },
    mentalState: {
      currentState: String,
    },
    medicalInfo: {
      currentMedicines: String,
      currentProblem: String,
    },
    attachments: {
      reports: [String],
      doctorFiles: [String],
    },
    profileDate: {
      date: String,
    },
  },
  { timestamps: true }
);

const HealthProfile = mongoose.model("HealthProfile", healthProfileSchema);
export default HealthProfile;
