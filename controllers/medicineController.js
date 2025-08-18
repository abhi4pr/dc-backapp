import asyncHandler from "../utils/asyncHandler.js";
import { openai, updateChatCount } from "../utils/reuseFunctions.js";

// ---------------------- SYSTEM PROMPT ----------------------
const MEDICINE_SYSTEM_PROMPT = `You are a professional homeopathic AI assistant. 
Your role is to provide concise, clinically accurate suggestions for doctors.
Focus on:
- Key remedies with indications
- Differential remedies when applicable
- Potency & repetition guidelines
- Authoritative references (Kent, Boericke, Clarke, Allen, Nash, etc.)
- Keep answers clear, structured, and professional
- Avoid speculation or unsafe medical advice
`;

// ---------------------- MAIN CONTROLLER ----------------------
export const medicine = asyncHandler(async (req, res) => {
  const { medicine_name, symptoms, userId } = req.body;

  if (!medicine_name && !symptoms) {
    return res
      .status(400)
      .json({ error: "Either medicine_name or symptoms is required" });
  }

  try {
    const userPrompt = buildMedicinePrompt(medicine_name, symptoms);

    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        { role: "system", content: MEDICINE_SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.2,
      max_tokens: 1500,
    });

    const response = chatCompletion.choices[0].message.content;

    // ✅ Return only raw_text
    res.json({ raw_text: response });

    await updateChatCount(userId);
  } catch (error) {
    console.error("Medicine suggestion error:", error);
    res.status(500).json({ error: "Failed to generate suggestion" });
  }
});

// ---------------------- PROMPT BUILDER ----------------------
function buildMedicinePrompt(medicine_name, symptoms) {
  if (medicine_name) {
    return `
HOMEOPATHIC MEDICINE ANALYSIS REQUEST:

MEDICINE: ${medicine_name}

Please provide:
- Remedy origin & core indications
- Key keynote symptoms
- Modalities (better/worse)
- Potency and dosage guidelines
- References from classical materia medica
- Related/differential remedies
`;
  }

  if (symptoms) {
    return `
HOMEOPATHIC REMEDY SUGGESTION REQUEST:

SYMPTOMS/CLINICAL QUERY: "${symptoms}"

Please provide:
- Top remedy suggestions with rationale
- Key rubrics or materia medica references
- Differential remedies
- Potency guidance (if appropriate)
- Concise, clinically relevant explanation
`;
  }
}
