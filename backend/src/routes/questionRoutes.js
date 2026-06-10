import express from "express";
import Question from "../models/Question.js";
import {
  protect,
  adminOnly
} from "../middleware/auth.js";

const router = express.Router();

router.get("/", protect, async (req, res) => {
  const filter = {};

  if (req.query.category) {
    filter.category =
      req.query.category;
  }

  if (req.query.chapter) {
    filter.chapter =
      req.query.chapter;
  }

  const questions =
    await Question.find(filter)
      .sort({
        createdAt: -1
      });

  res.json(questions);
});

router.post(
  "/",
  protect,
  adminOnly,
  async (req, res) => {
    const question =
      await Question.create({
        ...req.body,
        createdBy: req.user._id
      });

    res.status(201).json(
      question
    );
  }
);

router.put(
  "/:id",
  protect,
  adminOnly,
  async (req, res) => {
    const updated =
      await Question.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true
        }
      );

    res.json(updated);
  }
);

router.delete(
  "/:id",
  protect,
  adminOnly,
  async (req, res) => {
    await Question.findByIdAndDelete(
      req.params.id
    );

    res.json({
      message:
        "Soal berhasil dihapus"
    });
  }
);

export default router;