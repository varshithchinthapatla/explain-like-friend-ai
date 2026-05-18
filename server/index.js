import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import axios from "axios";

import authRoutes from "./routes/auth.js";
import Chat from "./models/chat.js";

dotenv.config();

// ✅ STEP 1: CREATE APP FIRST
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// ✅ STEP 2: ROUTES AFTER APP CREATION
app.use("/api/auth", authRoutes);

// MongoDB connect
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

// Test route
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// AI route
app.post("/api/explain", async (req, res) => {
  try {
    const { topic } = req.body;

    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.1-8b-instant",
        messages: [{ role: "user", content: topic }],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const aiReply = response.data.choices[0].message.content;

    await Chat.create({
      question: topic,
      answer: aiReply,
    });

    res.json({ reply: aiReply });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ STEP 3: START SERVER LAST
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});