import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const [data, setData] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const API = process.env.REACT_APP_API;

  const handleLogin = async () => {
    try {
      const res = await axios.post(`${API}/api/login`, data);
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="page">
      <div className="container">
        <h2>Login</h2>

        <input
          placeholder="Email"
          onChange={e => setData({ ...data, email: e.target.value })}
        />

        <input
          type="password"
          placeholder="Password"
          onChange={e => setData({ ...data, password: e.target.value })}
        />

        <button onClick={handleLogin}>Login</button>

        <p>New user? <Link to="/register">Register</Link></p>
      </div>
    </div>
  );
}

export default Login;