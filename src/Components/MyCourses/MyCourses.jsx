import React from "react";
import "./MyCourses.css"; // Optional styling

const MyCourses = ({ courses }) => {
  return (
    <div className="my-courses-container">
      <h2>My Courses</h2>
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
              <td className="course-info">
                <div className="course-info-wrapper">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="my-course-image"
                  />
                  <span>{course.title}</span>
                </div>
              </td>
              <td>{course.students}</td>
              <td>{course.publishedDate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MyCourses;