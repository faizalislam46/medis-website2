import mongoose from "mongoose";

const chapterSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
      trim: true
    },

    chapterName: {
      type: String,
      required: true,
      trim: true
    }
  },
  { timestamps: true }
);

chapterSchema.index(
  { category: 1, chapterName: 1 },
  { unique: true }
);

export default mongoose.model("Chapter", chapterSchema);