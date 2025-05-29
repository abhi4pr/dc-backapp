import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import rateLimit from "express-rate-limit";
import mongoose from "mongoose";
import dotenv from "dotenv";
import errorHandler from "./middleware/errorHandler.js";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js";
import medicineRoutes from "./routes/medicine.js";
import postRoutes from "./routes/post.js";
import postInteractionRoutes from "./routes/postInteraction.js";
import quoteRoutes from "./routes/quote.js";
import journalRoutes from "./routes/journal.js";
import audioRoutes from "./routes/audio.js";
import dailyRoutineRoutes from "./routes/dailyRoutine.js";
import dietRoutes from "./routes/diet.js";
import userDietRoutes from "./routes/userDiet.js";
import userRoutineRoutes from "./routes/userRoutine.js";
import contactRoutes from "./routes/contact.js";
import savingRoutes from "./routes/saving.js";
import selfAssessmentRoutes from "./routes/selfAssessment.js";
import sleepRoutes from "./routes/sleep.js";
import bookRoutes from "./routes/book.js";
import rewardRoutes from "./routes/reward.js";
import moodRoutes from "./routes/mood.js";
import healthProfileRoutes from "./routes/healthProfile.js";
import path from "path";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./swagger/swaggerConfig.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(compression());
app.use(express.json());

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
  })
);

// for image uploading
const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Swagger routes
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/medicines", medicineRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/postinteractions", postInteractionRoutes);
app.use("/api/quotes", quoteRoutes);
app.use("/api/journals", journalRoutes);
app.use("/api/audios", audioRoutes);
app.use("/api/dailyroutine", dailyRoutineRoutes);
app.use("/api/diets", dietRoutes);
app.use("/api/userdiets", userDietRoutes);
app.use("/api/userroutines", userRoutineRoutes);
app.use("/api/contacts", contactRoutes);
app.use("/api/savings", savingRoutes);
app.use("/api/selfassessments", selfAssessmentRoutes);
app.use("/api/sleeps", sleepRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/rewards", rewardRoutes);
app.use("/api/moods", moodRoutes);
app.use("/api/healthprofiles", healthProfileRoutes);

// Error Handler
app.use(errorHandler);

// Global Node process handlers
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
  process.exit(1);
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  process.exit(1);
});

// Start server
const PORT = process.env.PORT || 3000;
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });
