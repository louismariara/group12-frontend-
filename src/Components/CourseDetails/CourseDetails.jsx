import { useParams } from "react-router-dom";
import { useState } from "react";
import './CourseDetails.css';

//import images
import course1 from '../../assets/react.jpg';
import course2 from'../../assets/javascript.jpg';
import course3 from'../../assets/node.jpg';
import course4 from'../../assets/css.jpg';
import course5 from '../../assets/python.jpg';
import course6 from '../../assets/algor.png';
import course7 from '../../assets/ccc.jpg';
import course8 from '../../assets/iuu.jpg'

// Sample courses with full structure
const courses = [
  { 
    id: 1, 
    title: "React Basics", 
    description: "Learn React from scratch.", 
    image: course1, 
    modules: [
      { title: "Introduction to React", lectures: [
          { title: "What is React?", duration: "10 minutes", video: "https://www.youtube.com/embed/s2skans2dP4?si=U6BQLKMBYebujLrj" },
          { title: "JSX ,Components and Props", duration: "21 minutes",video:"https://www.youtube.com/embed/J0yxuHQhpJU?si=jmfSB7YMKPEmcMcQ" },
      ]},
     
    ]
  },
  { 
    id: 2, 
    title: "Advanced JavaScript", 
    description: "Deep dive into JavaScript concepts.", 
    image: course2, 
    modules: [
      { title: "JavaScrip Tutorial", lectures: [
          { title: "Learn JavaScript", duration: "1 hour", video: "https://www.youtube.com/embed/W6NZfCO5SIk?si=tOioA6qxFZ_XJL98" },
          
      ]},
    
    ]
  },
  { 
    id: 3, 
    title: "Node.js Fundamentals", 
    description: "Backend development with Node.js", 
    image: course3, 
    modules: [
      { title: "Introduction to Node.js", lectures: [
          { title: "What is Node.js?", duration: "2 minutes", video: "https://www.youtube.com/embed/q-xS25lsN3I?si=-k3_ex4Obee1fjni" },
          { title: "Setting up a Web Server", duration: "9 minutes", video: "https://www.youtube.com/embed/VShtPwEkDD0?si=VB_tYpPKZSnUllwj"  }
      ]},
    
    ]
  },
  { 
    id: 4, 
    title: "CSS Mastery", 
    description: "Advanced CSS .", 
    image: course4, 
    modules: [
     
      { title: "CSS Animation", lectures: [
          { title: "Learn CSS Animation", duration: "10 minutes", video:"https://www.youtube.com/embed/z2LQYsZhsFw?si=kGcdYaowz4mCaTmZ" },
          
      ]},
    ]
  },
  { 
    id: 5, 
    title: "Python Programming", 
    description: "Learn Python from the basics.", 
    image: course5, 
    modules: [
      { title: "Getting Started with Python", lectures: [
          { title: "Syntax & Variables", duration: "14 minutes", video: "https://www.youtube.com/embed/LKFrQXaoSMQ?si=LIrtnOHqsLpAfM0A" },
          { title: " Functions", duration: "10 minutes", video:"https://www.youtube.com/embed/OnDr4J2UXSA?si=3df7el4bfBki_hmN" }
      ]},
    
    ]
  },
  { 
    id: 6, 
    title: "Algorithms", 
    description: "Algorithm design and analysis.", 
    image: course6, 
    modules: [
      { title: "Sorting Algorithms", lectures: [
          { title: " Quick Sort", duration: "7 minutes", video: "https://www.youtube.com/embed/kFeXwkgnQ9U?si=oDdk6NxPb5zngcRR"  }
      ]},
     
    ]
  },
  { 
    id: 7, 
    title: "Advanced C++ Course", 
    description: "Master memory management, templates, and concurrency.", 
    image: course7, 
    modules: [
      { title: "Memory Management", lectures: [
          { title: "Pointers and References", duration: "12 minutes", video: "/videos/cpp1.mp4" },
          { title: "Dynamic Allocation", duration: "14 minutes", video: "/videos/cpp2.mp4" }
      ]},
      
    ]
  },
  { 
    id: 8, 
    title: "UI/UX Design", 
    description: "Design beautiful and user-friendly interfaces.", 
    image: course8, 
    modules: [
      { title: "UI Principles", lectures: [
          { title: "Color Theory & Typography", duration: "12 minutes", video: "/videos/ui1.mp4" },
          { title: "Designing for Accessibility", duration: "14 minutes", video: "/videos/ui2.mp4" }
      ]},
      
    ]
  }
];

const CourseDetails = () => {
  const { id } = useParams();
  const course = courses.find((course) => course.id === parseInt(id));
  const [expandedModule, setExpandedModule] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null); // Track the selected video

  if (!course) {
    return <h2>Course not found</h2>;
  }

  return (
    <div className="course-box">
      <div className="course-details">
          <div className="course-header">
              <div className="course-info">
                  <h2>{course.title}</h2>
                  <p>{course.description}</p>
              </div>
          </div>

          {/* Display Course Image or Video */}
          <div className="media-container">
              {selectedVideo ? (
                  selectedVideo.includes("youtube") ? (
                      <iframe
                          className="course-video"
                          src={selectedVideo}
                          title="Course Video"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                      ></iframe>
                  ) : (
                      <video className="course-video" controls>
                          <source src={selectedVideo} type="video/mp4" />
                          Your browser does not support the video tag.
                      </video>
                  )
              ) : (
                  <img src={course.image} alt={course.title} className="courses-image" />
              )}
          </div>

          {/* Course Structure */}
          <div className="course-box">
              <h3 className="section-title">Course Structure</h3>
              {course.modules.map((module, index) => (
                  <div key={index} className="module">
                      <h4
                          className={`module-title ${expandedModule === index ? "expanded" : ""}`}
                          onClick={() => setExpandedModule(expandedModule === index ? null : index)}
                      >
                          {module.title} ({module.lectures.length} lectures)
                      </h4>
                      {expandedModule === index && (
                          <div className="lectures">
                              {module.lectures.map((lecture, idx) => (
                                  <div key={idx} className="lecture">
                                      <span className="lecture-title">{lecture.title}</span>
                                      <span className="lecture-duration">{lecture.duration}</span>
                                      <button
                                          className="watch-link"
                                          onClick={() => setSelectedVideo(lecture.video)}
                                      >
                                          Watch
                                      </button>
                                  </div>
                              ))}
                          </div>
                      )}
                  </div>
              ))}
          </div>

          {/* Rating Section */}
          <div className="rating">
              <h4>Rate this Course:</h4>
              ⭐⭐⭐⭐⭐
          </div>
      </div>
      </div>
  );
};

export default CourseDetails;