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
        <Route path="/course/:id" element={<CourseDetails />} />
      </Routes>
    </Router>
  );
};

export default App;
