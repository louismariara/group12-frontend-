import React from 'react';
import './Grades.css'; // Import the CSS file

const Grades = () => {
  const grades = [
    { course: "Web Development", grade: "A" },
    { course: "Python for Beginners", grade: "B+" },
  ];

  return (
    <div className='grades-page'>
    <div className="grades-container">
      <h2 className="grades-title">Your Grades</h2>
      <ul className="grades-list">
        {grades.map((item, index) => (
          <li key={index} className="grade-item">
            <span className="course-name">{item.course}</span>
            <span className="grade-value">{item.grade}</span>
          </li>
        ))}
      </ul>
    </div>
    </div>
  );
};

export default Grades;