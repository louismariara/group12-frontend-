import React, { useState, useEffect } from "react";
import "./MyCourses.css";

const MyCourses = () => {
  const [courses, setCourses] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (user && user.role === "instructor") {
      const token = localStorage.getItem("token");
      fetch("http://localhost:5000/api/instructors/my-courses", {
        headers: { "Authorization": `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => setCourses(data))
        .catch(err => console.error("Error fetching courses:", err));
    }
  }, []);

  if (!user || user.role !== "instructor") {
    return <div>You must be an instructor to view this page.</div>;
  }

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
              <td>{new Date().toLocaleDateString()}</td> 
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MyCourses;