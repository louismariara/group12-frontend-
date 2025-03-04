import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './Signup.css'

const Signup = ({ setUser }) => {
  const [role, setRole] = useState("learner");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = (e) => {
    e.preventDefault();
    const userData = { email, role };
    localStorage.setItem("user", JSON.stringify(userData)); 
    setUser(userData);
    navigate("/courses"); 
    
  };

  return (
    <div className="signup-container">
      <div className="signup-box">
      <h2>Sign Up</h2>
      <form onSubmit={handleSignup}>
      <div className="input-group">
      <label>Email</label>
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
        <label>Password</label>
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
        <label>Select Role:</label>
        <select value={role} onChange={(e) => setRole(e.target.value)}
            className="role-select"
          >
          <option value="learner">Learner</option>
          <option value="instructor">Instructor</option>
          <option value="admin">Admin</option>
        </select>
        </div>

        <button type="submit" className="submit-btn">Sign Up</button>
      </form>
    </div>
    </div>
  );
};

export default Signup;
