import Button from "../CommonAssets/Button";
import Tile from "../CommonAssets/Tile";
import "./CourseDetail.css";
import { useParams } from "react-router-dom";
import { useState } from "react";
import DisqusElement from "./Disqus";

function CourseDetail() {
  const { id } = useParams<{ id: string }>();
  const categoryName = sessionStorage.getItem("categoryName");
  const getCourses = sessionStorage.getItem("category" + categoryName);

  if (!getCourses) {
    return <div>No courses found</div>;
  }

  const courses = JSON.parse(getCourses);
  const course = courses.find((course: any) => course.id === id);

  const [hoveredStarIndex, setHoveredStarIndex] = useState<number | null>(null);
  const stars = Array(5).fill(0);

  if (!course) {
    return <div>Course not found</div>;
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
                {/*<img src="/img/star.svg" alt="star" className="star" />
                <img src="/img/star.svg" alt="star" className="star" />
                <img src="/img/star.svg" alt="star" className="star" />
                <img src="/img/star.svg" alt="star" className="star" />
                <img src="/img/star.svg" alt="star" className="star" />*/}
              </div>
            </Tile>
          </div>
          <div className="courseContent" id="courseLink">
            <div id="urlHolder">
              <p>
                <a href={course.url} target="_blank">
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
