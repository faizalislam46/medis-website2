import mongoose from "mongoose";

const answerSchema = new mongoose.Schema({
  question: { type: mongoose.Schema.Types.ObjectId, ref: "Question" },
  selectedAnswer: String,
  isCorrect: Boolean
});

const attemptSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    category: { type: String, required: true },
    score: { type: Number, required: true },
    totalQuestions: { type: Number, required: true },
    answers: [answerSchema]
  },
  { timestamps: true }
);

export default mongoose.model("Attempt", attemptSchema);
