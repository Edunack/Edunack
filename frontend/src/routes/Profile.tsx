import Button from "../CommonAssets/Button";
import Course from "../CommonAssets/Course";
import InlineCoursePremium from "../CommonAssets/InlineCoursePremium";
import InlineCourseContinueMobile from "../CommonAssets/InlineCourseContinueMobile";
import "./Profile.css";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { MagnificationContext } from "../main";

function Profile() {
  const navigate = useNavigate();
  const username = sessionStorage.getItem("username");
  const userId = sessionStorage.getItem("userId");
  const { magnificationLevel } = useContext(MagnificationContext);

  const applyMagnification = {
    marginTop: `${magnificationLevel > 1 ? 2 * magnificationLevel : 0}vh`,
  };

  if (
    username === null ||
    username === undefined ||
    userId === null ||
    userId === undefined
  ) {
    return (
      <div id="noAccount">
        <span>Please log in first</span>
        <Button
          bgColor="#1e1e1e"
          borderRadius="2vh"
          fontSize="5vh"
          onClick={() => navigate("/login")}
        >
          To log in
        </Button>
      </div>
    );
  }
  return (
    <div id="accountContainer">
      <div id="account">
        <div id="accountHeader">
          <span>YOUR ACCOUNT</span>
        </div>
        <div id="accountInfo">
          <div id="userInfo">
            <img src="/img/logo.svg" />
            <span style={{ fontSize: "5vh", fontWeight: "600" }}>
              hi, {username}
            </span>
            <span style={{ fontSize: "2vh" }} id="greeting">
              It's great to see you again
            </span>
          </div>
          <div id="unfinishedCourse" style={applyMagnification}>
            <span>Continue where you left</span>
            <Course
              id="1"
              title="title"
              author="author"
              link="link"
              rating={0}
              numOfRatings={0}
              scale={0.75}
              margin={0}
            />
          </div>
        </div>
        <div
          id="mobileUnfinishedCourse"
          style={{ height: `${25 * magnificationLevel}vh` }}
        >
          <span>jump back to where you left off:</span>
          <div
            id="mobileUnfinishedCourseInfo"
            style={{ height: `${15 * magnificationLevel}vh` }}
          >
            <span>course PHP beginner</span>
            <Button
              bgColor="#90299C"
              borderBottom="5px solid #5A3060"
              borderRadius="10px"
              fontSize="1.75vh"
              width="50%"
              height="6vh"
              padding="0"
              margin="0"
            >
              continue
            </Button>
          </div>
        </div>
        <div id="mobileStartedCourses">
          <span>Courses you started:</span>
          <InlineCourseContinueMobile
            id="1"
            title="title"
            author="author"
            link="https://www.google.com"
          />
          <div className="mobileLine"></div>
          <InlineCourseContinueMobile
            id="1"
            title="title"
            author="author"
            link="https://www.google.com"
          />
          <div className="mobileLine"></div>
          <InlineCourseContinueMobile
            id="1"
            title="title"
            author="author"
            link="https://www.google.com"
          />
        </div>
        <div id="yourCourses">
          <span>the courses you started</span>
          <div id="startedCourses">
            <InlineCoursePremium
              id="1"
              title="title"
              author="author"
              url="google.com"
            />
            <div className="line"></div>
            <InlineCoursePremium
              id="1"
              title="title"
              author="author"
              url="google.com"
            />
            <div className="line"></div>
            <InlineCoursePremium
              id="1"
              title="title"
              author="author"
              url="google.com"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
