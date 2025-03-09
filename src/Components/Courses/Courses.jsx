import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";
import './Courses.css';

const Courses = () => {
  const [currentUser, setCurrentUser] = useState(() => JSON.parse(localStorage.getItem("user") || '{}'));
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingCourse, setEditingCourse] = useState(null);
  const [newCourse, setNewCourse] = useState({ name: "", duration: "", image: "" });
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found: Please log in to view courses");
      setLoading(false);
      return;
    }

    fetch("https://group12-backend-cv2o.onrender.com/api/courses", {
      headers: { "Authorization": `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        return res.json();
      })
      .then(data => {
        console.log("Fetched courses data:", data); // Log full response
        if (Array.isArray(data)) {
          console.log("Number of courses fetched:", data.length);
          setCourses(data);
          console.log("Courses state set with:", data.length, "items");
        } else {
          console.error("Unexpected response format from server:", data);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Fetch error:", err.message);
        setLoading(false);
      });

    const handleStorageChange = () => {
      const newUser = JSON.parse(localStorage.getItem("user") || '{}');
      console.log("Storage changed, new user:", newUser); // Debug storage update
      setCurrentUser(newUser);
    };
    window.addEventListener("storage", handleStorageChange);
    // Force initial check
    handleStorageChange();
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleEnroll = (courseId) => {
    const token = localStorage.getItem("token");
    fetch("https://group12-backend-cv2o.onrender.com/api/students/enroll", {
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
      .catch(err => console.error("Error enrolling:", err.message));
  };

  const handleDeleteCourse = (id) => {
    const token = localStorage.getItem("token");
    fetch(`https://group12-backend-cv2o.onrender.com/api/admin/courses/${id}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        return res.json();
      })
      .then(() => {
        setCourses(courses.filter(course => course.id !== id));
        alert("Course deleted successfully");
      })
      .catch(err => console.error("Error deleting course:", err.message));
  };

  const handleEditCourse = (course) => {
    setEditingCourse({ ...course });
  };

  const saveEditedCourse = () => {
    const token = localStorage.getItem("token");
    const endpoint = currentUser?.is_admin ? 
      `https://group12-backend-cv2o.onrender.com/api/admin/courses/${editingCourse.id}` : 
      `https://group12-backend-cv2o.onrender.com/api/instructors/courses/${editingCourse.id}`;
    fetch(endpoint, {
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
        alert("Course updated successfully");
      })
      .catch(err => console.error("Error updating course:", err.message));
  };

  const handleAddCourse = () => {
    const token = localStorage.getItem("token");
    fetch("https://group12-backend-cv2o.onrender.com/api/admin/courses", {
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
        if (currentUser?.is_instructor) {
          fetch("https://group12-backend-cv2o.onrender.com/api/instructors/assign-course", {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${token}`,
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ course_id: data.id })
          })
            .then(res => {
              if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
              return res.json();
            })
            .then(assignData => alert(assignData.message));
        } else {
          alert("Course added successfully");
        }
        setNewCourse({ name: "", duration: "", image: "" });
        setShowAddForm(false);
      })
      .catch(err => console.error("Error adding course:", err.message));
  };

  if (loading) return <div>Loading courses...</div>;
  if (error) {
    console.error("Error state:", error);
    return null;
  }

  console.log("Rendering courses, count:", courses.length);
  console.log("Current user during render:", currentUser);

  return (
    <div className="courses-container">
      <h1 className="title">Our Courses</h1>
      {(currentUser?.is_admin || currentUser?.is_instructor) && (
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
            {console.log("Course image during render:", course.image)}
            <img
              src={course.image || "/images/default.png"}
              alt={course.name}
              className="course-image"
              width="300" // Explicit width to match CSS
              height="180" // Explicit height to match CSS
              onError={(e) => {
                console.error(`Failed to load image for ${course.name}: ${e.target.src}`);
                e.target.src = "/images/default.png"; // Use default.png
                e.target.onerror = null; // Prevent infinite loop
                if (e.target.src !== "/images/default.png") {
                  e.target.src = "https://via.placeholder.com/300x180?text=No+Image";
                }
              }}
            />
            <h3 className="course-title">{course.name}</h3>
            <p className="course-duration">Duration: {course.duration} hours</p>
            <div className="button-group">
              <button className="view-course-btn">
                <Link to={`/course/${course.id}`}>View Course</Link>
              </button>
              {currentUser?.role === "student" && (
                <button className="enroll-btn" onClick={() => handleEnroll(course.id)}>
                  Enroll
                </button>
              )}
            </div>
            {currentUser && (currentUser.is_admin || (currentUser.is_instructor && course.instructor_id === currentUser.id)) && (
              <button className="edit-course-btn" onClick={() => handleEditCourse(course)}>
                Edit Course
              </button>
            )}
            {currentUser?.is_admin && (
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