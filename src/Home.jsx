import React from 'react';
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-4xl font-bold mb-4">Welcome to Bloom Academy</h1>
      <p className="mb-6 text-gray-600">An online learning platform to boost your skills</p>
      <Link to="/courses" className="bg-blue-500 text-white px-6 py-2 rounded-lg">Explore Courses</Link>
    </div>
  );
};

export default Home;
