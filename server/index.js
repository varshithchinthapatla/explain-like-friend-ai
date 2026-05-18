import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import axios from "axios";

import authRoutes from "./routes/auth.js";
import Chat from "./models/chat.js";

dotenv.config();

const app = express();

// Middleware
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);

// MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// Health check
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});


// ===============================
// 🤖 AI + SAVE CHAT ROUTE
// ===============================
app.post("/api/explain", async (req, res) => {
  try {
    const { topic, user } = req.body;

    if (!topic) {
      return res.status(400).json({ error: "Topic required" });
    }

    const prompt = `
Explain "${topic}" like a friendly teacher.
Keep it simple and easy.
`;

    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.1-8b-instant",
        messages: [{ role: "user", content: prompt }],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const aiReply = response.data.choices[0].message.content;

    // 💾 SAVE CHAT (IMPORTANT FIX)
    await Chat.create({
      userId: user?.email,
      question: topic,
      answer: aiReply,
      language: "English",
    });

    res.json({ reply: aiReply });

  } catch (err) {
    console.log(err.response?.data || err.message);
    res.status(500).json({ error: "Server error" });
  }
});


// ===============================
// 📜 GET CHAT HISTORY
// ===============================
app.post("/api/chats", async (req, res) => {
  try {
    const { userId } = req.body;

    const chats = await Chat.find({ userId }).sort({ createdAt: -1 });

    res.json(chats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// START SERVER
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});