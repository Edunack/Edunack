import React from "react";
import InlineCourse from "../../CommonAssets/InlineCourse";
import "./OutsidePodium.css";

interface Props {
  courses: any[];
}

function OutsidePodium({ courses }: Props) {
  console.log(courses);
  return (
    <div id="outside">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        viewBox="0 0 1920 1421"
        preserveAspectRatio="none"
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          top: 0,
          left: 0,
          zIndex: -1,
        }}
      >
        <defs>
          <linearGradient
            id="rankWave"
            x1="881.62"
            y1="550.04"
            x2="938.28"
            y2="1009.34"
            gradientTransform="translate(102.36 1232.78) scale(1 -1)"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset=".19" stop-color="#1e1e1e" />
            <stop offset="1" stop-color="#8c4493" />
          </linearGradient>
        </defs>
        <path
          d="m0,333.42S700.74-168.28,938,59.16c364.67,349.56,982,274.27,982,274.27v1087.58H0V333.42Z"
          fill="url(#rankWave)"
        />
      </svg>
      <GenerateList courses={courses} />
      {/*<div id="courses">
        <InlineCourse
          title="Welcome to PHP"
          author="programming is lajf"
          rank="4."
          type="video"
          price="free"
          opinion="very positive ratings"
        />
        <div className="line"></div>
        <InlineCourse
          title="Welcome to PHP"
          author="programming is lajf"
          rank="5."
          type="video"
          price="free"
          opinion="no ratings"
        />
        <div className="line"></div>
        <InlineCourse
          title="Welcome to PHP"
          author="programming is lajf"
          rank="6."
          type="video"
          price="free"
          opinion="nice ratings"
        />
        <div className="line"></div>
        <InlineCourse
          title="Welcome to PHP"
          author="programming is lajf"
          rank="7."
          type="video"
          price="free"
          opinion="nice ratings"
        />
        <div className="line"></div>
        <InlineCourse
          title="Welcome to PHP"
          author="programming is lajf"
          rank="8."
          type="video"
          price="free"
          opinion="nice ratings"
        />
        <div className="line"></div>
        <InlineCourse
          title="Welcome to PHP"
          author="programming is lajf"
          rank="9."
          type="video"
          price="free"
          opinion="nice ratings"
        />
      </div>*/}
    </div>
  );
}

export default OutsidePodium;

interface ListProps {
  courses: any[];
}

function GenerateList({ courses }: ListProps) {
  const slicedCourses = courses.slice(3);
  return (
    <div id="courses">
      {slicedCourses.map((course, index) => (
        <React.Fragment key={index}>
          <InlineCourse
            title={course.name.split("|")[0]}
            author={course.author}
            rank={index + 4 + "."}
            type={course.medium === 0 ? "web course" : "other medium"}
            price={course.price}
            opinion={
              course.rating === 0 ? "very positive ratings" : course.rating
            }
          />
          {index !== slicedCourses.length - 1 && <div className="line"></div>}
        </React.Fragment>
      ))}
    </div>
  );
}
