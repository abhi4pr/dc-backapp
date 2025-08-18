import OpenAI from "openai";
import User from "../models/User.js";

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

export const updateChatCount = async (userId) => {
  if (!userId) throw new Error("User ID is required to update chat limit");

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $dec: { hit_count: 1 } },
    { new: true, runValidators: true }
  );

  return updatedUser;
};
