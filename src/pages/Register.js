import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function Register() {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: ""
  });

  const navigate = useNavigate();
  const API = process.env.REACT_APP_API;

  const handleRegister = async () => {
    try {
      await axios.post(`${API}/api/register`, data);
      alert("Registered");
      navigate("/");
    } catch {
      alert("Error registering");
    }
  };

  return (
    <div className="page">
      <div className="container">
        <h2>Register</h2>

        <input
          placeholder="Name"
          onChange={e => setData({ ...data, name: e.target.value })}
        />

        <input
          placeholder="Email"
          onChange={e => setData({ ...data, email: e.target.value })}
        />

        <input
          type="password"
          placeholder="Password"
          onChange={e => setData({ ...data, password: e.target.value })}
        />

        <button onClick={handleRegister}>Register</button>

        <p><Link to="/">Login</Link></p>
      </div>
    </div>
  );
}

export default Register;