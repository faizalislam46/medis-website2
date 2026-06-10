import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

import authRoutes from "./src/routes/authRoutes.js";
import questionRoutes from "./src/routes/questionRoutes.js";
import attemptRoutes from "./src/routes/attemptRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";
import tryoutRoutes from "./src/routes/tryoutRoutes.js";
import resultRoutes from "./src/routes/resultRoutes.js";
import chapterRoutes from "./src/routes/chapterRoutes.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://medis-website2.vercel.app"
    ],
    credentials: true
  })
);

app.use(express.json());

let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;

  await mongoose.connect(process.env.MONGO_URI);
  isConnected = true;
  console.log("MongoDB connected");
};

app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    res.status(500).json({
      message: "MongoDB connection failed",
      error: err.message
    });
  }
});

app.get("/", (req, res) => {
  res.json({
    message: "MEDIS API is running"
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/attempts", attemptRoutes);
app.use("/api/users", userRoutes);
app.use("/api/tryouts", tryoutRoutes);
app.use("/api/results", resultRoutes);
app.use("/api/chapters", chapterRoutes);

if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;

  app.listen(PORT, () =>
    console.log(`Server running on port ${PORT}`)
  );
}

export default app;