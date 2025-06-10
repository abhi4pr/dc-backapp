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

    // Receive message
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

        io.to(receiverId).emit("receive_message", chat);
      } catch (error) {
        console.error("Send message error:", error);
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
        }).sort({ createdAt: 1 });

        socket.emit("chat_history", messages);
      } catch (error) {
        console.error("Get messages error:", error);
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

        socket.emit("chat_cleared");
      } catch (error) {
        console.error("Clear chat error:", error);
      }
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
};

export default chatSocket;
