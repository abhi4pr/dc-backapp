const mongoose = require("mongoose");

const journeyCPsModel = new mongoose.Schema({
    cp_title: {
        type: String,
        required: [true, 'checkpoint name is required']
    },
    cp_des: {
        type: String,
        required: [false, 'description is not required'],
        default: ''
    },
    cp_video: {
        type: String,
        required: [true, 'checkpoint video is required']
    },
    tasks: [{ type: String }],
    position: { x: Number, y: Number },
    cp_order: {
        type: Number,
        required: true,
        unique: true
    }
});

journeyCPsModel.pre('save', async function (next) {
    if (!this.cp_order) {
        const lastAgency = await this.constructor.findOne({}, {}, { sort: { 'cp_order': -1 } });

        if (lastAgency && lastAgency.cp_order) {
            this.cp_order = lastAgency.cp_order + 1;
        } else {
            this.cp_order = 1;
        }
    }
    next();
});

module.exports = mongoose.model("journeyCPsModel", journeyCPsModel);