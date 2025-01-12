import "./FullRanking.css";
import React from "react";
import InlineCourseMobile from "../../CommonAssets/InlineCourseMobile";

function FullRanking() {
  return (
    <div id="mobileCourseContainer">
      <GenerateList />
    </div>
  );
}

export default FullRanking;

function GenerateList() {
  const categoryName = sessionStorage.getItem("categoryName");
  const getCourses = sessionStorage.getItem("category" + categoryName);

  if (!getCourses) {
    return <div>No courses found:/</div>;
  }

  const courses = JSON.parse(getCourses);

  const slicedCourseName = (course: string) => {
    course = course.split("|")[0];
    let courseName = course.split("");
    if (courseName.length > 30) {
      courseName = courseName.slice(0, 30);
      courseName.push("...");
    }
    return courseName.join("");
  };

  return (
    <div id="mobileCourses">
      {courses.map((course: any, index: number) => (
        <React.Fragment key={index}>
          <InlineCourseMobile
            id={course.id}
            title={slicedCourseName(course.name)}
            rating={course.rating}
            numOfRatings={course.rating_count}
          />
        </React.Fragment>
      ))}
    </div>
  );
}
