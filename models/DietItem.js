import mongoose from "mongoose";

const dietItemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    image: { type: String, trim: true },
    category: {
      type: String,
      trim: true,
      enum: [
        "General",
        "Indian Recipes",
        "Grains",
        "Vegetables",
        "Fruits Dairy",
        "Veg",
        "Non-veg",
        "Indian Recipes",
        "Satvik food",
        "Special Drinks",
      ],
      default: "General",
    },
    calories: { type: String, trim: true },
  },
  { timestamps: true }
);

const DietItem = mongoose.model("DietItem", dietItemSchema);
export default DietItem;
