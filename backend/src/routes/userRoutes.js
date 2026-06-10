import express from "express";
import User from "../models/User.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = express.Router();

router.get(
  "/students",
  protect,
  adminOnly,
  async (req, res) => {
    const students = await User.find({
      role: "student"
    })
      .select("-password")
      .sort({
        createdAt: -1
      });

    res.json(students);
  }
);

router.put(
  "/students/:id/subject",
  protect,
  adminOnly,
  async (req, res) => {
    try {
      const { mainSubject } = req.body;

      const user =
        await User.findByIdAndUpdate(
          req.params.id,
          {
            mainSubject
          },
          {
            new: true
          }
        );

      res.json(user);
    } catch (err) {
      res.status(500).json({
        message: err.message
      });
    }
  }
);

export default router;