const moodModel = require('../models/moodModel');
const { fileUpload } = require('../fileUpload.js');
const variables = require('../variables.js');

exports.addMood = async (req, res) => {
    try {
        const { user_id, mood, mood_date } = req.body;

        const newMood = new moodModel({
            user_id,
            mood,
            mood_date: new Date(mood_date)
        });

        await newMood.save();
        res.status(201).json({ message: "Mood added successfully", mood: newMood });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
};

exports.getSingleMood = async (req, res) => {
    try {
        const { userId } = req.params;
        const { date } = req.query;

        const startOfDay = new Date(date);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        const mood = await moodModel.findOne({
            user_id: userId,
            mood_date: {
                $gte: startOfDay,
                $lt: endOfDay
            }
        });

        if (!mood) {
            return res.status(404).json({ message: "Mood not found" });
        }

        res.status(200).json({ message: "Mood retrieved successfully", mood });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
};

exports.getUserMoodsByMonth = async (req, res) => {
    try {
        const { userId } = req.params;
        const { year, month } = req.query;

        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0);

        const moods = await moodModel.find({
            user_id: userId,
            mood_date: { $gte: startDate, $lte: endDate }
        }).sort({ mood_date: -1 });

        if (!moods.length) {
            return res.status(404).json({ message: "No moods found for this month" });
        }

        res.status(200).json({ message: "Moods retrieved successfully", moods });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
};
