import express from "express";
import Chapter from "../models/Chapter.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = express.Router();

router.get("/", protect, async (req, res) => {
  try {
    const filter = {};

    if (req.query.category) {
      filter.category = req.query.category.trim();
    }

    const chapters = await Chapter.find(filter).sort({
      category: 1,
      chapterName: 1
    });

    const uniqueChapters = chapters.filter(
      (chapter, index, self) =>
        index ===
        self.findIndex(
          (item) =>
            item.category.trim().toLowerCase() ===
              chapter.category.trim().toLowerCase() &&
            item.chapterName.trim().toLowerCase() ===
              chapter.chapterName.trim().toLowerCase()
        )
    );

    res.json(uniqueChapters);
  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
});

router.post("/", protect, adminOnly, async (req, res) => {
  try {
    const category = String(req.body.category || "").trim();
    const chapterName = String(req.body.chapterName || "").trim();

    if (!category || !chapterName) {
      return res.status(400).json({
        message: "Pelajaran dan nama bab wajib diisi"
      });
    }

    const existing = await Chapter.findOne({
      category,
      chapterName
    });

    if (existing) {
      return res.status(400).json({
        message: "Bab sudah ada"
      });
    }

    const chapter = await Chapter.create({
      category,
      chapterName
    });

    res.status(201).json(chapter);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({
        message: "Bab sudah ada"
      });
    }

    res.status(500).json({
      message: err.message
    });
  }
});

router.delete("/:id", protect, adminOnly, async (req, res) => {
  try {
    await Chapter.findByIdAndDelete(req.params.id);

    res.json({
      message: "Bab berhasil dihapus"
    });
  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
});

export default router;