import asyncHandler from "../utils/asyncHandler.js";
import { openai, updateChatCount } from "../utils/reuseFunctions.js";

// ---------------------- SYSTEM PROMPT ----------------------
const MATERIA_SYSTEM_PROMPT = `You are a professional homeopathic AI assistant 
specialized in materia medica. Your role is to retrieve and summarize remedy information 
from classical and modern materia medica sources. 
Focus on accuracy and references. 
Do NOT invent or speculate. 
Keep output structured and concise.`;

// ---------------------- MAIN CONTROLLER ----------------------
export const meteria = asyncHandler(async (req, res) => {
  const { medicine_name, authors, edition, userId } = req.body;

  if (!medicine_name) {
    return res.status(400).json({ error: "medicine_name is required" });
  }

  try {
    const userPrompt = buildMateriaPrompt(medicine_name, authors, edition);

    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        { role: "system", content: MATERIA_SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.1,
      max_tokens: 2000,
    });

    const response = chatCompletion.choices[0].message.content;

    // ✅ Return only raw_text
    res.json({ raw_text: response });

    await updateChatCount(userId);
  } catch (error) {
    console.error("Materia Medica search error:", error);
    res.status(500).json({ error: "Failed to retrieve materia medica" });
  }
});

// ---------------------- PROMPT BUILDER ----------------------
function buildMateriaPrompt(medicine_name, authors, edition) {
  let prompt = `
MATERIA MEDICA REQUEST:

MEDICINE: ${medicine_name}
`;

  if (authors && authors.length > 0) {
    prompt += `AUTHOR FILTER: ${authors.join(", ")}\n`;
  }

  if (edition) {
    prompt += `EDITION FILTER: ${edition}\n`;
  }

  prompt += `
Please provide:
- Remedy introduction and core indications
- Keynotes and guiding symptoms
- Modalities (better/worse)
- Clinical confirmations (if available)
- References to the specified authors/editions
- Concise, structured summary (doctor-focused)
  `;

  return prompt;
}
