import mongoose from "mongoose";

const resultSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    studentName: {
      type: String,
      default: ""
    },

    studentEmail: {
      type: String,
      default: ""
    },

    studentSubject: {
      type: String,
      default: ""
    },

    tryoutId: {
      type: String,
      required: true
    },

    tryoutTitle: {
      type: String,
      required: true
    },

    category: {
      type: String,
      required: true
    },

    chapterScores: [
      {
        chapter: {
          type: String,
          default: "Umum"
        },
        score: {
          type: Number,
          default: 0
        },
        total: {
          type: Number,
          default: 0
        }
      }
    ],

    score: {
      type: Number,
      required: true
    },

    totalQuestions: {
      type: Number,
      required: true
    }
  },
  { timestamps: true }
);

export default mongoose.model("Result", resultSchema);