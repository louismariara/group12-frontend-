import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AddCourses.css";

const AddCourse = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [lectures, setLectures] = useState([]);
  const [imageUrl, setImageUrl] = useState("");
  const [showLectureModal, setShowLectureModal] = useState(false);
  const [lectureTitle, setLectureTitle] = useState("");
  const [lectureDuration, setLectureDuration] = useState("");
  const [lectureUrl, setLectureUrl] = useState("");
  const [lecturePreviewFree, setLecturePreviewFree] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleAddLecture = () => {
    if (!lectureTitle || !lectureDuration || !lectureUrl) {
      alert("Please fill in all required lecture fields!");
      return;
    }
    const newLecture = {
      title: lectureTitle,
      duration: lectureDuration,
      video: lectureUrl,
      previewFree: lecturePreviewFree,
    };
    setLectures([...lectures, newLecture]);
    setLectureTitle("");
    setLectureDuration("");
    setLectureUrl("");
    setLecturePreviewFree(false);
    setShowLectureModal(false);
  };

  const handleDeleteLecture = (index) => {
    setLectures(lectures.filter((_, i) => i !== index));
  };

  const handleAddCourse = async () => {
    if (!title) {
      alert("Please fill in course title!");
      return;
    }

    const token = localStorage.getItem("token");
    let uploadedImageUrl = null;

    
    if (thumbnailFile) {
      const formData = new FormData();
      formData.append("image_file", thumbnailFile); 

      try {
        const uploadResponse = await fetch("https://group12-backend-cv2o.onrender.com/api/admin/courses", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`, 
          },
          body: formData,
        });

        const uploadData = await uploadResponse.json();
        if (uploadResponse.ok) {
          uploadedImageUrl = uploadData.image; 
          setImageUrl(uploadedImageUrl); 
        } else {
          console.error("Upload failed:", uploadData);
          alert("Failed to upload thumbnail!");
          return;
        }
      } catch (err) {
        console.error("Error uploading thumbnail:", err);
        alert("Error uploading thumbnail!");
        return;
      }
    }

 
    const courseData = {
      name: title,
      duration: 4, 
      image: uploadedImageUrl || imageUrl || null, 
      modules: lectures.length > 0 ? [{ title: "Module 1", lectures }] : null,
    };

    try {
      const response = await fetch("https://group12-backend-cv2o.onrender.com/api/admin/courses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify(courseData),
      });

      const data = await response.json();
      if (response.ok) {
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          navigate("/courses");
        }, 2000);
      } else {
        console.error("Error adding course:", data);
        alert("Failed to add course!");
      }
    } catch (err) {
      console.error("Error adding course:", err);
      alert("Error adding course!");
    }
  };

  return (
    <div className="add-course-container">
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
      <div className="lecture-section">
        <h3>Lectures</h3>
        {lectures.length > 0 ? (
          <ul className="lecture-list">
            {lectures.map((lecture, index) => (
              <li key={index}>
                <div className="lecture-item">
                  <div>
                    <strong>{lecture.title}</strong> ({lecture.duration})
                    {lecture.previewFree && " [Preview Free]"}
                    <br />
                    <small>{lecture.video}</small>
                  </div>
                  <button
                    className="delete-lecture-btn"
                    onClick={() => handleDeleteLecture(index)}
                  >
                    ×
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
      <button onClick={handleAddCourse} className="add-btn">
        ADD
      </button>
      {showLectureModal && (
        <div className="lecture-modal">
          <div className="lecture-modal-content">
            <div className="lecture-modal-header">
              <h3>Add Lecture</h3>
              <button
                className="close-modal"
                onClick={() => setShowLectureModal(false)}
              >
                ×
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
              <label>Duration</label>
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