import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";
import mongoose from "mongoose";
import Chat from "./models/Chat.js";

dotenv.config();

const app = express(); // ✅ MUST BE FIRST

app.use(cors());
app.use(express.json());

// MongoDB connect
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// ROOT route
app.get("/", (req, res) => {
  res.send("Backend working");
});

// API route
app.post("/api/explain", async (req, res) => {
  try {
    const { topic } = req.body;

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
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const aiReply = response.data.choices[0].message.content;

    const newChat = new Chat({
      question: topic,
      answer: aiReply,
      language: "English",
    });

    await newChat.save();

    res.json({ reply: aiReply });

  } catch (error) {
    console.log(error.response?.data || error.message);

    res.status(500).json({
      error: "Something went wrong",
    });
  }
});

// Start server
app.listen(5000, () => {
  console.log("Server running on port 5000");
});