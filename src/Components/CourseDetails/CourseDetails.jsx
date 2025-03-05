import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import './CourseDetails.css';

const CourseDetails = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [expandedModule, setExpandedModule] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch(`http://localhost:5000/api/courses/${id}`, {
      headers: { "Authorization": `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setCourse(data))
      .catch(err => console.error("Error fetching course:", err));
  }, [id]);

  if (!course) {
    return <h2>Loading...</h2>;
  }

  return (
    <div className="course-box">
      <div className="course-details">
        <div className="course-header">
          <div className="course-info">
            <h2>{course.name}</h2>
            {/* No description in backend model */}
          </div>
        </div>
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
            <img src={course.image || "/images/default.png"} alt={course.name} className="courses-image" />
          )}
        </div>
        <div className="course-box">
          <h3 className="section-title">Course Structure</h3>
          {course.modules && course.modules.map((module, index) => (
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
        <div className="rating">
          <h4>Rate this Course:</h4>
          ⭐⭐⭐⭐⭐
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;