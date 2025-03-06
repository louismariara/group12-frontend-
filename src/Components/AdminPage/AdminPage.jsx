import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminPage.css";

const AdminPage = () => {
  const [instructorCount, setInstructorCount] = useState(0);
  const [studentCount, setStudentCount] = useState(0);
  const [instructors, setInstructors] = useState([]);
  const [students, setStudents] = useState([]);
  const [grades, setGrades] = useState([]);
  const [courses, setCourses] = useState([]); // Add courses state
  const [showInstructors, setShowInstructors] = useState(false);
  const [showStudents, setShowStudents] = useState(false);
  const [showCourses, setShowCourses] = useState(false); // Toggle for courses
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
      .then(res => res.json())
      .then(data => setGrades(data))
      .catch(err => console.error("Error fetching grades:", err));

    // Fetch all courses
    fetch("http://localhost:5000/api/courses", {
      headers: { "Authorization": `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setCourses(data);
        else console.error("Courses data is not an array:", data);
      })
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

        <div>
          <h3>All Grades</h3>
          <ul>
            {grades.map(g => (
              <li key={g.id}>
                Student ID: {g.student_id}, Course: {g.course?.name || g.course_id}, Grade: {g.grade}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;