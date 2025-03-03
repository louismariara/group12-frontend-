import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './Login.css'

const Login = ({ setUser }) => {
  const [role, setRole] = useState("learner"); 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    // User data object
    const userData = { email, role };

    // Store logged-in user in localStorage
    localStorage.setItem("user", JSON.stringify(userData)); 
    setUser(userData);

    // Retrieve existing logged-in users list from localStorage
    let loggedInUsers = JSON.parse(localStorage.getItem("loggedInUsers")) || [];

    // Avoid duplicate entries
    if (!loggedInUsers.some((user) => user.email === email)) {
      loggedInUsers.push(userData);
      localStorage.setItem("loggedInUsers", JSON.stringify(loggedInUsers));
    }

    // Redirect based on role
    if (role === "admin") {
      navigate("/admin");
    } else if (role === "instructor") {
      navigate("/instructor-dashboard");
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <div className="login-container" >
       <div className="login-box">
      <h2 >Login</h2>
      <form onSubmit={handleLogin}>

      <div className="input-group">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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

        <div className="input-group">
        <label> Select Role:</label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
           className="role-select"
        >
        
          <option value="learner">Learner</option>
          <option value="instructor">Instructor</option>
          <option value="admin">Admin</option>
        </select>
        </div>
        <button type="submit" className="submit-btn" >
          Login
        </button>
      </form>
    </div>
    </div>
  );
};

export default Login;