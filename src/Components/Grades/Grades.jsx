import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Grades.css";

const Grades = () => {
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newGrade, setNewGrade] = useState({ student_id: "", course_id: "", grade: "" });
  const [editingGrade, setEditingGrade] = useState(null);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user || (user.role !== "admin" && user.role !== "instructor" && user.role !== "student")) {
      console.log("Redirecting to /: User is not admin, instructor, or student", user);
      navigate("/");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Please log in to view grades");
      setLoading(false);
      return;
    }

    const endpoint =
      user.role === "admin"
        ? "https://group12-backend-cv2o.onrender.com/api/admin/grades"
        : user.role === "instructor"
        ? "https://group12-backend-cv2o.onrender.com/api/instructors/grades"
        : "https://group12-backend-cv2o.onrender.com/api/students/my-grades";

    fetch(endpoint, {
      headers: { "Authorization": `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setGrades(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setError(`Failed to load grades: ${err.message}`);
        setLoading(false);
      });
  }, [navigate, user]);

  const handleCreateGrade = () => {
    const token = localStorage.getItem("token");
    const endpoint =
      user.role === "admin"
        ? "https://group12-backend-cv2o.onrender.com/api/admin/grades"
        : "https://group12-backend-cv2o.onrender.com/api/instructors/grades";
    fetch(endpoint, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newGrade),
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setGrades([...grades, { id: data.id || grades.length + 1, ...newGrade }]);
        setNewGrade({ student_id: "", course_id: "", grade: "" });
      })
      .catch((err) => setError(`Error creating grade: ${err.message}`));
  };

  const handleUpdateGrade = (grade) => {
    const token = localStorage.getItem("token");
    const endpoint =
      user.role === "admin"
        ? `https://group12-backend-cv2o.onrender.com/api/admin/grades/${grade.id}`
        : `https://group12-backend-cv2o.onrender.com/api/instructors/grades/${grade.id}`;
    fetch(endpoint, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(grade),
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        return res.json();
      })
      .then(() => {
        setGrades(grades.map((g) => (g.id === grade.id ? grade : g)));
        setEditingGrade(null);
      })
      .catch((err) => setError(`Error updating grade: ${err.message}`));
  };

  const handleDeleteGrade = (gradeId) => {
    const token = localStorage.getItem("token");
    const endpoint =
      user.role === "admin"
        ? `https://group12-backend-cv2o.onrender.com/api/admin/grades/${gradeId}`
        : `https://group12-backend-cv2o.onrender.com/api/instructors/grades/${gradeId}`;
    fetch(endpoint, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        return res.json();
      })
      .then(() => {
        setGrades(grades.filter((g) => g.id !== gradeId));
      })
      .catch((err) => setError(`Error deleting grade: ${err.message}`));
  };

  if (loading) return <div>Loading grades...</div>;
  if (error) return <div>{error}</div>;

  const isEditable = user.role === "admin" || user.role === "instructor";

  return (
    <div className="grades-container">
      <h1>
        {user.role === "admin"
          ? "All Grades"
          : user.role === "instructor"
          ? "Grades for My Students"
          : "My Grades"}
      </h1>

      {isEditable && (
        <div className="grade-form">
          <h4>Add New Grade</h4>
          <input
            type="number"
            placeholder="Student ID"
            value={newGrade.student_id}
            onChange={(e) => setNewGrade({ ...newGrade, student_id: e.target.value })}
            disabled={user.role === "instructor"} // Instructors can’t set student_id
          />
          <input
            type="number"
            placeholder="Course ID"
            value={newGrade.course_id}
            onChange={(e) => setNewGrade({ ...newGrade, course_id: e.target.value })}
          />
          <input
            type="text"
            placeholder="Grade (e.g., A, B+)"
            value={newGrade.grade}
            onChange={(e) => setNewGrade({ ...newGrade, grade: e.target.value })}
          />
          <button onClick={handleCreateGrade}>Add Grade</button>
        </div>
      )}

      {grades.length > 0 ? (
        <ul>
          {grades.map((g) => (
            <li key={g.id}>
              {editingGrade && editingGrade.id === g.id ? (
                <>
                  <input
                    type="number"
                    value={editingGrade.student_id}
                    onChange={(e) =>
                      setEditingGrade({ ...editingGrade, student_id: e.target.value })
                    }
                    disabled={user.role !== "admin"} // Only admin can edit student_id
                  />
                  <input
                    type="number"
                    value={editingGrade.course_id}
                    onChange={(e) =>
                      setEditingGrade({ ...editingGrade, course_id: e.target.value })
                    }
                  />
                  <input
                    type="text"
                    value={editingGrade.grade}
                    onChange={(e) =>
                      setEditingGrade({ ...editingGrade, grade: e.target.value })
                    }
                  />
                  <button onClick={() => handleUpdateGrade(editingGrade)}>Save</button>
                  <button onClick={() => setEditingGrade(null)}>Cancel</button>
                </>
              ) : (
                <>
                  {user.role === "admin"
                    ? `Student ID: ${g.student_id}, Course ID: ${g.course_id}, Grade: ${g.grade}`
                    : user.role === "instructor"
                    ? `Student ID: ${g.student_id}, Course: ${g.course?.name || "Unknown"}, Grade: ${g.grade}`
                    : `Course: ${g.course?.name || "Unknown"} (ID: ${g.course_id}) - Grade: ${g.grade}`}
                  {isEditable && (
                    <>
                      <button onClick={() => setEditingGrade({ ...g })}>Edit</button>
                      <button onClick={() => handleDeleteGrade(g.id)}>Delete</button>
                    </>
                  )}
                </>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No grades uploaded yet.</p>
      )}
    </div>
  );
};

export default Grades;