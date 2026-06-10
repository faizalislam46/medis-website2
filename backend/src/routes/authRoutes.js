import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

const generateToken = (id) =>
  jwt.sign(
    { id },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d"
    }
  );

router.post("/register", async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      school,
      mainSubject
    } = req.body;

    const existing = await User.findOne({
      email
    });

    if (existing) {
      return res.status(400).json({
        message: "Email sudah digunakan"
      });
    }

    const hashed = await bcrypt.hash(
      password,
      10
    );

    const user = await User.create({
      name,
      email,
      password: hashed,
      school,
      mainSubject,
      role: "student"
    });

    res.status(201).json({
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        mainSubject: user.mainSubject
      }
    });
  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const {
      email,
      password
    } = req.body;

    const user = await User.findOne({
      email
    });

    if (!user) {
      return res.status(401).json({
        message: "Email atau password salah"
      });
    }

    const match =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!match) {
      return res.status(401).json({
        message: "Email atau password salah"
      });
    }

    res.json({
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        mainSubject: user.mainSubject
      }
    });
  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
});

router.get("/me", protect, async (req, res) => {
  res.json(req.user);
});

export default router;