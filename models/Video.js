import mongoose from "mongoose";

const videoSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
            minlength: 1,
        },
        description: {
            type: String,
            trim: true,
        },
        videoFile: {
            type: String,
            required: true,
            trim: true,
        },
        category: {
            type: String,
            enum: ["General", "Music", "Podcast", "Audiobook"],
            trim: true,
            default: "General",
        },
    },
    { timestamps: true }
);

const Video = mongoose.model("Video", videoSchema);

export default Video;
