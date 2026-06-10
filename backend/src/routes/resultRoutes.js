import express from "express";
import Result from "../models/Result.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

const formatLeaderboard = (results) => {
  return results
    .map((result) => {
      const percentage =
        result.totalQuestions > 0
          ? Math.round((result.score / result.totalQuestions) * 100)
          : 0;

      return {
        _id: result._id,
        name:
          result.studentName ||
          result.userId?.name ||
          result.studentEmail ||
          result.userId?.email ||
          "Siswa",
        email:
          result.studentEmail ||
          result.userId?.email ||
          "-",
        school: result.userId?.school || "-",
        tryoutTitle: result.tryoutTitle,
        category: result.category,
        score: result.score,
        totalQuestions: result.totalQuestions,
        percentage,
        createdAt: result.createdAt
      };
    })
    .sort((a, b) => {
      if (b.percentage !== a.percentage) {
        return b.percentage - a.percentage;
      }

      return new Date(a.createdAt) - new Date(b.createdAt);
    })
    .map((item, index) => ({
      ...item,
      rank: index + 1
    }));
};

router.post("/", protect, async (req, res) => {
  try {
    const result = await Result.create({
      ...req.body,
      userId: req.user.id,
      studentName: req.user.name || "",
      studentEmail: req.user.email || ""
    });

    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
});

router.get("/my", protect, async (req, res) => {
  try {
    const results = await Result.find({
      userId: req.user.id
    }).sort({
      createdAt: -1
    });

    res.json(results);
  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
});

router.get("/leaderboard", protect, async (req, res) => {
  try {
    const filter = {};

    if (req.query.category) {
      filter.category = req.query.category;
    }

    if (req.query.tryoutTitle) {
      filter.tryoutTitle = req.query.tryoutTitle;
    }

    const results = await Result.find(filter)
      .populate("userId", "name email school")
      .sort({
        createdAt: -1
      });

    res.json(formatLeaderboard(results));
  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
});

router.get("/", protect, async (req, res) => {
  try {
    const results = await Result.find()
      .populate("userId", "name email school")
      .sort({
        createdAt: -1
      });

    res.json(results);
  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
});

export default router;