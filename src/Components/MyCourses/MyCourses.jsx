import React, { useState, useEffect } from "react";
import "./MyCourses.css";

const MyCourses = () => {
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user || user.role !== "instructor") {
      setError("You must be an instructor to view this page.");
      return;
    }

    const token = localStorage.getItem("token");
    fetch("http://localhost:5000/api/instructors/my-courses", {
      headers: { "Authorization": `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data)) {
          setCourses(data);
        } else {
          setError("Unexpected response format from server");
          console.error("Response is not an array:", data);
        }
      })
      .catch(err => {
        setError("Failed to load courses: " + err.message);
        console.error("Fetch error:", err);
      });
  }, []);

  if (error) return <div>{error}</div>;

  return (
    <div className="my-courses-container">
      <h2>My Courses</h2>
      <table className="courses-table">
        <thead>
          <tr>
            <th>All Courses</th>
            <th>Students</th>
            <th>Published On</th>
          </tr>
        </thead>
        <tbody>
          {courses.map((course) => (
            <tr key={course.id}>
              <td className="course-info">
                <div className="course-info-wrapper">
                  <img
                    src={course.image || "/images/default.png"}
                    alt={course.name}
                    className="my-course-image"
                  />
                  <span>{course.name}</span>
                </div>
              </td>
              <td>{course.students?.length || 0}</td>
              <td>{course.created_at ? new Date(course.created_at).toLocaleDateString() : "N/A"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MyCourses;