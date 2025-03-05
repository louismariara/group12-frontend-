import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Components/Home/Home";
import Navbar from "./Components/Navbar/Navbar";
import Login from "./Components/Login/Login";
import Signup from "./Components/signup/Signup";
import Grades from "./Components/Grades/Grades";
import Courses from "./Components/Courses/Courses";
import AdminPage from "./Components/AdminPage/AdminPage";
import CourseDetails from "./Components/CourseDetails/CourseDetails";
import MyCourses from "./Components/MyCourses/MyCourses";
import AddCourses from "./Components/AddCourses/AddCourses";


// IMPORTANT: import your AddCourse component

const App = () => {
  // 1) Store logged-in user (from localStorage or wherever)
  const [user, setUser] = useState(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    return storedUser || null;
  });

  // 2) Store courses in state
  const [courses, setCourses] = useState([
    // Optional: add a sample course or leave empty
    // {
    //   id: 1,
    //   title: "Intro to Cybersecurity",
    //   description: "Basics of cybersecurity.",
    //   image: "/images/cyber.jpg",
    //   earnings: 100,
    //   students: 50,
    //   publishedDate: "03/08/2025",
    // },
  ]);
const AddCourse =(newCourse)=>{
  setCourses([...courses, newCourse]);
};

  useEffect(() => {
    // If you need to fetch user/courses from an API, do it here
    // setUser(...), setCourses(...)
  }, []);

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} /> 
        <Route path="/Login" element={<Login setUser={setUser} />} />
        <Route path="/signup" element={<Signup setUser={setUser} />} />
        <Route path="/courses" element={<Courses  courses={courses} />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/grades" element={<Grades />} />
        <Route path="/course/:id" element={<CourseDetails />} />
        <Route path="/my-courses" element={<MyCourses courses={courses}  />} />
        <Route path="/add-courses" element={<AddCourses courses={courses} setCourses={setCourses}/>} />
      
        
      </Routes>
    </Router>
  );
};

export default App;
