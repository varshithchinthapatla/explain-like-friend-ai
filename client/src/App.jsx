import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [topic, setTopic] = useState("");
  const [reply, setReply] = useState("");
  const [displayedText, setDisplayedText] = useState("");
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState("English");
  const [chatHistory, setChatHistory] = useState([]);
  const [darkMode, setDarkMode] = useState(true);

  // Typing Animation
  useEffect(() => {
    let i = 0;

    setDisplayedText("");

    const interval = setInterval(() => {
      setDisplayedText(reply.slice(0, i));

      i++;

      if (i > reply.length) {
        clearInterval(interval);
      }
    }, 10);

    return () => clearInterval(interval);
  }, [reply]);

  // Voice Input
  const startListening = () => {
    const recognition =
      new window.webkitSpeechRecognition();

    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      setTopic(event.results[0][0].transcript);
    };

    recognition.start();
  };

  // Voice Output
  const speakText = () => {
    const speech = new SpeechSynthesisUtterance(reply);

    if (language === "Hindi") speech.lang = "hi-IN";
    else if (language === "Telugu") speech.lang = "te-IN";
    else if (language === "Tamil") speech.lang = "ta-IN";
    else speech.lang = "en-US";

    window.speechSynthesis.speak(speech);
  };

  // AI Request
  const explainTopic = async () => {
    if (!topic) return;

    try {
      setLoading(true);

      const response = await axios.post(
        "http://localhost:5000/api/explain",
        {
          topic: `${topic}. Explain in ${language}`,
        }
      );

      setReply(response.data.reply);

      const updatedChats = [
        {
          question: topic,
          answer: response.data.reply,
        },
        ...chatHistory,
      ];

      setChatHistory(updatedChats);
    } catch (error) {
      console.log(error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: darkMode
          ? "linear-gradient(to bottom right, #020617, #0f172a)"
          : "linear-gradient(to bottom right, #dbeafe, #f8fafc)",
        color: darkMode ? "white" : "black",
        fontFamily: "Arial",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* HEADER */}
      <header
        style={{
          width: "100%",
          padding: "20px 40px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          borderBottom: darkMode
            ? "1px solid #1e293b"
            : "1px solid #cbd5e1",
          position: "sticky",
          top: 0,
          backdropFilter: "blur(10px)",
          background: darkMode
            ? "rgba(2,6,23,0.8)"
            : "rgba(255,255,255,0.7)",
          zIndex: 100,
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "32px",
              marginBottom: "5px",
            }}
          >
            Explain Like Friend AI
          </h1>

          <p
            style={{
              color: darkMode ? "#94a3b8" : "#475569",
              fontSize: "14px",
            }}
          >
            AI Learning Assistant 🚀
          </p>
        </div>

        {/* NAVIGATION */}
        <div
          style={{
            display: "flex",
            gap: "12px",
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <button
            style={{
              padding: "10px 18px",
              borderRadius: "12px",
              border: "none",
              background: "#2563eb",
              color: "white",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Home
          </button>

          <button
            style={{
              padding: "10px 18px",
              borderRadius: "12px",
              border: "none",
              background: "#7c3aed",
              color: "white",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            History
          </button>

          <button
            onClick={() => setDarkMode(!darkMode)}
            style={{
              padding: "10px 18px",
              borderRadius: "12px",
              border: "none",
              cursor: "pointer",
              background: darkMode
                ? "#facc15"
                : "#0f172a",
              color: darkMode ? "black" : "white",
              fontWeight: "bold",
            }}
          >
            {darkMode ? "☀️ Light" : "🌙 Dark"}
          </button>
        </div>
      </header>

      {/* MAIN */}
      <main
        style={{
          flex: 1,
          padding: "20px",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              window.innerWidth < 900
                ? "1fr"
                : "1fr 320px",
            gap: "20px",
          }}
        >
          {/* LEFT SIDE */}
          <div
            style={{
              background: darkMode
                ? "#111827"
                : "white",
              padding: "25px",
              borderRadius: "25px",
              boxShadow:
                "0 0 20px rgba(0,0,0,0.2)",
            }}
          >
            {/* INPUT */}
            <input
              type="text"
              placeholder="Enter any topic..."
              value={topic}
              onChange={(e) =>
                setTopic(e.target.value)
              }
              style={{
                width: "100%",
                padding: "18px",
                borderRadius: "14px",
                border: "1px solid #334155",
                background: darkMode
                  ? "#1e293b"
                  : "#f1f5f9",
                color: darkMode
                  ? "white"
                  : "black",
                fontSize: "18px",
                outline: "none",
              }}
            />

            {/* BUTTONS */}
            <div
              style={{
                display: "flex",
                gap: "15px",
                marginTop: "20px",
                flexWrap: "wrap",
              }}
            >
              {/* LANGUAGE */}
              <select
                value={language}
                onChange={(e) =>
                  setLanguage(e.target.value)
                }
                style={{
                  padding: "15px",
                  borderRadius: "12px",
                  border: "none",
                  background: "#2563eb",
                  color: "white",
                  fontSize: "16px",
                }}
              >
                <option>English</option>
                <option>Telugu</option>
                <option>Hindi</option>
                <option>Tamil</option>
                <option>Kannada</option>
              </select>

              {/* EXPLAIN */}
              <button
                onClick={explainTopic}
                style={{
                  flex: 1,
                  padding: "16px",
                  borderRadius: "12px",
                  border: "none",
                  background:
                    "linear-gradient(to right, #2563eb, #7c3aed)",
                  color: "white",
                  fontSize: "18px",
                  cursor: "pointer",
                  fontWeight: "bold",
                }}
              >
                {loading
                  ? "Explaining..."
                  : "Explain"}
              </button>

              {/* MIC */}
              <button
                onClick={startListening}
                style={{
                  padding: "16px",
                  borderRadius: "12px",
                  border: "none",
                  background: "#f59e0b",
                  color: "white",
                  cursor: "pointer",
                }}
              >
                🎤
              </button>

              {/* SPEAKER */}
              <button
                onClick={speakText}
                style={{
                  padding: "16px",
                  borderRadius: "12px",
                  border: "none",
                  background: "#10b981",
                  color: "white",
                  cursor: "pointer",
                }}
              >
                🔊
              </button>
            </div>

            {/* RESPONSE */}
            <div
              style={{
                marginTop: "30px",
                background: darkMode
                  ? "#0f172a"
                  : "#f8fafc",
                padding: "25px",
                borderRadius: "20px",
                minHeight: "300px",
                lineHeight: "1.9",
                whiteSpace: "pre-wrap",
              }}
            >
              <div
                style={{
                  display: "flex",
                  gap: "15px",
                }}
              >
                {/* AI AVATAR */}
                <img
                  src="https://api.dicebear.com/7.x/bottts/svg?seed=AI"
                  alt="AI"
                  style={{
                    width: "60px",
                    height: "60px",
                    borderRadius: "50%",
                    background: "white",
                  }}
                />

                <div style={{ flex: 1 }}>
                  {displayedText ||
                    "AI response will appear here..."}
                </div>
              </div>
            </div>
          </div>

          {/* HISTORY */}
          <div
            style={{
              background: darkMode
                ? "#111827"
                : "white",
              padding: "20px",
              borderRadius: "25px",
              height: "85vh",
              overflowY: "auto",
              boxShadow:
                "0 0 20px rgba(0,0,0,0.2)",
            }}
          >
            <h2>Chat History</h2>

            {chatHistory.length === 0 ? (
              <p>No chats yet</p>
            ) : (
              chatHistory.map((chat, index) => (
                <div
                  key={index}
                  style={{
                    background: darkMode
                      ? "#1e293b"
                      : "#f1f5f9",
                    padding: "15px",
                    borderRadius: "16px",
                    marginTop: "15px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      alignItems: "center",
                      marginBottom: "10px",
                    }}
                  >
                    {/* USER AVATAR */}
                    <img
                      src="https://api.dicebear.com/7.x/avataaars/svg?seed=User"
                      alt="user"
                      style={{
                        width: "40px",
                        height: "40px",
                      }}
                    />

                    <strong>
                      {chat.question}
                    </strong>
                  </div>

                  <p
                    style={{
                      lineHeight: "1.6",
                      fontSize: "14px",
                    }}
                  >
                    {chat.answer}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer
        style={{
          padding: "20px",
          textAlign: "center",
          borderTop: darkMode
            ? "1px solid #1e293b"
            : "1px solid #cbd5e1",
          color: darkMode
            ? "#94a3b8"
            : "#475569",
        }}
      >
        <p>
          © 2026 Explain Like Friend AI •
          Built with MERN & AI 🚀
        </p>
      </footer>
    </div>
  );
}

export default App;