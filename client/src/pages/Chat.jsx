import mongoose from "mongoose";

const ChatSchema = new mongoose.Schema(
  {
    userEmail: {
      type: String,
      required: true,
    },
    question: String,
    answer: String,
    language: String,
  },
  { timestamps: true }
);

export default mongoose.model("Chat", ChatSchema);