import React from 'react';
import { Link } from "react-router-dom";
import home_img from '../../assets/Home.jpg'
import './Home.css'


const Home = () => {
  return (
    <div className="home-container">
      {/* Content container */}
      <div className="home-content">
        <h1 className="home-h1">Welcome to Bloom Academy</h1>
        <p className="home-p">An online learning platform to help you boost your skills</p>
        <Link to="/courses" className="explore-link">
          <button className="explore-btn">Explore Courses</button>
        </Link>
      </div>

      {/* Image container */}
      <div className="home-image">
        <img src={home_img} alt="Home Image" className="home-logo" />
      </div>
    </div>
  );
};

export default Home;




