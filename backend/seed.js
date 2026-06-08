import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "./src/models/User.js";
import Question from "./src/models/Question.js";

dotenv.config();

const categories = [
  "Matematika",
  "Fisika",
  "Kimia",
  "Biologi",
  "Astronomi",
  "Kebumian",
  "Komputer/Informatika",
  "Ekonomi",
  "Bahasa Inggris"
];

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);

  await User.deleteMany();
  await Question.deleteMany();

  const adminPassword = await bcrypt.hash("admin123", 10);
  const studentPassword = await bcrypt.hash("murid123", 10);

  const admin = await User.create({
    name: "Admin MEDIS",
    email: "admin@medis.id",
    password: adminPassword,
    role: "admin"
  });

  await User.create({
    name: "Murid Demo",
    email: "murid@medis.id",
    password: studentPassword,
    role: "student",
    school: "SMUDAMA"
  });

  const sampleQuestions = categories.map((category, index) => ({
    category,
    difficulty: index % 3 === 0 ? "Mudah" : index % 3 === 1 ? "Sedang" : "Sulit",
    questionText: `Contoh soal olimpiade ${category}: pilih jawaban yang paling tepat.`,
    options: ["Pilihan A", "Pilihan B", "Pilihan C", "Pilihan D"],
    correctAnswer: "Pilihan A",
    explanation: `Pembahasan contoh untuk kategori ${category}. Admin dapat mengganti soal ini melalui dashboard.`,
    createdBy: admin._id
  }));

  await Question.insertMany(sampleQuestions);

  console.log("Seed selesai.");
  process.exit();
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
