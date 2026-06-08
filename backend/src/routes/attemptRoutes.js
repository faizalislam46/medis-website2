import express from "express";
import Attempt from "../models/Attempt.js";
import Question from "../models/Question.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = express.Router();

router.post("/", protect, async (req, res) => {
  const { category, answers } = req.body;

  const questionIds = answers.map((a) => a.question);
  const questions = await Question.find({ _id: { $in: questionIds } });

  const checkedAnswers = answers.map((answer) => {
    const q = questions.find((item) => item._id.toString() === answer.question);
    const isCorrect = q?.correctAnswer === answer.selectedAnswer;
    return {
      question: answer.question,
      selectedAnswer: answer.selectedAnswer,
      isCorrect
    };
  });

  const score = checkedAnswers.filter((a) => a.isCorrect).length;

  const attempt = await Attempt.create({
    student: req.user._id,
    category,
    score,
    totalQuestions: answers.length,
    answers: checkedAnswers
  });

  const populated = await Attempt.findById(attempt._id)
    .populate("answers.question")
    .populate("student", "name email");

  res.status(201).json(populated);
});

router.get("/my", protect, async (req, res) => {
  const attempts = await Attempt.find({ student: req.user._id })
    .sort({ createdAt: -1 })
    .populate("answers.question");
  res.json(attempts);
});

router.get("/all", protect, adminOnly, async (req, res) => {
  const attempts = await Attempt.find()
    .sort({ createdAt: -1 })
    .populate("student", "name email school")
    .populate("answers.question");
  res.json(attempts);
});

export default router;
