import mongoose from "mongoose";

const tryoutSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    category: {
      type: String,
      required: true
    },
    durationMinutes: {
      type: Number,
      required: true
    },
    totalQuestions: {
      type: Number,
      required: true
    },
    isActive: {
      type: Boolean,
      default: true
    },
    questions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question"
      }
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  },
  { timestamps: true }
);

export default mongoose.model("Tryout", tryoutSchema);