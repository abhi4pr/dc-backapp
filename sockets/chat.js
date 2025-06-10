import Chat from "../models/Chat.js";
import ImageKit from "imagekit";

const imagekit = new ImageKit({
  publicKey: "public_CjgzM0q1BFn6o5gOVSxw3CJFke4=",
  privateKey: "private_EQhKcvatje0axi3xWLpoXL6s2+0=",
  urlEndpoint: "https://ik.imagekit.io/cun839umq",
});

const chatSocket = (io) => {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // Handle user joining - store socket with userId for targeted messaging
    socket.on("join", (userId) => {
      socket.join(userId);
      socket.userId = userId;
      console.log(`User ${userId} joined room`);
    });

    // Send message
    socket.on("send_message", async ({ senderId, receiverId, text, image }) => {
      try {
        let imageUrl = null;

        // If image is base64, upload to ImageKit
        if (image) {
          const uploadRes = await imagekit.upload({
            file: image, // base64 string or buffer
            fileName: `chat_${Date.now()}.jpg`,
            folder: "/chats",
          });
          imageUrl = uploadRes.url;
        }

        const chat = new Chat({
          sender: senderId,
          receiver: receiverId,
          message: text || "",
          image: imageUrl,
        });

        await chat.save();

        // Emit to both sender and receiver
        const messageData = {
          _id: chat._id,
          sender: chat.sender,
          senderId: chat.sender,
          receiver: chat.receiver,
          receiverId: chat.receiver,
          message: chat.message,
          text: chat.message,
          image: chat.image,
          createdAt: chat.createdAt,
        };

        // Send to receiver
        io.to(receiverId).emit("receive_message", messageData);

        // Send to sender (if they're in a different tab/device)
        if (senderId !== receiverId) {
          io.to(senderId).emit("receive_message", messageData);
        }

        console.log(`Message sent from ${senderId} to ${receiverId}`);
      } catch (error) {
        console.error("Send message error:", error);
        socket.emit("message_error", { error: "Failed to send message" });
      }
    });

    // Retrieve messages
    socket.on("get_messages", async ({ userId, otherUserId }) => {
      try {
        const messages = await Chat.find({
          $or: [
            { sender: userId, receiver: otherUserId },
            { sender: otherUserId, receiver: userId },
          ],
        })
          .sort({ createdAt: 1 })
          .lean(); // Use lean() for better performance

        // Normalize message format for frontend
        const normalizedMessages = messages.map((msg) => ({
          _id: msg._id,
          sender: msg.sender,
          senderId: msg.sender,
          receiver: msg.receiver,
          receiverId: msg.receiver,
          message: msg.message,
          text: msg.message,
          image: msg.image,
          createdAt: msg.createdAt,
        }));

        socket.emit("chat_history", normalizedMessages);
        console.log(`Chat history sent for ${userId} and ${otherUserId}`);
      } catch (error) {
        console.error("Get messages error:", error);
        socket.emit("chat_error", { error: "Failed to load messages" });
      }
    });

    // Clear chat
    socket.on("clear_chat", async ({ userId, otherUserId }) => {
      try {
        await Chat.deleteMany({
          $or: [
            { sender: userId, receiver: otherUserId },
            { sender: otherUserId, receiver: userId },
          ],
        });

        // Notify both users that chat was cleared
        io.to(userId).emit("chat_cleared");
        io.to(otherUserId).emit("chat_cleared");

        console.log(`Chat cleared between ${userId} and ${otherUserId}`);
      } catch (error) {
        console.error("Clear chat error:", error);
        socket.emit("clear_error", { error: "Failed to clear chat" });
      }
    });

    // Handle user going offline
    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
      if (socket.userId) {
        socket.leave(socket.userId);
        console.log(`User ${socket.userId} left room`);
      }
    });
  });
};

export default chatSocket;
