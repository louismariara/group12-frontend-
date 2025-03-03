import { useParams } from "react-router-dom";

const CourseDetails = () => {
  const { id } = useParams();
  const courses = [
    { id: 1, title: "Web Development", description: "Learn HTML, CSS, JS, and React" },
    { id: 2, title: "Python for Beginners", description: "Get started with Python programming" },
  ];

  const course = courses.find(course => course.id === parseInt(id));
 if (!course){
  return <h2>Course not found</h2>
 }
   
  return (
    <div className="">
      <h2>{course?.title}</h2>
      <p>{course?.description}</p>
      <button className="">Enroll Now</button>
    </div>
  );
};

export default CourseDetails;
