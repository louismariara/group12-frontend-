import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Componenets/Home/Home";
import Navbar from "./Componenets/Navbar/Navbar";
import Login from "./Componenets/Login/Login";
import Signup from "./Componenets/signup/Signup";
import Grades from "./Componenets/Grades/Grades";
import Courses from "./Componenets/Courses/Courses";
import AdminPage from "./Componenets/AdminPage/AdminPage";
import CourseDetails from "./Componenets/CourseDetails/CourseDetails";

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} /> 
        <Route path="/Login" element={<Login setUser={setUser} />} />
        <Route path="/signup" element={<Signup setUser={setUser} />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/grades" element={<Grades />} />
        <Route path="/courses/:id" element={<CourseDetails />} />
      </Routes>
    </Router>
  );
};

export default App;
