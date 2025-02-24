const mongoose = require('mongoose');

const audioModel = new mongoose.Schema({
    audio_title: {
        type: String,
        required: [true, "Audio title is required"]
    },
    audio_desc: {
        type: String,
        required: false,
    },
    audio_file: {
        type: String,
        required: [false, 'Audio file is not required'],
    },
    audio_seq: {
        type: Number,
        required: [false, "audio sequence is required"],
        min: [1, "Sequence must be at least 1"]
        // default: 1
    }
}, { timestamps: true });

audioModel.pre('save', async function (next) {
    if (!this.audio_seq) {
        const lastAgency = await this.constructor.findOne({}, {}, { sort: { 'audio_seq': -1 } });

        if (lastAgency && lastAgency.audio_seq) {
            this.audio_seq = lastAgency.audio_seq + 1;
        } else {
            this.audio_seq = 1;
        }
    }
    next();
});

module.exports = mongoose.model('audioModel', audioModel);