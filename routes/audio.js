import express from "express";
import {
  addAudio,
  getAllAudios,
  getAudioById,
  updateAudio,
  deleteAudio,
} from "../controllers/audioController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import upload, { fileUpload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, upload.single("audioFile"), fileUpload, addAudio);
router.get("/", authMiddleware, getAllAudios);
router.get("/:id", authMiddleware, getAudioById);
router.put("/:id", authMiddleware, upload.single("audioFile"), fileUpload, updateAudio);
router.delete("/:id", authMiddleware, deleteAudio);

export default router;
