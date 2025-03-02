import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AdminPage = () => {
  const [instructorCount, setInstructorCount] = useState(0);
  const [learnerCount, setLearnerCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user || user.role !== "admin") {
      navigate("/");
      return;
    }

    // Retrieve logged-in users from localStorage
    const loggedInUsers = JSON.parse(localStorage.getItem("loggedInUsers")) || [];

    // Count instructors and learners
    const instructors = loggedInUsers.filter(user => user.role === "instructor").length;
    const learners = loggedInUsers.filter(user => user.role === "learner").length;

    setInstructorCount(instructors);
    setLearnerCount(learners);
  }, [navigate]);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
      <p className="text-lg">Welcome, Admin! Manage users and content here.</p>

      <div className="mt-6 bg-gray-100 p-4 rounded-lg shadow">
        <h2 className="text-2xl font-semibold">User Statistics</h2>
        <p className="mt-2">📚 Learners Logged In: <strong>{learnerCount}</strong></p>
        <p>🎓 Instructors Logged In: <strong>{instructorCount}</strong></p>
      </div>
    </div>
  );
};

export default AdminPage;
