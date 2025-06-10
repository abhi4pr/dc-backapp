import Chat from "../models/Chat.js";
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";
import ImageKit from "imagekit";

const imagekit = new ImageKit({
  publicKey: "public_CjgzM0q1BFn6o5gOVSxw3CJFke4=",
  privateKey: "private_EQhKcvatje0axi3xWLpoXL6s2+0=",
  urlEndpoint: "https://ik.imagekit.io/cun839umq",
});
// Send a message
export const sendMessage = async (req, res) => {
  const { sender, receiver, message, image } = req.body;

  try {
    let imageUrl = null;

    if (image) {
      const uploadRes = await imagekit.upload({
        file: image,
        fileName: `chat_${Date.now()}.jpg`,
        folder: "/chats",
      });
      imageUrl = uploadRes.url;
    }

    const chat = new Chat({
      sender: sender,
      receiver: receiver,
      message: message || "",
      image: imageUrl || "",
    });

    await chat.save();

    const messageData = {
      _id: chat._id,
      sender: chat.sender,
      receiver: chat.receiver,
      message: chat.message,
      image: chat.image,
      createdAt: chat.createdAt,
    };

    // Send to receiver using socket
    const io = req.app.get("io");
    io.to(receiver).emit("receive_message", messageData);

    res.status(201).json(messageData);
  } catch (error) {
    console.error("Send message error:", error);
    res.status(500).json({ error: "Failed to send message" });
  }
};

// Get chat history between 2 users
export const getMessages = async (req, res) => {
  const { userId, otherUserId } = req.query;

  try {
    const messages = await Chat.find({
      $or: [
        { sender: userId, receiver: otherUserId },
        { sender: otherUserId, receiver: userId },
      ],
    }).sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    console.error("Get messages error:", error);
    res.status(500).json({ error: "Failed to load messages" });
  }
};

// Clear chat between two users
export const clearChat = async (req, res) => {
  const { userId, otherUserId } = req.query;

  try {
    await Chat.deleteMany({
      $or: [
        { sender: userId, receiver: otherUserId },
        { sender: otherUserId, receiver: userId },
      ],
    });

    res.status(200).json({ message: "Chat cleared successfully" });
  } catch (error) {
    console.error("Clear chat error:", error);
    res.status(500).json({ error: "Failed to clear chat" });
  }
};
