import React, { useState, useEffect } from "react";
import './Grades.css';

const Grades = () => {
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user || user.role !== "student") {
      setError("You must be a student to view this page.");
      setLoading(false);
      return;
    }

    const token = localStorage.getItem("token");
    fetch("http://localhost:5000/api/students/my-grades", {
      headers: { "Authorization": `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        return res.json();
      })
      .then(data => {
        setGrades(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(err => {
        setError("Error fetching grades: " + err.message);
        setLoading(false);
        console.error("Fetch error:", err);
      });
  }, []);

  if (loading) return <div>Loading grades...</div>;
  if (error) return <div className="grades-page">{error}</div>;

  return (
    <div className="grades-page">
      <div className="grades-container">
        <h2 className="grades-title">Your Grades</h2>
        {grades.length > 0 ? (
          <ul className="grades-list">
            {grades.map((item, index) => (
              <li key={index} className="grade-item">
                <span className="course-name">{item.course?.name || "Unknown Course"}</span>
                <span className="grade-value">{item.grade}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p>No grades available.</p>
        )}
      </div>
    </div>
  );
};

export default Grades;