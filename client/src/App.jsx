import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function App() {
  const navigate = useNavigate();

  // ✅ ONLY ONE USER STATE
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user"))
  );

  const [topic, setTopic] = useState("");
  const [reply, setReply] = useState("");
  const [displayedText, setDisplayedText] = useState("");
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState("English");
  const [chatHistory, setChatHistory] = useState([]);
  const [darkMode, setDarkMode] = useState(true);

  // 🚨 redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, []);
useEffect(() => {
  const fetchChats = async () => {
    if (!user) return;

    const res = await axios.post(
      "https://explain-like-friend-ai.onrender.com/api/chats",
      { userId: user.email }
    );

    setChatHistory(res.data);
  };

  fetchChats();
}, []);
  // typing animation
  useEffect(() => {
    let i = 0;
    setDisplayedText("");

    const interval = setInterval(() => {
      setDisplayedText(reply.slice(0, i));
      i++;
      if (i > reply.length) clearInterval(interval);
    }, 10);

    return () => clearInterval(interval);
  }, [reply]);

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  const explainTopic = async () => {
    if (!topic) return;

    try {
      setLoading(true);

      const response = await axios.post(
        "https://explain-like-friend-ai.onrender.com/api/explain",
        {
          topic: `${topic}. Explain in ${language}`,
        }
      );

      setReply(response.data.reply);

      setChatHistory([
        { question: topic, answer: response.data.reply },
        ...chatHistory,
      ]);
    } catch (err) {
      console.log(err);
      alert("Error");
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="app">

    {/* TOP BAR */}
    <header className="topbar">
      <h2>Explain Like Friend AI 🚀</h2>
      <button onClick={logout}>Logout</button>
    </header>

    {/* CHAT AREA */}
    <div className="chat-container">

      <div className="chat-box">
        {displayedText || "Ask me anything..."}
      </div>

      {/* INPUT AREA */}
      <div className="input-area">

        <input
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Type your question..."
        />

        <button onClick={explainTopic}>
          {loading ? "Thinking..." : "Send 🚀"}
        </button>

      </div>

    </div>

  </div>
);
}
export default App;