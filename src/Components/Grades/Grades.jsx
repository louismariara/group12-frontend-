import React, { useState, useEffect } from "react";
import './Grades.css';

const Grades = () => {
  const [grades, setGrades] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (user && user.role === "student") {
      const token = localStorage.getItem("token");
      fetch("http://localhost:5000/api/students/my-grades", {
        headers: { "Authorization": `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => setGrades(data))
        .catch(err => console.error("Error fetching grades:", err));
    }
  }, []);

  if (!user || user.role !== "student") {
    return <div>You must be a student to view this page.</div>;
  }

  return (
    <div className="grades-page">
      <div className="grades-container">
        <h2 className="grades-title">Your Grades</h2>
        <ul className="grades-list">
          {grades.map((item, index) => (
            <li key={index} className="grade-item">
              <span className="course-name">{item.course?.name || "Unknown Course"}</span>
              <span className="grade-value">{item.grade}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Grades;