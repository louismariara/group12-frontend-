import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import './Courses.css';

const Courses = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Please log in to view courses");
      setLoading(false);
      return;
    }

    fetch("http://localhost:5000/api/courses", {
      headers: { "Authorization": `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) {
          return res.json().then(err => {
            console.log("Error Response:", err); // Log the error response
            throw new Error(err.error || `HTTP error! Status: ${res.status}`);
          });
        }
        return res.json();
      })
      .then(data => {
        console.log("API Response:", data);
        if (Array.isArray(data)) {
          setCourses(data);
        } else {
          setError("Unexpected response format from server");
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Fetch error:", err);
        setError("Failed to load courses: " + err.message);
        setLoading(false);
      });
  }, []);

  const handleDeleteCourse = (id) => {
    const token = localStorage.getItem("token");
    fetch(`http://localhost:5000/api/admin/courses/${id}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${token}` }
    })
      .then(() => setCourses(courses.filter(course => course.id !== id)))
      .catch(err => console.error("Error deleting course:", err));
  };

  if (loading) return <div>Loading courses...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="courses-container">
      <h1 className="title">Our Courses</h1>
      <ul className="course-list">
        {courses.map((course) => (
          <li key={course.id} className="course-card">
            <img src={course.image || "/images/default.png"} alt={course.name} className="course-image" />
            <h3 className="course-title">{course.name}</h3>
            <button className="view-course-btn">
              <Link to={`/course/${course.id}`}>View Course</Link>
            </button>
            {user && (user.role === "admin" || user.role === "instructor") && (
              <button className="edit-course-btn">Edit Course</button>
            )}
            {user && user.role === "admin" && (
              <button className="delete-course-btn" onClick={() => handleDeleteCourse(course.id)}>
                Delete Course
              </button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Courses;