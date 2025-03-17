import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './Login.css';

const Login = ({ setUser }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    fetch("https://group12-backend-cv2o.onrender.com/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    })
      .then(res => {
        if (!res.ok) {
          return res.json().then(err => { throw new Error(err.message || "Login failed"); });
        }
        return res.json();
      })
      .then(data => {
        if (typeof window !== "undefined" && window.localStorage) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
          setUser(data.user);
          if (data.user.role === "admin") navigate("/admin");
          else if (data.user.role === "instructor") navigate("/instructor-dashboard");
          else navigate("/courses");
        } else {
          console.error("localStorage not available");
          alert("Storage error, login succeeded but token not saved");
        }
      })
      .catch(err => {
        console.error("Login error:", err.message);
        alert(err.message); 
      });
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <div className="input-group">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="input-field"
            />
          </div>
          <div className="input-group">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="input-field"
            />
          </div>
          <button type="submit" className="submit-btn">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;