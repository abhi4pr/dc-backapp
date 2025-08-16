import asyncHandler from "../utils/asyncHandler.js";
import OpenAI from "openai";
import User from "../models/User.js";

const openai = new OpenAI({
  apiKey:
    process.env.OPENAI_API_KEY ||
    "",
});

const updateChatCount = async (userId) => {
  if (!userId) throw new Error("User ID is required to update chat limit");

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    { $dec: { hit_count: 1 } },
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
      "Patient name is ${patientname}, age is ${patientage}, gender is ${patientgender}, phone is ${patientphone}, address is ${patientaddress}. 
      Suicide tendency: ${suicide}, addiction: ${addiction}, skin condition: ${skincondition}, mental condition: ${mentalcondition}, discharge: ${discharge}, vaccine: ${vaccine}, spiritual: ${spiritual}, support: ${support}, medication: ${medication}.
      Today's concern: ${todayconcern}, origin trigger: ${origintrigger}, pattern: ${pattern}, impact: ${impact}, thermal: ${thermal}, energy: ${energy}, reactivity: ${reactivity}, physique: ${physique}, metabolic: ${metabolic}, miasmatic: ${miasmatic}, family history: ${familyhistory}.
      Nightmares: ${nightmares}, sleep: ${sleep}, wakeup: ${wakeup}, fear: ${fear}, delusions: ${delusions}, obsession: ${obsession}, emotional trauma: ${emotionaltrauma}, mental symptoms: ${mentalsymtoms}.
      Time-based symptoms — morning: ${morning}, forenoon: ${forenoon}, noon: ${noon}, afternoon: ${afternoon}, evening: ${evening}, night: ${night}, before midnight: ${beforeMidnight}, after midnight: ${afterMidnight}.
      Weather-based symptoms — hot: ${hotWeather}, cold: ${coldWeather}, damp: ${dampWeather}, dry: ${dryWeather}, windy: ${windyWeather}, thunderstorms: ${thunderstorms}.
      Menstrual cycle: ${menstrualcycle}, flow duration: ${flowduration}, flow type: ${flowtype}, PMS: ${pms}, pain pattern: ${painpattern}.
      System review: ${systemreview}, body temperature: ${bodytemp}, thirst: ${thirst}, sleep pattern: ${sleeppattern}, sleep environment: ${sleepenv}.
      Image: ${req.fileUrl}, path symptoms: ${pathsymptoms}, miasmatic analysis: ${miasanalysis}, constitutional assessment: ${constassess}, therapeutic challenge: ${therachallenge}.". 
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

// this is for repertory code start

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

export const repertory = asyncHandler(async (req, res) => {
  const { disease } = req.body;
  try {
    const {
      symptoms,
      author_preference,
      repertory_type,
      search_type,
      patient_context,
      severity_level,
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
      model: "gpt-4-turbo-preview", // Use the most capable model
      messages: [
        { role: "system", content: HOMEOPATHIC_SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.1, // Low temperature for accuracy
      max_tokens: 2000,
      presence_penalty: 0,
      frequency_penalty: 0,
    });

    const response = completion.choices[0].message.content;
    const structuredResponse = parseHomeopathicResponse(response);

    res.json({
      success: true,
      data: structuredResponse,
      raw_response: response,
      query_details: {
        symptoms,
        author_preference,
        repertory_type,
        search_type,
      },
    });
    await updateChatCount(req.body.userId);
  } catch (error) {
    console.error("Repertory search error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to process repertory search",
      details: error.message,
    });
  }
});

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
    prompt += `PATIENT CONTEXT: ${patient_context}

`;
  }

  prompt += `Please provide a clinically accurate homeopathic analysis including:

1. RELEVANT RUBRICS:
   - List exact rubric names from appropriate repertories
   - Include remedy grades (1-4 where applicable)
   - Specify source repertory for each rubric
   - Cover Mental/Emotional, General, and Particular symptoms

2. TOP REMEDY MATCHES:
   - List 8-12 most indicated remedies
   - Provide brief differential diagnosis
   - Include potency recommendations
   - Note any contraindications

3. CLINICAL REASONING:
   - Explain why these remedies fit the symptom picture
   - Discuss miasmatic considerations if relevant
   - Suggest follow-up remedies if appropriate

4. REPERTORY SOURCES:
   - Specify which repertories were referenced
   - Include page numbers when relevant
   - Note any discrepancies between sources

5. PRESCRIBING NOTES:
   - Dosage and potency guidance
   - Administration frequency
   - What to observe for improvement
   - When to repeat or change remedy

Format your response as structured JSON with the following schema:
{
  "rubrics": [
    {
      "rubric_name": "exact rubric text",
      "repertory_source": "Kent/Synthesis/Complete/etc",
      "category": "mind/generalities/particulars",
      "remedies": [
        {
          "remedy": "remedy name", 
          "grade": "1-4",
          "notes": "specific indications"
        }
      ]
    }
  ],
  "top_remedies": [
    {
      "remedy": "remedy name",
      "match_score": "percentage",
      "key_symptoms": ["symptom1", "symptom2"],
      "potency_recommendation": "potency and frequency",
      "contraindications": ["if any"],
      "differential_points": "vs similar remedies"
    }
  ],
  "clinical_analysis": {
    "miasmatic_analysis": "if applicable",
    "constitutional_type": "if determinable",
    "acute_vs_chronic": "indication",
    "follow_up_remedies": ["remedy names"]
  },
  "sources_referenced": ["list of repertories/authors used"],
  "prescribing_guidance": {
    "first_prescription": "detailed guidance",
    "observation_points": ["what to monitor"],
    "follow_up_timing": "when to reassess"
  }
}

Ensure all information is clinically accurate and follows established homeopathic principles.`;

  return prompt;
}

// Parse AI response into structured format
function parseHomeopathicResponse(aiResponse) {
  try {
    // First try to parse as JSON if it's already structured
    if (aiResponse.includes('{"rubrics"') || aiResponse.includes('"rubrics"')) {
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    }

    // If not JSON, parse the text response into structured format
    const structured = {
      rubrics: extractRubrics(aiResponse),
      top_remedies: extractRemedies(aiResponse),
      clinical_analysis: extractClinicalAnalysis(aiResponse),
      sources_referenced: extractSources(aiResponse),
      prescribing_guidance: extractPrescribingGuidance(aiResponse),
      raw_text: aiResponse,
    };

    return structured;
  } catch (error) {
    console.error("Error parsing homeopathic response:", error);
    return {
      error: "Failed to parse response",
      raw_text: aiResponse,
    };
  }
}

// Helper functions to extract structured data from text response
function extractRubrics(text) {
  const rubrics = [];
  const rubricPattern = /(?:RUBRIC|Rubric):\s*(.+?)(?:\n|Remedies:|REMEDY)/gi;
  let match;

  while ((match = rubricPattern.exec(text)) !== null) {
    rubrics.push({
      rubric_name: match[1].trim(),
      category: determineCategory(match[1]),
      remedies: extractRemediesFromText(text, match.index),
    });
  }

  return rubrics;
}

function extractRemedies(text) {
  const remedies = [];
  const remedyPattern = /(?:^|\n)\d+\.\s*([A-Z][a-z-]+(?:\s[a-z]+)*)/gm;
  let match;

  while ((match = remedyPattern.exec(text)) !== null) {
    remedies.push({
      remedy: match[1].trim(),
      match_score: extractMatchScore(text, match[1]),
      key_symptoms: extractKeySymptoms(text, match[1]),
      potency_recommendation: extractPotencyRec(text, match[1]),
    });
  }

  return remedies.slice(0, 12); // Top 12 remedies
}

function extractClinicalAnalysis(text) {
  return {
    miasmatic_analysis: extractSection(text, /miasmatic|miasm/i),
    constitutional_type: extractSection(text, /constitutional|constitution/i),
    acute_vs_chronic: extractSection(text, /acute|chronic/i),
  };
}

function extractSources(text) {
  const sources = [];
  const sourcePattern =
    /(Kent|Synthesis|Complete|Murphy|Boericke|Boenninghausen|Clarke|Allen)/gi;
  let match;

  while ((match = sourcePattern.exec(text)) !== null) {
    if (!sources.includes(match[1])) {
      sources.push(match[1]);
    }
  }

  return sources;
}

function extractPrescribingGuidance(text) {
  return {
    first_prescription: extractSection(text, /prescription|prescrib/i),
    observation_points: extractSection(text, /observe|monitor|watch/i),
    follow_up_timing: extractSection(text, /follow.?up|repeat/i),
  };
}

// Utility functions
function determineCategory(rubricText) {
  if (/mind|mental|emotion|mood|anger|fear|anxiety/i.test(rubricText))
    return "mind";
  if (/general|temperature|weather|time|modalities/i.test(rubricText))
    return "generalities";
  return "particulars";
}

function extractRemediesFromText(text, startIndex) {
  // Extract remedies mentioned near the rubric
  const nearText = text.substring(startIndex, startIndex + 200);
  const remedyPattern = /([A-Z][a-z]+(?:\s[a-z]+)*)\s*[(\[]?([1-4])[)\]]?/g;
  const remedies = [];
  let match;

  while ((match = remedyPattern.exec(nearText)) !== null) {
    remedies.push({
      remedy: match[1],
      grade: match[2] || "1",
    });
  }

  return remedies;
}

function extractMatchScore(text, remedy) {
  const scorePattern = new RegExp(`${remedy}.*?([0-9]+)%`, "i");
  const match = text.match(scorePattern);
  return match ? match[1] + "%" : "Not specified";
}

function extractKeySymptoms(text, remedy) {
  // Extract key symptoms mentioned for this remedy
  const remedyIndex = text.toLowerCase().indexOf(remedy.toLowerCase());
  if (remedyIndex === -1) return [];

  const remedySection = text.substring(remedyIndex, remedyIndex + 300);
  const symptoms = [];

  // Common homeopathic symptom patterns
  const symptomPatterns = [
    /anxiety/i,
    /fear/i,
    /restless/i,
    /irritab/i,
    /headache/i,
    /nausea/i,
    /vertigo/i,
    /weakness/i,
    /worse.*?(?:cold|heat|motion|rest)/i,
    /better.*?(?:cold|heat|motion|rest)/i,
  ];

  symptomPatterns.forEach((pattern) => {
    if (pattern.test(remedySection)) {
      symptoms.push(pattern.source.replace(/[/\\^$*+?.()|[\]{}]/g, ""));
    }
  });

  return symptoms;
}

function extractPotencyRec(text, remedy) {
  const potencyPattern = new RegExp(
    `${remedy}.*?(\\d+C|\\d+X|LM\\d+|CM|MM)`,
    "i"
  );
  const match = text.match(potencyPattern);
  return match ? match[1] : "30C";
}

function extractSection(text, pattern) {
  const match = text.match(
    new RegExp(`${pattern.source}.*?(?:\n\n|\n[A-Z]|$)`, "i")
  );
  return match ? match[0].trim() : "";
}

// repertory code ends here

export const aiReport = asyncHandler(async (req, res) => {
  const { report } = req.file;
  if (!report) {
    return res.status(400).json({ error: "Report is required" });
  }
  try {
    await updateChatCount(req.params._id);
    const prompt = `Write a summary analysis of given patient report "${req.fileUrl}". Keep it professional but conversational.`;
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
    const prompt = `
    Write a detailed difference between both doctors like observations, medication etc "${dr1} and ${dr2}" based
     on given patient symptoms "${symptoms}".Keep it professional but conversational.
    `;
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
