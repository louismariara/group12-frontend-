import { useParams } from "react-router-dom";

const CourseDetails = () => {
  const { id } = useParams();
  const courses = [
    { id: 1, title: "Web Development", description: "Learn HTML, CSS, JS, and React" },
    { id: 2, title: "Python for Beginners", description: "Get started with Python programming" },
  ];

  const course = courses.find(course => course.id === parseInt(id));

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold">{course?.title}</h2>
      <p className="mt-2">{course?.description}</p>
      <button className="bg-green-500 text-white px-4 py-2 mt-4 rounded">Enroll Now</button>
    </div>
  );
};

export default CourseDetails;
