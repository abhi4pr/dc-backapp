import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    patientname: {
      type: String,
      required: false,
      trim: true,
    },
    patientage: {
      type: String,
      required: false,
      trim: true,
    },
    patientgender: {
      type: String,
      required: false,
      trim: true,
    },
    patientphone: {
      type: String,
      required: false,
      trim: true,
    },
    patientaddress: {
      type: String,
      required: false,
      trim: true,
    },
    suicide: {
      type: String,
      required: false,
      trim: true,
    },
    addiction: {
      type: String,
      required: false,
      trim: true,
    },
    skincondition: {
      type: String,
      required: false,
      trim: true,
    },
    mentalcondition: {
      type: String,
      required: false,
      trim: true,
    },
    discharge: {
      type: String,
      required: false,
      trim: true,
    },
    vaccine: {
      type: String,
      required: false,
      trim: true,
    },
    spiritual: {
      type: String,
      required: false,
      trim: true,
    },
    support: {
      type: String,
      required: false,
      trim: true,
    },
    medication: {
      type: String,
      required: false,
      trim: true,
    },
    todayconcern: {
      type: String,
      required: false,
      trim: true,
    },
    origintrigger: {
      type: String,
      required: false,
      trim: true,
    },
    pattern: {
      type: String,
      required: false,
      trim: true,
    },
    impact: {
      type: String,
      required: false,
      trim: true,
    },
    thermal: {
      type: String,
      required: false,
      trim: true,
    },
    energy: {
      type: String,
      required: false,
      trim: true,
    },
    reactivity: {
      type: String,
      required: false,
      trim: true,
    },
    physique: {
      type: String,
      required: false,
      trim: true,
    },
    metabolic: {
      type: String,
      required: false,
      trim: true,
    },
    miasmatic: {
      type: String,
      required: false,
      trim: true,
    },
    familyhistory: {
      type: String,
      required: false,
      trim: true,
    },
    nightmares: {
      type: String,
      required: false,
      trim: true,
    },
    sleep: {
      type: String,
      required: false,
      trim: true,
    },
    wakeup: {
      type: String,
      required: false,
      trim: true,
    },
    fear: {
      type: String,
      required: false,
      trim: true,
    },
    delusions: {
      type: String,
      required: false,
      trim: true,
    },
    obsession: {
      type: String,
      required: false,
      trim: true,
    },
    emotionaltrauma: {
      type: String,
      required: false,
      trim: true,
    },
    mentalsymtoms: {
      type: String,
      required: false,
      trim: true,
    },
    morning: {
      type: String,
      required: false,
      trim: true,
    },
    forenoon: {
      type: String,
      required: false,
      trim: true,
    },
    noon: {
      type: String,
      required: false,
      trim: true,
    },
    afternoon: {
      type: String,
      required: false,
      trim: true,
    },
    evening: {
      type: String,
      required: false,
      trim: true,
    },
    night: {
      type: String,
      required: false,
      trim: true,
    },
    beforeMidnight: {
      type: String,
      required: false,
      trim: true,
    },
    afterMidnight: {
      type: String,
      required: false,
      trim: true,
    },
    hotWeather: {
      type: String,
      required: false,
      trim: true,
    },
    coldWeather: {
      type: String,
      required: false,
      trim: true,
    },
    dampWeather: {
      type: String,
      required: false,
      trim: true,
    },
    dryWeather: {
      type: String,
      required: false,
      trim: true,
    },
    windyWeather: {
      type: String,
      required: false,
      trim: true,
    },
    thunderstorms: {
      type: String,
      required: false,
      trim: true,
    },
    menstrualcycle: {
      type: String,
      required: false,
      trim: true,
    },
    flowduration: {
      type: String,
      required: false,
      trim: true,
    },
    flowtype: {
      type: String,
      required: false,
      trim: true,
    },
    pms: {
      type: String,
      required: false,
      trim: true,
    },
    painpattern: {
      type: String,
      required: false,
      trim: true,
    },
    systemreview: {
      type: String,
      required: false,
      trim: true,
    },
    bodytemp: {
      type: String,
      required: false,
      trim: true,
    },
    thirst: {
      type: String,
      required: false,
      trim: true,
    },
    sleeppattern: {
      type: String,
      required: false,
      trim: true,
    },
    sleepenv: {
      type: String,
      required: false,
      trim: true,
    },
    image: {
      type: String,
      required: false,
      trim: true,
    },
    pathsymptoms: {
      type: String,
      required: false,
      trim: true,
    },
    miasanalysis: {
      type: String,
      required: false,
      trim: true,
    },
    constassess: {
      type: String,
      required: false,
      trim: true,
    },
    therachallenge: {
      type: String,
      required: false,
      trim: true,
    },
    user: {
      type: String,
      required: true,
      trim: true,
    },
    answer: {
      type: String,
      required: false,
      trim: true,
    },
  },
  { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);
export default Post;
