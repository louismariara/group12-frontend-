import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import './Courses.css';

const Courses = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingCourse, setEditingCourse] = useState(null);
  const [instructors, setInstructors] = useState([]); // For instructor dropdown

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
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data)) setCourses(data);
        else setError("Unexpected response format from server");
        setLoading(false);
      })
      .catch(err => {
        setError("Failed to load courses: " + err.message);
        setLoading(false);
      });

    // Fetch instructors for dropdown
    fetch("http://localhost:5000/api/instructors", {
      headers: { "Authorization": `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setInstructors(data))
      .catch(err => console.error("Error fetching instructors:", err));
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

  const handleEditCourse = (course) => {
    setEditingCourse({ ...course }); // Clone course for editing
  };

  const saveEditedCourse = () => {
    const token = localStorage.getItem("token");
    fetch(`http://localhost:5000/api/admin/courses/${editingCourse.id}`, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(editingCourse)
    })
      .then(res => res.json())
      .then(updatedCourse => {
        setCourses(courses.map(c => (c.id === updatedCourse.id ? updatedCourse : c)));
        setEditingCourse(null);
      })
      .catch(err => console.error("Error updating course:", err));
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
              <button className="edit-course-btn" onClick={() => handleEditCourse(course)}>
                Edit Course
              </button>
            )}
            {user && user.role === "admin" && (
              <button className="delete-course-btn" onClick={() => handleDeleteCourse(course.id)}>
                Delete Course
              </button>
            )}
          </li>
        ))}
      </ul>

      {editingCourse && (
        <div className="edit-course-modal">
          <h3>Edit Course</h3>
          <input
            type="text"
            value={editingCourse.name}
            onChange={(e) => setEditingCourse({ ...editingCourse, name: e.target.value })}
            placeholder="Course Name"
          />
          <input
            type="number"
            value={editingCourse.duration}
            onChange={(e) => setEditingCourse({ ...editingCourse, duration: parseInt(e.target.value) })}
            placeholder="Duration (hours)"
          />
          <input
            type="text"
            value={editingCourse.image || ""}
            onChange={(e) => setEditingCourse({ ...editingCourse, image: e.target.value })}
            placeholder="Image URL"
          />
          <select
            value={editingCourse.instructor_id || ""}
            onChange={(e) => setEditingCourse({ ...editingCourse, instructor_id: e.target.value ? parseInt(e.target.value) : null })}
          >
            <option value="">No Instructor</option>
            {instructors.map(i => (
              <option key={i.id} value={i.id}>{i.name}</option>
            ))}
          </select>
          <button onClick={saveEditedCourse}>Save</button>
          <button onClick={() => setEditingCourse(null)}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default Courses;