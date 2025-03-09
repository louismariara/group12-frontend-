import React from "react";
import { Link, useNavigate } from "react-router-dom";
import './Navbar.css';

const Navbar = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <h2 className="navbar-title">Bloom Academy</h2>
      </div>

      <ul className="navbar-links">
        <li><Link to="/" className="navbar-link">Home</Link></li>
        <li><Link to="/grades" className="navbar-link">Grades</Link></li>
        <li><Link to="/courses" className="navbar-link">Courses</Link></li>
        {user && user.role === "admin" && (
          <li><Link to="/add-courses" className="navbar-link">Add Courses</Link></li>
        )}
        {user && user.role === "admin" && (
          <li><Link to="/my-courses" className="navbar-link">My Courses</Link></li>
        )}
        {user && user.role === "admin" && (
          <li><Link to="/admin" className="navbar-link">Admin Page</Link></li>
        )}
        {user && user.role === "instructor" && (
          <li><Link to="/add-courses" className="navbar-link">Add Courses</Link></li>
        )}
        {user && user.role === "instructor" && (
          <li><Link to="/my-courses" className="navbar-link">My Courses</Link></li>
        )}
        {user && user.role === "student" && (
          <li><Link to="/my-courses" className="navbar-link">My Courses</Link></li>
        )}
        {user ? (
          <li><button onClick={handleLogout} className="navbar-btn">Logout</button></li>
        ) : (
          <>
            <li><Link to="/login" className="navbar-link"><button className="navbar-btn">Login</button></Link></li>
            <li><Link to="/signup" className="navbar-link"><button className="navbar-btn">Sign Up</button></Link></li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;