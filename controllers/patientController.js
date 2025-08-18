import asyncHandler from "../utils/asyncHandler.js";
import { openai, updateChatCount } from "../utils/reuseFunctions.js";

export const patientdata = asyncHandler(async (req, res) => {
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
