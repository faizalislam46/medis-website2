import express from "express";
import User from "../models/User.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = express.Router();

router.get("/students", protect, adminOnly, async (req, res) => {
  const students = await User.find({ role: "student" }).select("-password").sort({ createdAt: -1 });
  res.json(students);
});

export default router;
