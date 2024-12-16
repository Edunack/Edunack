import Button from "../CommonAssets/Button";
import Tile from "../CommonAssets/Tile";
import "./CourseDetail.css";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import DisqusElement from "./Disqus";

function CourseDetail() {
  const { id } = useParams<{ id: string }>();
  const categoryName = sessionStorage.getItem("categoryName");
  const getCourses = sessionStorage.getItem("category" + categoryName);
  const [hoveredStarIndex, setHoveredStarIndex] = useState<number | null>(null);
  const [course, setCourse] = useState<any>(null);
  const [courseExists, setCourseExists] = useState<boolean | null>(null);
  const stars = Array(5).fill(0);

  const getCourse = () => {
    fetch(`${window.location.origin}/api/search/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ course: id }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        sessionStorage.setItem("course", JSON.stringify(data));
        setCourse(data);
        setCourseExists(true);
      });
  };

  useEffect(() => {
    if (!getCourses) {
      console.log("Fetching course details...");
      getCourse();
    } else {
      const courses = JSON.parse(getCourses);
      const selectedCourse = courses.find((c: any) => c.id === id);
      setCourse(selectedCourse);
    }
  }, [id, getCourses]);

  useEffect(() => {
    console.log(course);
  }, [course]);

  if (setCourseExists === null) {
    return <div>Loading...</div>;
  } else if (courseExists === false) {
    return <div>Course not found</div>;
  }

  if (!course) {
    return <div>Loading...</div>;
  }

  return (
    <div id="courseDetail">
      <div>
        <p style={{ fontWeight: 400 }} className="courseTitle">
          {course.name}
        </p>
        <p
          style={{ fontWeight: 300, marginBottom: "2vh" }}
          className="courseTitle"
        >
          BY {course.author}
        </p>
        <div id="courseInfoContainer">
          <div className="courseContent">
            <Tile
              bgColor="#56346C"
              border="5px solid #6A4781"
              borderRadius="1vh"
              width="80%"
              height="100%"
              margin="0"
              padding="0"
            >
              <span className="ratingText">user ratings:</span>
              <div id="rating">
                <img src="/img/star.svg" alt="star" className="star" />
                {course.rating}
                <span>(10)</span>
              </div>
              <br />
              <br />
              <span className="ratingText">your rating:</span>
              <div
                id="userRating"
                onMouseLeave={() => setHoveredStarIndex(null)}
              >
                {stars.map((_, index) => (
                  <img
                    key={index}
                    src={
                      hoveredStarIndex !== null && index <= hoveredStarIndex
                        ? "/img/starFull.svg"
                        : "/img/star.svg"
                    }
                    alt="star"
                    className="star"
                    onMouseEnter={() => setHoveredStarIndex(index)}
                  />
                ))}
              </div>
            </Tile>
          </div>
          <div className="courseContent" id="courseLink">
            <div id="urlHolder">
              <p>
                <a href={course.url} target="_blank" rel="noopener noreferrer">
                  {course.url}
                </a>
              </p>
            </div>
            <Button
              bgColor="#412941"
              color="#D8AFD8"
              border="5px solid #7C607C"
              borderRadius="1vh"
              width="100%"
            >
              <a
                style={{ color: "#D8AFD8", textDecoration: "none" }}
                href={course.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                go to course
              </a>
            </Button>
          </div>
        </div>
        <DisqusElement id={course.id} title={course.name} />
      </div>
    </div>
  );
}

export default CourseDetail;
