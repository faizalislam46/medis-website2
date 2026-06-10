import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      enum: [
        "Matematika",
        "Fisika",
        "Kimia",
        "Biologi",
        "Astronomi",
        "Kebumian",
        "Geografi",
        "Informatika",
        "Ekonomi",
        "Bahasa Inggris"
      ],
      required: true
    },

    chapter: {
      type: String,
      default: "Umum"
    },

    difficulty: {
      type: String,
      enum: ["Mudah", "Sedang", "Sulit"],
      default: "Sedang"
    },

    questionText: {
      type: String,
      required: true
    },

    options: [
      {
        type: String,
        required: true
      }
    ],

    correctAnswer: {
      type: String,
      required: true
    },

    explanation: {
      type: String,
      required: true
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  },
  { timestamps: true }
);

export default mongoose.model("Question", questionSchema);