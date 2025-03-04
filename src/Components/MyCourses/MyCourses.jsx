import React from "react";
import { Link } from "react-router-dom";
import "./MyCourses.css"; // Ensure this file is included
import cyper_img from '../../assets/cyper.jpeg'

const MyCourses = () => {
  // Dummy data (replace with actual data if needed)
  const courses = [
    {
      id: 1,
      title: "Introduction to Cybersecurity",
      image: cyper_img,
      
      students: 2,
      publishedDate: "1/23/2025",
    },
  ];

  return (
    <div className="my-courses-container">
      <h2 className="page-title">My Courses</h2>
      <div className="table-container">
        <table className="courses-table">
          <thead>
            <tr>
              <th>All Courses</th>
             
              <th>Students</th>
              <th>Published On</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={course.id}>
                <td className="my-course-info">
                  <img src={course.image} alt={course.title} className="my-course-image" />
                  <Link to={`/course/${course.id}`} className="my-course-title">
                    {course.title}
                  </Link>
                </td>
                
                <td>{course.students}</td>
                <td>{course.publishedDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyCourses;