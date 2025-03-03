import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminPage.css"; // <-- Import the CSS file

const AdminPage = () => {
  const [instructorCount, setInstructorCount] = useState(0);
  const [learnerCount, setLearnerCount] = useState(0);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    // Redirect non-admins to the home page
    if (!user || user.role !== "admin") {
      navigate("/");
    }

    // Retrieve all logged-in users
    const loggedInUsers = JSON.parse(localStorage.getItem("loggedInUsers")) || [];

    // Count instructors and learners
    const instructors = loggedInUsers.filter((u) => u.role === "instructor").length;
    const learners = loggedInUsers.filter((u) => u.role === "learner").length;

    setInstructorCount(instructors);
    setLearnerCount(learners);
  }, [navigate, user]);

  // If user is not an admin, render nothing
  if (!user || user.role !== "admin") {
    return null;
  }

  return (
    <div className="admin-page">
    <div className="admin-container">
      <h1 className="admin-title">Admin Dashboard</h1>
      <p className="admin-p">
        Welcome, <span>{user?.username}</span>. You can manage content here.
      </p>

      <div className="stats-container">
        <div className="stats-card">
          <h3>Instructors</h3>
          <p className="stats-count">{instructorCount}</p>
        </div>
        <div className="stats-card">
          <h3>Learners</h3>
          <p className="stats-count">{learnerCount}</p>
        </div>
      </div>
    </div>
    </div>
  );
};

export default AdminPage;