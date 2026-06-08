import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "student"], default: "student" },
    school: { type: String, default: "SMUDAMA" }
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
