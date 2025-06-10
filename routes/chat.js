import express from "express";
import {
  sendMessage,
  getMessages,
  clearChat,
} from "../controllers/chatController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/messages", authMiddleware, sendMessage);
router.get("/messages", authMiddleware, getMessages);
router.delete("/messages", authMiddleware, clearChat);

export default router;
