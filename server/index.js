import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";
import mongoose from "mongoose";
import Chat from "./models/chat.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("MongoDB Error:", err));

// Health check route
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// Main AI route
app.post("/api/explain", async (req, res) => {
  try {
    const { topic } = req.body;

    if (!topic) {
      return res.status(400).json({ error: "Topic is required" });
    }

    const prompt = `
Explain "${topic}" like a friendly college senior.
Use simple language.
Give relatable examples.
Avoid textbook style.
Keep it fun and beginner friendly.
`;

    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.1-8b-instant",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const aiReply = response.data.choices[0].message.content;

    // Save to MongoDB
    const newChat = new Chat({
      question: topic,
      answer: aiReply,
      language: "English",
    });

    await newChat.save();

    // Send response to frontend
    res.json({ reply: aiReply });

  } catch (error) {
    console.log("Error:", error.response?.data || error.message);

    res.status(500).json({
      error: "Something went wrong",
    });
  }
});

// Start server (IMPORTANT FOR RENDER)
const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});