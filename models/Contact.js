import mongoose from "mongoose";

const singleContactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: false }
);

const contactSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    contacts: {
      type: [singleContactSchema],
      default: [],
    },
  },
  { timestamps: true }
);

const Contact = mongoose.model("Contact", contactSchema);

export default Contact;
