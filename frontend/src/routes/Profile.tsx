import Course from "../CommonAssets/Course";
import InlineCoursePremium from "../CommonAssets/InlineCoursePremium";
import "./Profile.css";

function Profile() {
  return (
    <div id="accountContainer">
      <div id="account">
        <div id="accountInfo">
          <div id="userInfo">
            <img src="/img/logo.svg" />
            <span style={{ fontSize: "5vh", fontWeight: "700" }}>Hi, user</span>
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
