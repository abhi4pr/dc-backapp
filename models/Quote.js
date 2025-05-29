import mongoose from "mongoose";

const quoteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
    },
    content: {
      type: String,
      trim: true,
    },
    image: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

const Quote = mongoose.model("Quote", quoteSchema);

export default Quote;
