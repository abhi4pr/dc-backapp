import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import upload, { fileUpload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

// Upload single media (image/audio/video)
router.post(
  "/media",
  authMiddleware,
  upload.single("file"),
  fileUpload,
  (req, res) => {
    if (!req.fileUrl) {
      return res.status(400).json({ error: "File upload failed" });
    }
    res.status(200).json({ url: req.fileUrl });
  }
);

export default router;
