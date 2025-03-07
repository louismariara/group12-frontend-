import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import './Courses.css';

const Courses = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingCourse, setEditingCourse] = useState(null);
  const [newCourse, setNewCourse] = useState({ name: "", duration: "", image: "" });
  const [showAddForm, setShowAddForm] = useState(false);

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
  }, []);

  const handleEnroll = (courseId) => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:5000/api/students/enroll", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ course_id: courseId })
    })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        return res.json();
      })
      .then(data => alert(data.message))
      .catch(err => alert("Error enrolling: " + err.message));
  };

  const handleDeleteCourse = (id) => {
    const token = localStorage.getItem("token");
    fetch(`http://localhost:5000/api/admin/courses/${id}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        setCourses(courses.filter(course => course.id !== id));
      })
      .catch(err => console.error("Error deleting course:", err));
  };

  const handleEditCourse = (course) => {
    setEditingCourse({ ...course });
  };

  const saveEditedCourse = () => {
    const token = localStorage.getItem("token");
    fetch(`http://localhost:5000/api/instructors/courses/${editingCourse.id}`, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(editingCourse)
    })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        return res.json();
      })
      .then(updatedCourse => {
        setCourses(courses.map(c => (c.id === updatedCourse.id ? updatedCourse : c)));
        setEditingCourse(null);
      })
      .catch(err => console.error("Error updating course:", err));
  };

  const handleAddCourse = () => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:5000/api/courses", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newCourse)
    })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        return res.json();
      })
      .then(data => {
        setCourses([...courses, data]);
        if (user?.is_instructor) {
          fetch("http://localhost:5000/api/instructors/assign-course", {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ course_id: data.id })
          })
            .then(res => res.json())
            .then(assignData => alert(assignData.message));
        } else {
          alert("Course added successfully");
        }
        setNewCourse({ name: "", duration: "", image: "" });
        setShowAddForm(false);
      })
      .catch(err => alert("Error adding course: " + err.message));
  };

  if (loading) return <div>Loading courses...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="courses-container">
      <h1 className="title">Our Courses</h1>
      {(user?.is_admin || user?.is_instructor) && (
        <button onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? "Cancel" : "Add New Course"}
        </button>
      )}
      {showAddForm && (
        <div className="add-course-form">
          <input
            type="text"
            placeholder="Course Name"
            value={newCourse.name}
            onChange={(e) => setNewCourse({ ...newCourse, name: e.target.value })}
          />
          <input
            type="number"
            placeholder="Duration (hours)"
            value={newCourse.duration}
            onChange={(e) => setNewCourse({ ...newCourse, duration: e.target.value })}
          />
          <input
            type="text"
            placeholder="Image URL"
            value={newCourse.image}
            onChange={(e) => setNewCourse({ ...newCourse, image: e.target.value })}
          />
          <button onClick={handleAddCourse}>Add Course</button>
        </div>
      )}
      <ul className="course-list">
        {courses.map((course) => (
          <li key={course.id} className="course-card">
            <img src={course.image || "/images/default.png"} alt={course.name} className="course-image" />
            <h3 className="course-title">{course.name}</h3>
            <button className="view-course-btn">
              <Link to={`/course/${course.id}`}>View Course</Link>
            </button>
            {user?.is_student && (
              <button className="enroll-btn" onClick={() => handleEnroll(course.id)}>
                Enroll
              </button>
            )}
            {user && (user.is_admin || (user.is_instructor && course.instructor_id === user.id)) && (
              <button className="edit-course-btn" onClick={() => handleEditCourse(course)}>
                Edit Course
              </button>
            )}
            {user?.is_admin && (
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
          <button onClick={saveEditedCourse}>Save</button>
          <button onClick={() => setEditingCourse(null)}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default Courses;