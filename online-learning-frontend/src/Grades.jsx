import React from 'react';
const Grades = () => {
    const grades = [
      { course: "Web Development", grade: "A" },
      { course: "Python for Beginners", grade: "B+" },
    ];
  
    return (
      <div className="p-6">
        <h2 className="text-3xl font-bold">Your Grades</h2>
        <ul className="mt-4">
          {grades.map((item, index) => (
            <li key={index} className="border p-4 my-2">
              {item.course}: <strong>{item.grade}</strong>
            </li>
          ))}
        </ul>
      </div>
    );
  };
  
  export default Grades;
  