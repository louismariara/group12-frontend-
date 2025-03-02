import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

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
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      <form onSubmit={handleLogin} className="bg-white p-6 rounded shadow-md">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="block w-full p-2 border rounded mb-2"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="block w-full p-2 border rounded mb-2"
        />
        <label className="block mb-1">Select Role:</label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="block w-full p-2 border rounded mb-4"
        >
          <option value="learner">Learner</option>
          <option value="instructor">Instructor</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
