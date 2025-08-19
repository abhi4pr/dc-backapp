import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    patientname: { type: String, trim: true },
    patientage: { type: String, trim: true },
    patientgender: { type: String, trim: true },
    patientemail: { type: String, trim: true },
    patientphone: { type: String, trim: true },
    patientaddress: { type: String, trim: true },

    height_cm: { type: String, trim: true },
    weight_kg: { type: String, trim: true },
    bmi: { type: String, trim: true },
    pulse: { type: String, trim: true },
    bp_systolic: { type: String, trim: true },
    bp_diastolic: { type: String, trim: true },
    temperature: { type: String, trim: true },

    suicide: { type: String, trim: true },
    addiction: { type: [String], default: [] },
    support: { type: String, trim: true },
    medication: { type: String, trim: true },
    sensitivities: { type: String, trim: true },
    todayconcern: { type: String, trim: true },
    origintrigger: { type: String, trim: true },
    pattern: { type: String, trim: true },
    impact: { type: String, trim: true },

    timeline: { type: [String], default: [] },
    followups: {
      date: { type: String, trim: true },
      remedy: { type: String, trim: true },
      potency: { type: String, trim: true },
      dose: { type: String, trim: true },
      response: { type: String, trim: true },
      notes: { type: String, trim: true },
    },

    constitution: { type: String, trim: true },
    energy: { type: String, trim: true },
    reactivity: { type: String, trim: true },
    physique: { type: String, trim: true },

    miasm: { type: [String], default: [] },
    suppressed_conditions: { type: [String], default: [] },
    acuteOrChronic: { type: String, trim: true, default: "chronic" },
    keynotes: { type: String, trim: true },
    temperament: { type: String, trim: true },
    familyhistory: { type: String, trim: true },
    birthHistory: { type: String, trim: true },
    developmentalHistory: { type: String, trim: true },

    thermal: { type: String, trim: true },
    thirst: { type: String, trim: true },
    appetiteDetails: { type: String, trim: true },
    sweatType: { type: String, trim: true },
    urineDetails: { type: String, trim: true },
    stoolDetails: { type: String, trim: true },

    modalities_position: { type: [String], default: [] },
    modalities_motion: { type: [String], default: [] },
    modalities_pressure: { type: [String], default: [] },
    modalities_food: { type: [String], default: [] },

    weather_aggravation: { type: [String], default: [] },
    time_of_day: { type: [String], default: [] },

    desires: { type: [String], default: [] },
    aversions: { type: [String], default: [] },

    nightmares: { type: String, trim: true },
    mentalsymtoms: { type: String, trim: true },
    delusions: { type: [String], default: [] },
    obsession: { type: [String], default: [] },
    emotionaltrauma: { type: String, trim: true },

    menstrualcycle: { type: String, trim: true },
    flowduration: { type: String, trim: true },
    flowtype: { type: String, trim: true },
    pms: { type: [String], default: [] },

    pathsymptoms: { type: String, trim: true },
    miasanalysis: { type: String, trim: true },
    constassess: { type: String, trim: true },
    therachallenge: { type: String, trim: true },

    image: { type: String, trim: true }, // file url or base64
    user: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);
export default Post;
