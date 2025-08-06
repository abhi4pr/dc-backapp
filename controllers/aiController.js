import asyncHandler from "../utils/asyncHandler.js";
import OpenAI from "openai";
import User from "../models/User.js";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || "",
});

const updateChatCount = async (userId) => {
  if (!userId) throw new Error("User ID is required to update chat limit");

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $inc: { hit_count: 1 } },
    { new: true, runValidators: true }
  );

  return updatedUser;
};

export const pateintdata = asyncHandler(async (req, res) => {
  const { topic } = req.body;
  if (!topic) {
    return res.status(400).json({ error: "Topic is required" });
  }
  try {
    await updateChatCount(req.params._id);
    const prompt = `Write a detailed, engaging blog post on the topic: "${topic}". Include an introduction, 2-3 subheadings, and a conclusion. Keep it professional but conversational.`;
    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 1000,
    });
    const blogContent = chatCompletion.choices[0].message.content;
    res.json({ blog: blogContent });
  } catch (error) {
    console.error("OpenAI API Error:", error);
    res.status(500).json({ error: "Failed to generate blog" });
  }
});

export const searchRemedy = asyncHandler(async (req, res) => {
  const { topic } = req.body;
  if (!topic) {
    return res.status(400).json({ error: "Topic is required" });
  }
  try {
    await updateChatCount(req.params._id);
    const prompt = `Write a detailed, engaging blog post on the topic: "${topic}". Include an introduction, 2-3 subheadings, and a conclusion. Keep it professional but conversational.`;
    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 1000,
    });
    const blogContent = chatCompletion.choices[0].message.content;
    res.json({ blog: blogContent });
  } catch (error) {
    console.error("OpenAI API Error:", error);
    res.status(500).json({ error: "Failed to generate blog" });
  }
});

export const aiReport = asyncHandler(async (req, res) => {
  const { topic } = req.body;
  if (!topic) {
    return res.status(400).json({ error: "Topic is required" });
  }
  try {
    await updateChatCount(req.params._id);
    const prompt = `Write a detailed, engaging blog post on the topic: "${topic}". Include an introduction, 2-3 subheadings, and a conclusion. Keep it professional but conversational.`;
    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 1000,
    });
    const blogContent = chatCompletion.choices[0].message.content;
    res.json({ blog: blogContent });
  } catch (error) {
    console.error("OpenAI API Error:", error);
    res.status(500).json({ error: "Failed to generate blog" });
  }
});

export const compareData = asyncHandler(async (req, res) => {
  const { topic } = req.body;
  if (!topic) {
    return res.status(400).json({ error: "Topic is required" });
  }
  try {
    await updateChatCount(req.params._id);
    const prompt = `Write a detailed, engaging blog post on the topic: "${topic}". Include an introduction, 2-3 subheadings, and a conclusion. Keep it professional but conversational.`;
    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 1000,
    });
    const blogContent = chatCompletion.choices[0].message.content;
    res.json({ blog: blogContent });
  } catch (error) {
    console.error("OpenAI API Error:", error);
    res.status(500).json({ error: "Failed to generate blog" });
  }
});

export const medicineDetails = asyncHandler(async (req, res) => {
  const { topic } = req.body;
  if (!topic) {
    return res.status(400).json({ error: "Topic is required" });
  }
  try {
    await updateChatCount(req.params._id);
    const prompt = `Write a detailed, engaging blog post on the topic: "${topic}". Include an introduction, 2-3 subheadings, and a conclusion. Keep it professional but conversational.`;
    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 1000,
    });
    const blogContent = chatCompletion.choices[0].message.content;
    res.json({ blog: blogContent });
  } catch (error) {
    console.error("OpenAI API Error:", error);
    res.status(500).json({ error: "Failed to generate blog" });
  }
});
