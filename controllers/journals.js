const journalModel = require('../models/journalModel');
const { fileUpload } = require('../fileUpload.js');
const variables = require('../variables.js');

exports.addJournal = async (req, res) => {
    try {
        const { user_id, journal_desc, journal_date } = req.body;

        const newJournal = new journalModel({
            user_id,
            journal_desc,
            journal_date: new Date(journal_date)
        });

        await newJournal.save();
        res.status(201).json({ message: "Journal added successfully", journal: newJournal });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
};

exports.getSingleJournal = async (req, res) => {
    try {
        const { userId } = req.params;
        const { date } = req.query;

        const startOfDay = new Date(date);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        const journal = await journalModel.findOne({
            user_id: userId,
            journal_date: {
                $gte: startOfDay,
                $lt: endOfDay
            }
        });

        if (!journal) {
            return res.status(404).json({ message: "Journal not found" });
        }

        res.status(200).json({ message: "Journal retrieved successfully", journal });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
};

exports.updateJournal = async (req, res) => {
    try {
        const { journalId } = req.params;
        const { journal_desc, journal_date } = req.body;

        const updatedJournal = await journalModel.findByIdAndUpdate(
            journalId,
            { journal_desc },
            { new: true }
        );

        if (!updatedJournal) {
            return res.status(404).json({ message: "Journal not found" });
        }

        res.status(200).json({ message: "Journal updated successfully", journal: updatedJournal });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error });
    }
};