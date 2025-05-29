import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      enum: [
        "Default",
        "Fiction",
        "Non-Fiction",
        "Science",
        "History",
        "Biography",
        "Fantasy",
        "Mystery",
        "Romance",
        "Self-Help",
        "Health & Wellness",
      ],
      default: "Default",
    },
    pdfFile: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Book = mongoose.model("Book", bookSchema);
export default Book;
