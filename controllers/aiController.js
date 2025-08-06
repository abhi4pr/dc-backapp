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
    const prompt = `
      Write a summary about patient suffering from, symptoms, medicine names based on these given data: 
      "${topic}". 
      Keep it professional but conversational.`;
    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 1000,
    });
    const blogContent = chatCompletion.choices[0].message.content;
    res.json({ data: blogContent });
  } catch (error) {
    console.error("OpenAI API Error:", error);
    res.status(500).json({ error: "Failed to generate blog" });
  }
});

export const searchRemedy = asyncHandler(async (req, res) => {
  const { disease } = req.body;
  if (!disease) {
    return res.status(400).json({ error: "Topic is required" });
  }
  try {
    await updateChatCount(req.params._id);
    const prompt = `Please search Homeopathic medicine for disease name: "${disease}". Give atleast 2-3 Homeopathic medicines. Keep it professional but conversational.`;
    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 1000,
    });
    const blogContent = chatCompletion.choices[0].message.content;
    res.json({ data: blogContent });
  } catch (error) {
    console.error("OpenAI API Error:", error);
    res.status(500).json({ error: "Failed to generate blog" });
  }
});

export const aiReport = asyncHandler(async (req, res) => {
  const { report } = req.file;
  if (!report) {
    return res.status(400).json({ error: "Report is required" });
  }
  try {
    await updateChatCount(req.params._id);
    const prompt = `Write a summary analysis of given patient report "${report}". Keep it professional but conversational.`;
    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 1000,
    });
    const blogContent = chatCompletion.choices[0].message.content;
    res.json({ data: blogContent });
  } catch (error) {
    console.error("OpenAI API Error:", error);
    res.status(500).json({ error: "Failed to generate blog" });
  }
});

export const compareData = asyncHandler(async (req, res) => {
  const { dr1, dr2, symptoms } = req.body;
  if (!symptoms) {
    return res.status(400).json({ error: "symptoms is required" });
  }
  try {
    await updateChatCount(req.params._id);
    const prompt = `Write a detailed difference between both doctors like observations, medication etc "${dr1} and ${dr2}" based on given patient symptoms "${symptoms}".Keep it professional but conversational.`;
    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 1000,
    });
    const blogContent = chatCompletion.choices[0].message.content;
    res.json({ data: blogContent });
  } catch (error) {
    console.error("OpenAI API Error:", error);
    res.status(500).json({ error: "Failed to generate blog" });
  }
});

export const medicineDetails = asyncHandler(async (req, res) => {
  const { medicine_name } = req.body;
  if (!medicine_name) {
    return res.status(400).json({ error: "medicine name is required" });
  }
  try {
    await updateChatCount(req.params._id);
    const prompt = `Write a detailed, engaging blog on the given medicine name: "${medicine_name}" like contents, who made it, cures etc. Keep it professional but conversational.`;
    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 1000,
    });
    const blogContent = chatCompletion.choices[0].message.content;
    res.json({ data: blogContent });
  } catch (error) {
    console.error("OpenAI API Error:", error);
    res.status(500).json({ error: "Failed to generate blog" });
  }
});
