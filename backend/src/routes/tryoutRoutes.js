import express from "express";
import Tryout from "../models/Tryout.js";
import Question from "../models/Question.js";
import Attempt from "../models/Attempt.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = express.Router();

router.get("/", protect, async (req, res) => {
  try {
    const tryouts = await Tryout.find()
      .populate("questions")
      .sort({ createdAt: -1 });

    res.json(tryouts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/", protect, adminOnly, async (req, res) => {
  try {
    const { title, category, durationMinutes, totalQuestions } = req.body;

    const questions = await Question.find({ category }).limit(Number(totalQuestions));

    if (questions.length === 0) {
      return res.status(400).json({
        message: "Belum ada soal untuk kategori ini"
      });
    }

    const tryout = await Tryout.create({
      title,
      category,
      durationMinutes: Number(durationMinutes),
      totalQuestions: Number(totalQuestions),
      questions: questions.map((q) => q._id),
      createdBy: req.user._id
    });

    res.status(201).json(tryout);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/:id", protect, async (req, res) => {
  try {
    const tryout = await Tryout.findById(req.params.id).populate("questions");

    if (!tryout) {
      return res.status(404).json({ message: "Tryout tidak ditemukan" });
    }

    res.json(tryout);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/:id/submit", protect, async (req, res) => {
  try {
    const { answers } = req.body;

    const tryout = await Tryout.findById(req.params.id).populate("questions");

    if (!tryout) {
      return res.status(404).json({ message: "Tryout tidak ditemukan" });
    }

    let score = 0;

    const checkedAnswers = tryout.questions.map((q) => {
      const selectedAnswer = answers?.[q._id] || "";

      const isCorrect =
        String(selectedAnswer).trim() === String(q.correctAnswer).trim();

      if (isCorrect) score += 1;

      return {
        question: q._id,
        selectedAnswer,
        isCorrect
      };
    });

    const attempt = await Attempt.create({
      student: req.user._id,
      category: tryout.category,
      score,
      totalQuestions: tryout.questions.length,
      answers: checkedAnswers
    });

    const result = await Attempt.findById(attempt._id).populate("answers.question");

    res.status(201).json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete("/:id", protect, adminOnly, async (req, res) => {
  try {
    await Tryout.findByIdAndDelete(req.params.id);
    res.json({ message: "Tryout berhasil dihapus" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;