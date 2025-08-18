import asyncHandler from "../utils/asyncHandler.js";
import { openai, updateChatCount } from "../utils/reuseFunctions.js";

// ---------------------- SYSTEM PROMPT ----------------------
const LAB_SYSTEM_PROMPT = `You are a medical AI assistant specialized in analyzing lab reports.
You can interpret common blood, urine, imaging, and pathology results. 
Your role is to:
- Summarize the report in clear professional language
- Highlight abnormal findings with clinical relevance
- Explain potential causes in layman-friendly terms (when safe)
- Suggest follow-up tests or consultation if needed
- NEVER provide a final diagnosis, only interpretation and guidance
- Maintain a professional, concise, and reassuring tone`;

// ---------------------- MAIN CONTROLLER ----------------------
export const lab = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  const reportFile = req.file;

  if (!reportFile) {
    return res.status(400).json({ error: "Report file is required" });
  }

  try {
    const userPrompt = buildLabPrompt(req.fileUrl);

    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        { role: "system", content: LAB_SYSTEM_PROMPT },
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
    console.error("Lab report analysis error:", error);
    res.status(500).json({ error: "Failed to analyze lab report" });
  }
});

// ---------------------- PROMPT BUILDER ----------------------
function buildLabPrompt(fileUrl) {
  return `
LAB REPORT ANALYSIS REQUEST:

Report File: ${fileUrl}

Please:
1. Summarize the key findings from the lab report
2. Highlight any abnormal or borderline results
3. Provide possible clinical implications (general, not diagnostic)
4. Suggest next steps (e.g., follow-up tests, doctor consultation)
5. Keep explanation professional, structured, but patient-friendly
  `;
}
