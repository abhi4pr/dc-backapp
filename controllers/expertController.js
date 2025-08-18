import asyncHandler from "../utils/asyncHandler.js";
import { openai, updateChatCount } from "../utils/reuseFunctions.js";

// ---------------------- SYSTEM PROMPT ----------------------
const EXPERT_COMPARISON_PROMPT = `You are a professional homeopathic AI assistant 
specialized in comparing different homeopathic masters, their philosophy, clinical approach, 
remedy choices, and prescribing strategies. Maintain accuracy, avoid speculation, 
and always present the comparison in a professional but easy-to-read tone.`;

// ---------------------- MAIN CONTROLLER ----------------------
export const expert = asyncHandler(async (req, res) => {
  const { dr1, dr2, symptoms, userId } = req.body;

  if (!symptoms) {
    return res.status(400).json({ error: "symptoms is required" });
  }

  try {
    const userPrompt = buildExpertPrompt(dr1, dr2, symptoms);

    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        { role: "system", content: EXPERT_COMPARISON_PROMPT },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.3,
      max_tokens: 1500,
    });

    const response = chatCompletion.choices[0].message.content;

    // ✅ Return only raw_text
    res.json({ raw_text: response });

    await updateChatCount(userId);
  } catch (error) {
    console.error("Expert comparison error:", error);
    res.status(500).json({ error: "Failed to generate expert comparison" });
  }
});

// ---------------------- PROMPT BUILDER ----------------------
function buildExpertPrompt(dr1, dr2, symptoms) {
  return `
EXPERT COMPARISON REQUEST:

DOCTOR 1: ${dr1}
DOCTOR 2: ${dr2}
PATIENT SYMPTOMS: "${symptoms}"

Please provide a detailed, clinically relevant comparison including:
- Observational approach
- Remedy analysis & prescribing style
- Potency & repetition tendencies
- Key philosophical/clinical principles
- Strengths and limitations of each approach
- Possible remedy suggestions as per each doctor

Keep it professional yet conversational, and ensure the comparison is useful 
for understanding how each expert might handle the given case.
  `;
}
