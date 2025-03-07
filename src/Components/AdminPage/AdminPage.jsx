import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminPage.css";

const AdminPage = () => {
  const [instructorCount, setInstructorCount] = useState(0);
  const [studentCount, setStudentCount] = useState(0);
  const [courseCount, setCourseCount] = useState(0); // Added
  const [gradeCount, setGradeCount] = useState(0);   // Added
  const [instructors, setInstructors] = useState([]);
  const [students, setStudents] = useState([]);
  const [grades, setGrades] = useState([]);
  const [courses, setCourses] = useState([]);
  const [showInstructors, setShowInstructors] = useState(false);
  const [showStudents, setShowStudents] = useState(false);
  const [showCourses, setShowCourses] = useState(false);
  const [showGrades, setShowGrades] = useState(false);
  const [newGrade, setNewGrade] = useState({ student_id: "", course_id: "", grade: "" });
  const [editingGrade, setEditingGrade] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    console.log("User from localStorage:", user);
    if (!user || user.role !== "admin") {
      console.log("Redirecting to / due to no user or not admin");
      navigate("/");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setError("No token found. Please log in again.");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const [usersRes, gradesRes, coursesRes] = await Promise.all([
          fetch("http://localhost:5000/api/admin/users", {
            headers: { "Authorization": `Bearer ${token}` },
          }).then((res) => res.json()),
          fetch("http://localhost:5000/api/admin/grades", {
            headers: { "Authorization": `Bearer ${token}` },
          }).then((res) => res.json()),
          fetch("http://localhost:5000/api/admin/courses", {
            headers: { "Authorization": `Bearer ${token}` },
          }).then((res) => res.json()),
        ]);

        // Users
        const instructorsList = usersRes.filter((u) => u.role === "instructor");
        const studentsList = usersRes.filter((u) => u.role === "student");
        setInstructors(instructorsList);
        setStudents(studentsList);
        setInstructorCount(instructorsList.length);
        setStudentCount(studentsList.length);

        // Grades
        setGrades(Array.isArray(gradesRes) ? gradesRes : []);
        setGradeCount(Array.isArray(gradesRes) ? gradesRes.length : 0);

        // Courses
        setCourses(Array.isArray(coursesRes) ? coursesRes : []);
        setCourseCount(Array.isArray(coursesRes) ? coursesRes.length : 0);

        setLoading(false);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(`Error fetching data: ${err.message}`);
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate, user]);

  const approveInstructor = (userId) => {
    const token = localStorage.getItem("token");
    fetch(`http://localhost:5000/api/admin/users/${userId}/approve-instructor`, {
      method: "PUT",
      headers: { "Authorization": `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        alert(data.message);
        fetch("http://localhost:5000/api/admin/users", {
          headers: { "Authorization": `Bearer ${token}` },
        })
          .then((res) => res.json())
          .then((data) => {
            const instructorsList = data.filter((u) => u.role === "instructor");
            setInstructors(instructorsList);
            setInstructorCount(instructorsList.length);
          });
      })
      .catch((err) => setError(`Error approving instructor: ${err.message}`));
  };

  const handleCreateGrade = () => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:5000/api/admin/grades", {
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
        setGrades([...grades, { id: data.id, ...newGrade }]);
        setGradeCount(gradeCount + 1);
        setNewGrade({ student_id: "", course_id: "", grade: "" });
      })
      .catch((err) => setError(`Error creating grade: ${err.message}`));
  };

  const handleUpdateGrade = (grade) => {
    const token = localStorage.getItem("token");
    fetch(`http://localhost:5000/api/admin/grades/${grade.id}`, {
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
    fetch(`https://group12-backend-cv2o.onrender.com/api/admin/grades/${gradeId}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        return res.json();
      })
      .then(() => {
        setGrades(grades.filter((g) => g.id !== gradeId));
        setGradeCount(gradeCount - 1);
      })
      .catch((err) => setError(`Error deleting grade: ${err.message}`));
  };

  if (loading) return <div>Loading admin data...</div>;

  return (
    <div className="admin-page">
      <div className="admin-container">
        <h1 className="admin-title">Admin Dashboard</h1>
        <p className="admin-p">
          Welcome, <span>{user?.username || "Admin"}</span>. Manage content here.
        </p>
        {error && <p className="error">{error}</p>}

        <div className="stats-container">
          <div className="stats-card" onClick={() => setShowInstructors(!showInstructors)}>
            <h3>Instructors</h3>
            <p className="stats-count">{instructorCount}</p>
          </div>
          <div className="stats-card" onClick={() => setShowStudents(!showStudents)}>
            <h3>Students</h3>
            <p className="stats-count">{studentCount}</p>
          </div>
          <div className="stats-card" onClick={() => setShowCourses(!showCourses)}>
            <h3>Courses</h3>
            <p className="stats-count">{courseCount}</p>
          </div>
          <div className="stats-card" onClick={() => setShowGrades(!showGrades)}>
            <h3>Grades</h3>
            <p className="stats-count">{gradeCount}</p>
          </div>
        </div>

        {showInstructors && (
          <div>
            <h3>Instructors List</h3>
            {instructors.length > 0 ? (
              <ul>
                {instructors.map((i) => (
                  <li key={i.id}>
                    {i.username} ({i.email})
                    {!i.is_instructor_verified && (
                      <button onClick={() => approveInstructor(i.id)}>
                        Approve as Instructor
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No instructors available.</p>
            )}
          </div>
        )}

        {showStudents && (
          <div>
            <h3>Students List</h3>
            {students.length > 0 ? (
              <ul>
                {students.map((s) => (
                  <li key={s.id}>{s.username} ({s.email})</li>
                ))}
              </ul>
            ) : (
              <p>No students available.</p>
            )}
          </div>
        )}

        {showCourses && (
          <div>
            <h3>All Courses</h3>
            {courses.length > 0 ? (
              <ul>
                {courses.map((c) => (
                  <li key={c.id}>
                    {c.name} (Duration: {c.duration}h, Instructor ID: {c.instructor_id || "None"})
                  </li>
                ))}
              </ul>
            ) : (
              <p>No courses available.</p>
            )}
          </div>
        )}

        {showGrades && (
          <div>
            <h3>All Grades</h3>
            <div className="grade-form">
              <h4>Add New Grade</h4>
              <input
                type="number"
                placeholder="Student ID"
                value={newGrade.student_id}
                onChange={(e) => setNewGrade({ ...newGrade, student_id: e.target.value })}
              />
              <input
                type="number"
                placeholder="Course ID"
                value={newGrade.course_id}
                onChange={(e) => setNewGrade({ ...newGrade, course_id: e.target.value })}
              />
              <input
                type="text"
                placeholder="Grade"
                value={newGrade.grade}
                onChange={(e) => setNewGrade({ ...newGrade, grade: e.target.value })}
              />
              <button onClick={handleCreateGrade}>Add Grade</button>
            </div>
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
                        Student ID: {g.student_id}, Course ID: {g.course_id}, Grade: {g.grade}
                        <button onClick={() => setEditingGrade({ ...g })}>Edit</button>
                        <button onClick={() => handleDeleteGrade(g.id)}>Delete</button>
                      </>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No grades available.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPage;