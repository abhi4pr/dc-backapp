import asyncHandler from "../utils/asyncHandler.js";
import { openai, updateChatCount } from "../utils/reuseFunctions.js";

export const patientdata = asyncHandler(async (req, res) => {
  // const { topic } = req.body;

  try {
    const prompt = `
      You are a professional homeopathic doctor. Based on the following patient case data, 
      write a detailed, professional, but conversational case summary. The summary should 
      highlight patient identity, constitution, history, physical/mental state, modalities, 
      and homeopathic relevance. Use clear medical but patient-friendly language.

      Patient details:
      - Name: ${req.body.patientname}, Age: ${req.body.patientage}, Gender: ${req.body.patientgender}, Email: ${req.body.patientemail}, Phone: ${req.body.patientphone}, Address: ${req.body.patientaddress}.
      - Height: ${req.body.height_cm} cm, Weight: ${req.body.weight_kg} kg, BMI: ${req.body.bmi}.
      - Vitals: Pulse: ${req.body.pulse}, Blood Pressure: ${req.body.bp_systolic}/${req.body.bp_diastolic}, Temperature: ${req.body.temperature}.

      Clinical history:
      - Suicide tendency: ${req.body.suicide}, Addiction: ${req.body.addiction}, Support system: ${req.body.support}, Current medication: ${req.body.medication}, Sensitivities: ${req.body.sensitivities}.
      - Presenting complaint / Today’s concern: ${req.body.todayconcern}, Origin/trigger: ${req.body.origintrigger}, Pattern: ${req.body.pattern}, Impact: ${req.body.impact}.
      - Timeline of illness: ${req.body.timeline}, Follow-ups: ${req.body.followups}.
      - Acute/Chronic condition: ${req.body.acuteOrChronic}, Suppressed conditions: ${req.body.suppressed_conditions}, Keynotes: ${req.body.keynotes}.
      - Family history: ${req.body.familyhistory}, Birth history: ${req.body.birthHistory}, Developmental history: ${req.body.developmentalHistory}.

      Constitution & temperament:
      - Constitution: ${req.body.constitution}, Temperament: ${req.body.temperament}, Energy: ${req.body.energy}, Reactivity: ${req.body.reactivity}, Physique: ${req.body.physique}.
      - Miasmatic background: ${req.body.miasm}, Miasmatic analysis: ${req.body.miasanalysis}, Constitutional assessment: ${req.body.constassess}, Therapeutic challenges: ${req.body.therachallenge}.

      General symptoms:
      - Thermal state: ${req.body.thermal}, Thirst: ${req.body.thirst}, Appetite: ${req.body.appetiteDetails}, Sweat: ${req.body.sweatType}, Urine: ${req.body.urineDetails}, Stool: ${req.body.stoolDetails}.
      - Sleep: ${req.body.sleeppattern}, Sleep environment: ${req.body.sleepenv}, Nightmares: ${req.body.nightmares}.
      - Desires: ${req.body.desires}, Aversions: ${req.body.aversions}.
      - Mental symptoms: ${req.body.mentalsymtoms}, Delusions: ${req.body.delusions}, Obsessions: ${req.body.obsession}, Emotional trauma: ${req.body.emotionaltrauma}.

      Modalities (factors that improve/worsen):
      - Position: ${req.body.modalities_position}, Motion: ${req.body.modalities_motion}, Pressure: ${req.body.modalities_pressure}, Food-related: ${req.body.modalities_food}.
      - Time aggravation: ${req.body.time_of_day}, Weather aggravation: ${req.body.weather_aggravation}.

      Women’s health:
      - Menstrual cycle: ${req.body.menstrualcycle}, Flow duration: ${req.body.flowduration}, Flow type: ${req.body.flowtype}, PMS: ${req.body.pms}, Pain pattern: ${req.body.painpattern}.

      System review:
      - Pathological symptoms: ${req.body.pathsymptoms}, System review: ${req.body.systemreview}, Body temperature: ${req.body.bodytemp}.

      Other notes:
      - Image (if any): ${req.body.image}, Spiritual aspects: ${req.body.spiritual}.

      Write the summary in the style of a homeopathic case-taking report, 
      bringing out important guiding symptoms, constitutional clues, and 
      possible remedy directions (without prescribing explicitly).
      `;

    const chatCompletion = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.2,
      max_tokens: 1500,
    });
    const response = chatCompletion.choices[0].message.content;

    // ✅ Return only raw_text
    res.json({ raw_text: response });
    await updateChatCount(req.body.userId);
  } catch (error) {
    console.error("Medicine suggestion error:", error);
    res.status(500).json({ error: "Failed to generate suggestion" });
  }
});
