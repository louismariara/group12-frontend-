import React, { useState } from "react";

const Courses = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [courses, setCourses] = useState([
    { id: 1, title: "React Basics", description: "Learn React from scratch" },
    { id: 2, title: "Advanced JavaScript", description: "Deep dive into JS" }
  ]);

  const handleAddCourse = () => {
    const newCourse = { id: Date.now(), title: "New Course", description: "Course description" };
    setCourses([...courses, newCourse]);
  };

  const handleDeleteCourse = (id) => {
    setCourses(courses.filter(course => course.id !== id));
  };

  return (
    <div>
      <h1>Courses</h1>
      {user && user.role === "admin" && (
        <button onClick={handleAddCourse}>Add Course</button>
      )}

      <ul>
        {courses.map((course) => (
          <li key={course.id}>
            <h3>{course.title}</h3>
            <p>{course.description}</p>
            <button>View Course</button>
            {user && (user.role === "admin" || user.role === "instructor") && (
              <button>Edit Course</button>
            )}
            {user && user.role === "admin" && (
              <button onClick={() => handleDeleteCourse(course.id)}>Delete Course</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Courses;
