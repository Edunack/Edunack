import React from "react";
import InlineCourse from "../../CommonAssets/InlineCourse";
import "./OutsidePodium.css";

function OutsidePodium() {
  return (
    <div id="rankContainer">
      <svg
        id="Warstwa_1"
        data-name="Warstwa 1"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        viewBox="0 0 1920 883.48"
      >
        <defs>
          <linearGradient
            id="Gradient_bez_nazwy_2"
            data-name="Gradient bez nazwy 2"
            x1="952.46"
            y1="735.22"
            x2="991.01"
            y2="294.63"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset=".05" stopColor="#1e1e1e" />
            <stop offset="1" stopColor="#8c4493" />
          </linearGradient>
        </defs>
        <path
          fill="url(#Gradient_bez_nazwy_2)"
          d="m938,73.56C700.74-209.25,0,414.6,0,414.6v468.88h1920v-468.88s-617.33,93.62-982-341.04Z"
        />
      </svg>
      <div id="outside">
        <GenerateList />
      </div>
    </div>
  );
}

export default OutsidePodium;

function GenerateList() {
  const categoryName = sessionStorage.getItem("categoryName");
  const getCourses = sessionStorage.getItem("category" + categoryName);

  if (!getCourses) {
    return <div>No courses found:/</div>;
  }

  const courses = JSON.parse(getCourses);

  const slicedCourses = courses.slice(3);
  return (
    <div id="courses">
      {slicedCourses.map((course: any, index: number) => (
        <React.Fragment key={index}>
          <InlineCourse
            id={course.id}
            title={course.name.split("|")[0]}
            author={course.author}
            rank={index + 4 + "."}
            type={course.medium}
            link={course.url}
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
