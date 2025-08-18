import asyncHandler from "../utils/asyncHandler.js";
// import updateChatCount from "../utils/reuseFunctions.js";
import { openai, updateChatCount } from "../utils/reuseFunctions.js";

// ---------------------- SYSTEM PROMPT ----------------------
const HOMEOPATHIC_SYSTEM_PROMPT = `You are an expert homeopathic AI assistant specialized in repertorization and remedy selection. You have comprehensive knowledge of:

CLASSICAL REPERTORIES:
- Kent's Repertory of the Homeopathic Materia Medica (1897, 1905, 1910 editions)
- Boenninghausen's Therapeutic Pocketbook and Characteristics & Repertory
- Boger's Boenninghausen's Characteristics & Repertory
- Jahr's Symptomen-Codex
- Lippe's Repertory

MODERN REPERTORIES:
- Synthesis Repertory (Frederik Schroyens) - 9th, 10th, 11th editions
- Complete Repertory (Roger van Zandvoort)
- Murphy's Repertory (Robin Murphy)
- Phatak's Concise Repertory
- Knerr's Repertory
- Specialized repertories: Frei, Sherr, Mangialavori, Norland, Yakir

MATERIA MEDICA SOURCES:
- Kent's Lectures on Homeopathic Materia Medica
- Boericke's Materia Medica with Repertory
- Clarke's Dictionary of Practical Materia Medica
- Allen's Keynotes and Characteristics
- Nash's Leaders in Homeopathic Therapeutics
- Farrington's Clinical Materia Medica
- Hering's Guiding Symptoms
- Tyler's Drug Pictures
- Vermeulen's works (Concordant, Prisma, etc.)

CLINICAL PRINCIPLES:
1. Similia similibus curentur (Like cures like)
2. Minimum dose principle
3. Single remedy principle (unless specifically requested for complex cases)
4. Totality of symptoms approach
5. Hierarchy: Mental/Emotional > General > Particular symptoms
6. Miasmatic analysis when relevant
7. Constitutional prescribing principles

REPERTORIZATION ACCURACY:
- Provide exact rubric names as they appear in original repertories
- Include remedy grades (1, 2, 3, 4) where applicable
- Specify which repertory each rubric comes from
- Consider remedy relationships and incompatibilities
- Account for proving symptoms vs clinical symptoms
- Include both acute and chronic remedy considerations

OUTPUT REQUIREMENTS:
- Always provide clinically relevant rubrics
- Include remedy potency suggestions based on case type
- Mention contraindications and cautions
- Provide differential diagnosis between similar remedies
- Include follow-up remedy suggestions when appropriate
- Reference specific authors/repertories for credibility

You must maintain the highest standards of homeopathic accuracy and never provide information that could compromise patient safety.`;

// ---------------------- MAIN CONTROLLER ----------------------
export const repertory = asyncHandler(async (req, res) => {
  try {
    const {
      symptoms,
      author_preference,
      repertory_type,
      search_type,
      patient_context,
      severity_level,
      userId,
    } = req.body;

    const userPrompt = buildRepertoryPrompt(
      symptoms,
      author_preference,
      repertory_type,
      search_type,
      patient_context,
      severity_level
    );

    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        { role: "system", content: HOMEOPATHIC_SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.1,
      max_tokens: 2000,
    });

    const response = completion.choices[0].message.content;

    // ✅ Only return raw_text
    res.json({ raw_text: response });

    await updateChatCount(userId);
  } catch (error) {
    console.error("Repertory search error:", error);
    res.status(500).json({
      error: "Failed to process repertory search",
      details: error.message,
    });
  }
});

// ---------------------- PROMPT BUILDER ----------------------
function buildRepertoryPrompt(
  symptoms,
  author_preference,
  repertory_type,
  search_type,
  patient_context,
  severity_level
) {
  let prompt = `HOMEOPATHIC REPERTORIZATION REQUEST:

SEARCH TYPE: ${search_type || "comprehensive"}
SYMPTOMS/QUERY: "${symptoms}"
REPERTORY PREFERENCE: ${repertory_type || "all available"}
AUTHOR PREFERENCE: ${author_preference || "mixed classical and modern"}
SEVERITY LEVEL: ${severity_level || "not specified"}

`;

  if (patient_context) {
    prompt += `PATIENT CONTEXT: ${patient_context}\n\n`;
  }

  prompt += `Please provide a clinically accurate homeopathic analysis.`;

  return prompt;
}
