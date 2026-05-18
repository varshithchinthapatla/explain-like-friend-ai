import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  const navigate = useNavigate(); // ✅ inside component

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    try {
      const res = await axios.post(
        "https://explain-like-friend-ai.onrender.com/api/auth/login",
        { email, password }
      );

      localStorage.setItem("user", JSON.stringify(res.data.user));

      navigate("/"); // ✅ correct navigation
    } catch (err) {
      alert(err.response?.data?.msg || "Login failed");
    }
  };

  return (
    <div>
      <h2>Login</h2>

      <input onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
      <input onChange={(e) => setPassword(e.target.value)} placeholder="Password" />

      <button onClick={login}>Login</button>

      <p onClick={() => navigate("/register")}>
        Register
      </p>
    </div>
  );
}

export default Login;