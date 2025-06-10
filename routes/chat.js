import express from "express";
import { getChats, deleteChat } from "../controllers/chatController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import upload, { fileUpload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.get("/:userId/:otherUserId", authMiddleware, getChats);
router.delete("/:userId/:otherUserId", authMiddleware, deleteChat);

export default router;
