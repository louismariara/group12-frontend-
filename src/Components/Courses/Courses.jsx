import { Link } from "react-router-dom";
import React, { useState } from "react";

import './Courses.css';
import course1 from '../../assets/react.jpg';
import course2 from'../../assets/javascript.jpg';
import course3 from'../../assets/node.jpg';
import course4 from'../../assets/css.jpg';
import course5 from '../../assets/python.jpg';
import course6 from '../../assets/algor.png';
import course7 from '../../assets/ccc.jpg';
import course8 from '../../assets/iuu.jpg'

 const initialcourses = [
    { id: 1, title: "React Basics", description: "Learn React from scratch", image: course1 },
    { id: 2, title: "Advanced JavaScript", description: "Deep dive into JS", image: course2 },
    { id: 3, title: "Node.js Fundamentals", description: "Backend with Node.js", image: course3 },
    { id: 4, title: "CSS Mastery", description: "Advanced CSS techniques",image: course4 },
    { id: 5, title: "python Programming", description: "learn python from the basics",image: course5},
    { id: 6, title: "Algorithms", description: "Algorithm design and analysis",image: course6 },
    { id: 7, title: "Advanced C++ Course", description: "master memory management,templates and concurrency",image: course7 },
    { id: 8, title: "UI/UX Design", description: "Design beautiful and user-friendly interfaces",image: course8 }
  
];



const Courses = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [courses, setCourses] = useState(initialcourses);

  const handleAddCourse = () => {
    const newCourse = { id: Date.now(), title: "New Course", description: "Course description" };
    setCourses([...courses, newCourse]);
  };

  const handleDeleteCourse = (id) => {
    setCourses(courses.filter(course => course.id !== id));
  };

  return (
    <div className="courses-container">
      <h1 className="title"> Our Courses</h1>
      {user && user.role === "admin" && (
        <button className="add-course-btn" onClick={handleAddCourse}>Add Course</button>
      )}

    <ul className="course-list">
        {courses.map((course) => (
          <li key={course.id}  className="course-card">

            <img src={course.image} alt={course.title} className="course-image" />
            

            <h3 className="course-title">{course.title}</h3>

            <p className="course-description">{course.description}</p>

            
           <button className="view-course-btn">
           <Link to={`/course/${course.id}`}>
            View Course
            </Link>
            </button>
            

            {user && (user.role === "admin" || user.role === "instructor") && (

            <button className="edit-course-btn">Edit Course</button>
            )}
            {user && user.role === "admin" && (

              <button  className="delete-course-btn" 
               onClick={() => handleDeleteCourse(course.id)}>Delete Course</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Courses;