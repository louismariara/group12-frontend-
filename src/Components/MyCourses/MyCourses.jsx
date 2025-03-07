import React, { useState, useEffect } from "react";
import "./MyCourses.css";

const MyCourses = () => {
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user) {
      setError("Please log in to view your courses.");
      setLoading(false);
      return;
    }

    const token = localStorage.getItem("token");
    const endpoint = user.is_instructor ? 
      "http://localhost:5000/api/instructors/my-courses" : 
      "http://localhost:5000/api/students/my-courses";

    fetch(endpoint, {
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
        setLoading(false);
      })
      .catch(err => {
        setError("Failed to load courses: " + err.message);
        setLoading(false);
        console.error("Fetch error:", err);
      });
  }, []);

  if (loading) return <div>Loading courses...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="my-courses-container">
      <h2>{user.is_instructor ? "My Courses (Teaching)" : "My Enrolled Courses"}</h2>
      <table className="courses-table">
        <thead>
          <tr>
            <th>Course Name</th>
            {user.is_instructor && <th>Students</th>}
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
              {user.is_instructor && (
                <td>{course.students?.length || 0}</td>
              )}
              <td>{course.created_at ? new Date(course.created_at).toLocaleDateString() : "N/A"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MyCourses;