import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminPage.css";

const AdminPage = () => {
  const [instructorCount, setInstructorCount] = useState(0);
  const [studentCount, setStudentCount] = useState(0);
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
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user || user.role !== "admin") {
      navigate("/");
      return;
    }

    const token = localStorage.getItem("token");
    // Fetch users
    fetch("http://localhost:5000/api/admin/users", {
      headers: { "Authorization": `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        const instructorsList = data.filter(u => u.role === "instructor");
        const studentsList = data.filter(u => u.role === "student");
        setInstructors(instructorsList);
        setStudents(studentsList);
        setInstructorCount(instructorsList.length);
        setStudentCount(studentsList.length);
      })
      .catch(err => console.error("Error fetching users:", err));

    // Fetch grades
    fetch("http://localhost:5000/api/admin/grades", {
      headers: { "Authorization": `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        return res.json();
      })
      .then(data => setGrades(Array.isArray(data) ? data : []))
      .catch(err => console.error("Error fetching grades:", err));

    // Fetch courses
    fetch("http://localhost:5000/api/courses", {
      headers: { "Authorization": `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setCourses(Array.isArray(data) ? data : []))
      .catch(err => console.error("Error fetching courses:", err));
  }, [navigate, user]);

  const approveInstructor = (userId) => {
    const token = localStorage.getItem("token");
    fetch(`http://localhost:5000/api/admin/users/${userId}/approve-instructor`, {
      method: "PUT",
      headers: { "Authorization": `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        alert(data.message);
        fetch("http://localhost:5000/api/admin/users", {
          headers: { "Authorization": `Bearer ${token}` }
        })
          .then(res => res.json())
          .then(data => {
            const instructorsList = data.filter(u => u.role === "instructor");
            setInstructors(instructorsList);
            setInstructorCount(instructorsList.length);
          });
      })
      .catch(err => console.error("Error approving instructor:", err));
  };

  const handleCreateGrade = () => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:5000/api/admin/grades", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(newGrade)
    })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        return res.json();
      })
      .then(data => {
        setGrades([...grades, { id: data.id, ...newGrade }]);
        setNewGrade({ student_id: "", course_id: "", grade: "" });
      })
      .catch(err => console.error("Error creating grade:", err));
  };

  const handleUpdateGrade = (grade) => {
    const token = localStorage.getItem("token");
    fetch(`http://localhost:5000/api/admin/grades/${grade.id}`, {
      method: "PUT",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(grade)
    })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        return res.json();
      })
      .then(() => {
        setGrades(grades.map(g => (g.id === grade.id ? grade : g)));
        setEditingGrade(null);
      })
      .catch(err => console.error("Error updating grade:", err));
  };

  const handleDeleteGrade = (gradeId) => {
    const token = localStorage.getItem("token");
    fetch(`http://localhost:5000/api/admin/grades/${gradeId}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        setGrades(grades.filter(g => g.id !== gradeId));
      })
      .catch(err => console.error("Error deleting grade:", err));
  };

  if (!user || user.role !== "admin") return null;

  return (
    <div className="admin-page">
      <div className="admin-container">
        <h1 className="admin-title">Admin Dashboard</h1>
        <p className="admin-p">Welcome, <span>{user?.username}</span>. Manage content here.</p>

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
            <p className="stats-count">{courses.length}</p>
          </div>
          <div className="stats-card" onClick={() => setShowGrades(!showGrades)}>
            <h3>Grades</h3>
            <p className="stats-count">{grades.length}</p>
          </div>
        </div>

        {showInstructors && (
          <div>
            <h3>Instructors List</h3>
            <ul>
              {instructors.map(i => (
                <li key={i.id}>
                  {i.username} ({i.email})
                  {i.is_instructor && !i.is_instructor_verified && (
                    <button onClick={() => approveInstructor(i.id)}>Approve as Instructor</button>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}

        {showStudents && (
          <div>
            <h3>Students List</h3>
            <ul>
              {students.map(s => (
                <li key={s.id}>{s.username} ({s.email})</li>
              ))}
            </ul>
          </div>
        )}

        {showCourses && (
          <div>
            <h3>All Courses</h3>
            <ul>
              {courses.map(c => (
                <li key={c.id}>
                  {c.name} (Duration: {c.duration}h, Instructor ID: {c.instructor_id || "None"})
                </li>
              ))}
            </ul>
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
                onChange={e => setNewGrade({ ...newGrade, student_id: e.target.value })}
              />
              <input
                type="number"
                placeholder="Course ID"
                value={newGrade.course_id}
                onChange={e => setNewGrade({ ...newGrade, course_id: e.target.value })}
              />
              <input
                type="text"
                placeholder="Grade"
                value={newGrade.grade}
                onChange={e => setNewGrade({ ...newGrade, grade: e.target.value })}
              />
              <button onClick={handleCreateGrade}>Add Grade</button>
            </div>
            {grades.length > 0 ? (
              <ul>
                {grades.map(g => (
                  <li key={g.id}>
                    {editingGrade && editingGrade.id === g.id ? (
                      <>
                        <input
                          type="number"
                          value={editingGrade.student_id}
                          onChange={e => setEditingGrade({ ...editingGrade, student_id: e.target.value })}
                        />
                        <input
                          type="number"
                          value={editingGrade.course_id}
                          onChange={e => setEditingGrade({ ...editingGrade, course_id: e.target.value })}
                        />
                        <input
                          type="text"
                          value={editingGrade.grade}
                          onChange={e => setEditingGrade({ ...editingGrade, grade: e.target.value })}
                        />
                        <button onClick={() => handleUpdateGrade(editingGrade)}>Save</button>
                        <button onClick={() => setEditingGrade(null)}>Cancel</button>
                      </>
                    ) : (
                      <>
                        Student ID: {g.student_id}, Course: {g.course?.name || g.course_id}, Grade: {g.grade}
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