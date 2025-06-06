import express from "express";
import {
    addVideo,
    getAllVideos,
    getVideoById,
    updateVideo,
    deleteVideo,
} from "../controllers/videoController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import upload, { fileUpload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, upload.single("videoFile"), fileUpload, addVideo);
router.get("/", authMiddleware, getAllVideos);
router.get("/:id", authMiddleware, getVideoById);
router.put("/:id", authMiddleware, upload.single("videoFile"), fileUpload, updateVideo);
router.delete("/:id", authMiddleware, deleteVideo);

export default router;
