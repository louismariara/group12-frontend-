import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./MyCourses.css";

const MyCourses = () => {
  const [courses, setCourses] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newCourse, setNewCourse] = useState({ name: "", duration: "" });
  const [editingCourse, setEditingCourse] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null); // New state for file upload
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const BASE_URL = "https://group12-backend-cv2o.onrender.com";

  const fetchCourses = () => {
    const token = typeof window !== "undefined" && window.localStorage ? localStorage.getItem("token") : null;
    if (!token) {
      console.error("No token found. Please log in again.");
      setError("No token found. Please log in again.");
      setLoading(false);
      return;
    }

    const endpoint =
      user.role === "admin"
        ? `${BASE_URL}/api/admin/courses`
        : user.role === "instructor"
        ? `${BASE_URL}/api/instructors/my-courses`
        : `${BASE_URL}/api/students/my-courses`;

    fetch(endpoint, {
      headers: { "Authorization": `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setCourses(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch error:", err.message);
        setError(err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (!user || (user.role !== "admin" && user.role !== "instructor" && user.role !== "student")) {
      console.log("Redirecting to /: User is not admin, instructor, or student", user);
      setLoading(false);
      navigate("/");
      return;
    }

    fetchCourses();

    if (user.role === "admin") {
      fetch(`${BASE_URL}/api/admin/instructors`, {
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` },
      })
        .then((res) => {
          if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
          return res.json();
        })
        .then((data) => {
          console.log("Fetched instructors:", data);
          setInstructors(Array.isArray(data) ? data : []);
          if (typeof window !== "undefined" && window.localStorage) {
            localStorage.setItem("instructors", JSON.stringify(data));
          }
        })
        .catch((err) => {
          console.error("Fetch instructors error:", err.message);
          setError(err.message);
        });
    }
  }, [navigate, user]);

  const handleCreateCourse = () => {
    const token = typeof window !== "undefined" && window.localStorage ? localStorage.getItem("token") : null;
    if (!token) return;

    const endpoint =
      user.role === "admin"
        ? `${BASE_URL}/api/admin/courses`
        : `${BASE_URL}/api/instructors/courses`;
    fetch(endpoint, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newCourse),
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setCourses([...courses, { id: data.id || courses.length + 1, ...newCourse }]);
        setNewCourse({ name: "", duration: "" });
      })
      .catch((err) => console.error("Error creating course:", err.message));
  };

  const handleUpdateCourse = (course) => {
    const token = typeof window !== "undefined" && window.localStorage ? localStorage.getItem("token") : null;
    if (!token) return;

    const endpoint =
      user.role === "admin"
        ? `${BASE_URL}/api/admin/courses/${course.id}`
        : `${BASE_URL}/api/instructors/courses/${course.id}`;
    fetch(endpoint, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(course),
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        return res.json();
      })
      .then((updatedCourse) => {
        setCourses(courses.map((c) => (c.id === course.id ? updatedCourse : c)));
        setEditingCourse(null);
      })
      .catch((err) => console.error("Error updating course:", err.message));
  };

  const handleDeleteCourse = (courseId) => {
    const token = typeof window !== "undefined" && window.localStorage ? localStorage.getItem("token") : null;
    if (!token) return;

    const endpoint =
      user.role === "admin"
        ? `${BASE_URL}/api/admin/courses/${courseId}`
        : `${BASE_URL}/api/instructors/courses/${courseId}`;
    fetch(endpoint, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        return res.json();
      })
      .then(() => {
        setCourses(courses.filter((c) => c.id !== courseId));
      })
      .catch((err) => console.error("Error deleting course:", err.message));
  };

  const handleFileUpload = (courseId) => {
    if (!selectedFile) {
      alert("Please select a file to upload.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found. Please log in again.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("courseId", courseId);

    fetch(`${BASE_URL}/api/instructors/upload-course-material`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
      body: formData,
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        alert("File uploaded successfully!");
        setSelectedFile(null); // Clear the selected file
      })
      .catch((err) => console.error("Error uploading file:", err.message));
  };

  if (loading) return <div>Loading courses...</div>;
  if (error) {
    console.error("Error state:", error);
    return <div>Error: {error}</div>;
  }

  const isEditable = user.role === "admin" || user.role === "instructor";

  return (
    <div className="my-courses-container">
      <h2>
        {user.role === "admin"
          ? "All Courses"
          : user.role === "instructor"
          ? "My Courses (Teaching)"
          : "My Enrolled Courses"}
      </h2>
      {user.role === "instructor" && (
        <button onClick={fetchCourses} className="refresh-btn">
          Refresh Student Count
        </button>
      )}
      {isEditable && (
        <div className="course-form">
          <h4>Add New Course</h4>
          <input
            type="text"
            placeholder="Course Name"
            value={newCourse.name}
            onChange={(e) => setNewCourse({ ...newCourse, name: e.target.value })}
          />
          <input
            type="number"
            placeholder="Duration (weeks)"
            value={newCourse.duration}
            onChange={(e) => setNewCourse({ ...newCourse, duration: e.target.value })}
          />
          <button onClick={handleCreateCourse}>Add Course</button>
        </div>
      )}

      {courses.length > 0 ? (
        <table className="courses-table">
          <thead>
            <tr>
              <th>Course Name</th>
              {user.role === "instructor" && <th>Students</th>}
              <th>Published On</th>
              {user.role === "admin" && <th>Instructor</th>}
              {isEditable && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course.id}>
                <td className="course-info">
                  {editingCourse && editingCourse.id === course.id ? (
                    <>
                      <input
                        type="text"
                        value={editingCourse.name}
                        onChange={(e) =>
                          setEditingCourse({ ...editingCourse, name: e.target.value })
                        }
                      />
                      <input
                        type="number"
                        value={editingCourse.duration}
                        onChange={(e) =>
                          setEditingCourse({ ...editingCourse, duration: e.target.value })
                        }
                      />
                      {user.role === "admin" && (
                        <select
                          value={editingCourse.instructor_id || ""}
                          onChange={(e) =>
                            setEditingCourse({
                              ...editingCourse,
                              instructor_id: e.target.value ? parseInt(e.target.value) : null,
                            })
                          }
                        >
                          <option value="">No Instructor</option>
                          {instructors.map((instructor) => (
                            <option key={instructor.id} value={instructor.id}>
                              {instructor.username}
                            </option>
                          ))}
                        </select>
                      )}
                    </>
                  ) : (
                    <div className="course-info-wrapper">
                      <img
                        src={
                          course.image
                            ? `${BASE_URL}${course.image.startsWith('/') ? '' : '/'}${course.image}`
                            : "/images/default.jpg"
                        }
                        alt={course.name}
                        className="my-course-image"
                        onError={(e) => {
                          console.error(`Failed to load image for ${course.name}: ${e.target.src}`);
                          e.target.src = "/images/default.jpg";
                          e.target.onerror = () => {
                            e.target.src = "https://via.placeholder.com/150?text=No+Image";
                          };
                        }}
                      />
                      <span>{course.name}</span>
                    </div>
                  )}
                </td>
                {user.role === "instructor" && (
                  <td>{course.students ? course.students.length : 0}</td>
                )}
                <td>
                  {course.created_at
                    ? new Date(course.created_at).toLocaleDateString()
                    : "N/A"}
                </td>
                {user.role === "admin" && (
                  <td>
                    {instructors.find((i) => i.id === course.instructor_id)?.username || "None"}
                  </td>
                )}
                {isEditable && (
                  <td>
                    {editingCourse && editingCourse.id === course.id ? (
                      <>
                        <button onClick={() => handleUpdateCourse(editingCourse)}>
                          Save
                        </button>
                        <button onClick={() => setEditingCourse(null)}>Cancel</button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => setEditingCourse({ ...course })}>
                          Edit
                        </button>
                        <button onClick={() => handleDeleteCourse(course.id)}>
                          Delete
                        </button>
                        {user.role === "instructor" && (
                          <>
                            <input
                              type="file"
                              id={`file-upload-${course.id}`}
                              style={{ display: "none" }}
                              onChange={(e) => setSelectedFile(e.target.files[0])}
                            />
                            <button
                              onClick={() => handleFileUpload(course.id)}
                              onMouseEnter={() => document.getElementById(`file-upload-${course.id}`).click()}
                            >
                              Upload
                            </button>
                          </>
                        )}
                      </>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No courses available.</p>
      )}
    </div>
  );
};

export default MyCourses;