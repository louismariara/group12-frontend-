import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./CourseDetails.css";

const CourseDetails = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Please log in to view course details");
      setLoading(false);
      return;
    }

    fetch(`http://localhost:5000/api/courses/${courseId}`, {
      headers: { "Authorization": `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) {
          return res.json().then(err => {
            throw new Error(err.error || `HTTP error! Status: ${res.status}`);
          });
        }
        return res.json();
      })
      .then(data => {
        setCourse(data);
        setLoading(false);
      })
      .catch(err => {
        setError("Error fetching course: " + err.message);
        setLoading(false);
        console.error("Fetch error:", err);
      });
  }, [courseId]);

  if (loading) return <div>Loading course details...</div>;
  if (error) return <div>{error}</div>;
  if (!course) return <div>No course found</div>;

  return (
    <div className="course-details">
      <h1>{course.name}</h1>
      <img src={course.image || "/images/default.png"} alt={course.name} className="course-image" />
      <p>Duration: {course.duration} hours</p>
      <p>Instructor: {course.instructor?.name || "Not assigned"}</p>
      <p>Created At: {new Date(course.created_at).toLocaleDateString()}</p>
      {course.modules && (
        <div>
          <h3>Modules</h3>
          <ul>
            {course.modules.map((module, index) => (
              <li key={index}>{module.title}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CourseDetails;