import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const register = async () => {
    try {
      await axios.post(
        "https://explain-like-friend-ai.onrender.com/api/auth/register",
        { name, email, password }
      );

      alert("Registered successfully");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.msg || "Error");
    }
  };

  return (
    <div>
      <h2>Register</h2>

      <input onChange={(e) => setName(e.target.value)} placeholder="Name" />
      <input onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
      <input onChange={(e) => setPassword(e.target.value)} placeholder="Password" />

      <button onClick={register}>Register</button>

      <p onClick={() => navigate("/login")}>Already have account?</p>
    </div>
  );
}

export default Register; 