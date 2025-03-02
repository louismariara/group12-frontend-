import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <nav>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/grades">Grades</Link></li>
        <li><Link to="/courses">Courses</Link></li>
        {user && user.role === "admin" && <li><Link to="/admin">Admin Page</Link></li>}
        {user ? (
          <>
            <li><button onClick={handleLogout}>Logout</button></li>
          </>
        ) : (
          <>
            <li><Link to="/login"><button>Login</button></Link></li>
            <li><Link to="/signup"><button>Sign Up</button></Link></li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
