import { useState } from "react";
import API from "../utils/api";
import { useNavigate, Link } from "react-router-dom";
import { setUser } from "../utils/auth";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const register = async () => {
    try {
      const res = await API.post(
  "/api/auth/register",
        { name, email, password }
      );

      setUser(res.data.user);
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.msg || "Register failed");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Create Account 🚀</h2>
        <p>Join Explain Like Friend AI</p>

        <input className="input" placeholder="Name" onChange={(e) => setName(e.target.value)} />
        <input className="input" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
        <input className="input" type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />

        <button className="btn btn-primary" onClick={register}>
          Register
        </button>

        <p className="link">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}