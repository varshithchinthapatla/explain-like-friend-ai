import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { setUser } from "../utils/auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const login = async () => {
    try {
      const res = await axios.post(
        "https://explain-like-friend-ai.onrender.com/api/auth/login",
        { email, password }
      );

      setUser(res.data.user);
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.msg || "Login failed");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Welcome Back 👋</h2>
        <p>Login to continue</p>

        <input
          className="input"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="input"
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="btn btn-primary" onClick={login}>
          Login
        </button>

        <p className="link">
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}