import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    question: String,
    answer: String,
    language: String,
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "Chat",
  chatSchema
);