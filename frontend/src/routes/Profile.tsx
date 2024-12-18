import Button from "../CommonAssets/Button";
import Course from "../CommonAssets/Course";
import InlineCoursePremium from "../CommonAssets/InlineCoursePremium";
import "./Profile.css";
import { useNavigate } from "react-router-dom";

function Profile() {
  const navigate = useNavigate();
  const username = sessionStorage.getItem("username");
  const userId = sessionStorage.getItem("userId");
  console.log(username, userId);
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
        <div id="accountInfo">
          <div id="userInfo">
            <img src="/img/logo.svg" />
            <span style={{ fontSize: "5vh", fontWeight: "700" }}>
              Hi, {username}
            </span>
            <span style={{ fontSize: "2vh" }}>It's great to see you again</span>
          </div>
          <div id="unfinishedCourse">
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
