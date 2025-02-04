import Button from "../CommonAssets/Button";
import Tile from "../CommonAssets/Tile";
import "./CourseDetail.css";
import { useParams } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import DisqusElement from "./Disqus";
import Loading from "../CommonAssets/Loading";
import { MagnificationContext } from "../main";

function CourseDetail() {
  const { id } = useParams<{ id: string }>();
  const categoryName = sessionStorage.getItem("categoryName");
  const getCourses = sessionStorage.getItem("category" + categoryName);
  const [hoveredStarIndex, setHoveredStarIndex] = useState<number | null>(null);
  const [course, setCourse] = useState<any>(null);
  const [courseExists, setCourseExists] = useState<boolean | null>(null);
  const stars = Array(5).fill(0);
  const isMobile = window.innerWidth <= 768;
  const { magnificationLevel } = useContext(MagnificationContext);

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
      })
      .catch((error) => {
        console.log(error);
        setCourseExists(false);
      });
  };

  useEffect(() => {
    if (!getCourses) {
      console.log("Fetching course details...");
      getCourse();
    } else {
      console.log("Using cached course details...");
      const courses = JSON.parse(getCourses);
      const selectedCourse = courses.find((c: any) => c.id === id);
      if (selectedCourse) {
        setCourse(selectedCourse);
        setCourseExists(true);
      } else {
        getCourse();
      }
    }
  }, [id, getCourses]);

  useEffect(() => {
    console.log(course);
  }, [course]);

  if (courseExists === null) {
    return <Loading />;
  } else if (courseExists === false) {
    return <div>Course not found</div>;
  }

  const handleStarClick = (index: number) => {
    const userId = sessionStorage.getItem("userId");
    if (!userId) {
      return alert("You must be logged in to rate courses");
    }

    if (hoveredStarIndex !== null) {
      fetch("/api/rating/" + id, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ rating: Number(index + 1) }),
      }).then(() => {
        alert("Rating submitted!");
      });
    }
  };

  return (
    <div id="courseDetail">
      <div id="courseDetailContainer">
        <div id="courseDetailTitle">
          <span>PREVIEW COURSE</span>
        </div>
        <div id="courseDetailHeader">
          <p
            style={{ fontWeight: 400 }}
            className="courseTitle"
            id="courseDetailName"
          >
            {course.name}
          </p>
          <p
            style={{ fontWeight: 300, marginBottom: "2vh" }}
            className="courseTitle"
            id="courseDetailAuthor"
          >
            BY {course.author}
          </p>
        </div>
        <div id="mobileCourseRaitingInfo">
          <span>other people rated this course:</span>
          <div id="mobileCourseRaiting">
            <svg
              width="35"
              height="32"
              viewBox="0 0 35 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M17.998 5L21.075 13.4033H29.998L22.6134 18.6757L25.4145 27L17.998 20.9193L10.5816 27L13.3827 17.7838L5.99805 13.4033H15.2288L17.998 5Z"
                fill="#EBD2FF"
                stroke="#EBD2FF"
                stroke-width="3"
              />
            </svg>
            <span>{course.rating}</span>
            {
              (course.numOfRatings =
                0 || course.numOfRatings == null ? (
                  <span>(0)</span>
                ) : (
                  <span>({course.numOfRatings})</span>
                ))
            }
          </div>
          <span>your rating:</span>
          <div
            id="mobileUserRating"
            onMouseLeave={() => setHoveredStarIndex(null)}
          >
            {stars.map((_, index) =>
              hoveredStarIndex !== null && index <= hoveredStarIndex ? (
                <svg
                  width="35"
                  height="32"
                  viewBox="0 0 35 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="star"
                  onMouseEnter={() => setHoveredStarIndex(index)}
                  onClick={() => handleStarClick(index)}
                >
                  <path
                    d="M17.998 5L21.075 13.4033H29.998L22.6134 18.6757L25.4145 27L17.998 20.9193L10.5816 27L13.3827 17.7838L5.99805 13.4033H15.2288L17.998 5Z"
                    fill="#EBD2FF"
                    stroke="#EBD2FF"
                    stroke-width="3"
                  />
                </svg>
              ) : (
                <svg
                  width="36"
                  height="32"
                  viewBox="0 0 36 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="star"
                  onMouseEnter={() => setHoveredStarIndex(index)}
                  onClick={() => handleStarClick(index)}
                >
                  <path
                    d="M18.2341 5L21.371 13.3933H30.4682L22.9395 18.6595L25.7952 26.974L18.2341 20.9005L10.673 26.974L13.5287 17.7687L6 13.3933H15.4108L18.2341 5Z"
                    stroke="#EBD2FF"
                    stroke-width="3"
                  />
                </svg>
              )
            )}
          </div>
        </div>
        <div
          id="courseDetailButtons"
          style={{ height: `${22 * magnificationLevel}vh` }}
        >
          <Button
            bgColor="#90299C"
            borderBottom="5px solid #5A3060"
            borderRadius="10px"
            fontSize="1.75vh"
            width="50%"
            height={`${6 * magnificationLevel}vh`}
            padding="0"
            margin="0"
            onClick={() => window.open(course.url, "_blank")}
          >
            go to course
          </Button>
          <Button
            bgColor="#90299C"
            borderBottom="5px solid #5A3060"
            borderRadius="10px"
            fontSize="1.75vh"
            width="50%"
            height={`${6 * magnificationLevel}vh`}
            padding="0"
            margin="0"
          >
            add to your courses
          </Button>
        </div>
        <div id="mobileDisqusPointer">
          <span>See discussion</span>
          <svg
            width="13"
            height="22"
            viewBox="0 0 13 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <line x1="6.28906" x2="6.28906" y2="12.1579" stroke="#90429C" />
            <line
              x1="0.353553"
              y1="15.2778"
              x2="6.72197"
              y2="21.6462"
              stroke="#90429C"
            />
            <line
              y1="-0.5"
              x2="9.00631"
              y2="-0.5"
              transform="matrix(-0.707107 0.707107 0.707107 0.707107 12.7363 15.6313)"
              stroke="#90429C"
            />
          </svg>
        </div>
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
                <span>{course.numOfRatings}</span>
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
                    onClick={() => handleStarClick(index)}
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
              onClick={() => window.open(course.url, "_blank")}
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
        <DisqusElement
          id={course.id}
          title={course.name}
          width={isMobile ? "80%" : "100%"}
        />
      </div>
    </div>
  );
}

export default CourseDetail;
