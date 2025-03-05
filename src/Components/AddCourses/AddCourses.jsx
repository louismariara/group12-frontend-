import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AddCourses.css"; // For styling

const AddCourse = ({ courses, setCourses }) => {
  const navigate = useNavigate();

  // Course fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  
  const [thumbnailFile, setThumbnailFile] = useState(null);

  // Lecture modal
  const [lectures, setLectures] = useState([]);
  const [showLectureModal, setShowLectureModal] = useState(false);

  // Fields for a single lecture
  const [lectureTitle, setLectureTitle] = useState("");
  const [lectureDuration, setLectureDuration] = useState("");
  const [lectureUrl, setLectureUrl] = useState("");
  const [lecturePreviewFree, setLecturePreviewFree] = useState(false);

  // Success notification
  const [showSuccess, setShowSuccess] = useState(false);

  // Add Lecture
  const handleAddLecture = () => {
    if (!lectureTitle || !lectureDuration || !lectureUrl) {
      alert("Please fill in all required lecture fields!");
      return;
    }
    const newLecture = {
      id: lectures.length + 1,
      title: lectureTitle,
      duration: lectureDuration,
      url: lectureUrl,
      previewFree: lecturePreviewFree,
    };
    setLectures([...lectures, newLecture]);

    // Clear modal fields
    setLectureTitle("");
    setLectureDuration("");
    setLectureUrl("");
    setLecturePreviewFree(false);
    setShowLectureModal(false);
  };

  // Delete a single lecture
  const handleDeleteLecture = (lectureId) => {
    setLectures(lectures.filter((lec) => lec.id !== lectureId));
  };

  // Final Add (publish) course
  const handleAddCourse = () => {
    if (!title || !description) {
      alert("Please fill in course title and description!");
      return;
    }
    // Build the new course object
    const newCourse = {
      id: courses.length + 1,
      title,
      description,
     
      image: thumbnailFile
        ? URL.createObjectURL(thumbnailFile)
        : "/images/default.png",
      lectures,
     students:1,
      publishedDate: new Date().toLocaleDateString(),
    };

    // Update global courses
    setCourses([...courses, newCourse]);

    // Show success notification
    setShowSuccess(true);

    // Hide notification after 2 seconds and navigate to /courses
    setTimeout(() => {
      setShowSuccess(false);
      navigate("/courses");
    }, 2000);
  };

  return (
    <div className="add-course-container">
      {/* Success Notification */}
      {showSuccess && (
        <div className="success-notification">
          <span>Course Added</span>
        </div>
      )}

      <h2>Add Course</h2>

      <div className="input-group">
        <label>Course Title</label>
        <input
          type="text"
          placeholder="Enter course title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div className="input-group">
        <label>Course Description</label>
        <textarea
          placeholder="Enter course description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      

      <div className="input-group">
        <label>Course Thumbnail</label>
        <input
          type="file"
          onChange={(e) => setThumbnailFile(e.target.files[0])}
        />
      </div>

      {/* Lectures Section */}
      <div className="lecture-section">
        <h3>Lectures</h3>
        {lectures.length > 0 ? (
          <ul className="lecture-list">
            {lectures.map((lecture) => (
              <li key={lecture.id}>
                <div className="lecture-item">
                  <div>
                    <strong>{lecture.title}</strong> ({lecture.duration} minutes)
                    {lecture.previewFree && " [Preview Free]"}
                    <br />
                    <small>{lecture.url}</small>
                  </div>
                  <button
                    className="delete-lecture-btn"
                    onClick={() => handleDeleteLecture(lecture.id)}
                  >
                    &times;
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No lectures added yet.</p>
        )}
        <button
          className="add-lecture-btn"
          onClick={() => setShowLectureModal(true)}
        >
          + Add Lecture
        </button>
      </div>

      {/* Publish Course Button */}
      <button onClick={handleAddCourse} className="add-btn">
        ADD
      </button>

      {/* Lecture Modal */}
      {showLectureModal && (
        <div className="lecture-modal">
          <div className="lecture-modal-content">
            <div className="lecture-modal-header">
              <h3>Add Lecture</h3>
              <button
                className="close-modal"
                onClick={() => setShowLectureModal(false)}
              >
                &times;
              </button>
            </div>

            <div className="input-group">
              <label>Lecture Title</label>
              <input
                type="text"
                placeholder="Enter lecture title"
                value={lectureTitle}
                onChange={(e) => setLectureTitle(e.target.value)}
              />
            </div>

            <div className="input-group">
              <label>Duration (minutes)</label>
              <input
                type="text"
                placeholder="Enter lecture duration"
                value={lectureDuration}
                onChange={(e) => setLectureDuration(e.target.value)}
              />
            </div>

            <div className="input-group">
              <label>Lecture URL</label>
              <input
                type="text"
                placeholder="Enter lecture URL"
                value={lectureUrl}
                onChange={(e) => setLectureUrl(e.target.value)}
              />
            </div>

            <div className="input-group checkbox-group">
              <label>Preview Free?</label>
              <input
                type="checkbox"
                checked={lecturePreviewFree}
                onChange={(e) => setLecturePreviewFree(e.target.checked)}
              />
            </div>

            <div className="modal-buttons">
              <button onClick={handleAddLecture} className="modal-add-btn">
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddCourse;