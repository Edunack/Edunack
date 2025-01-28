import "./FullRanking.css";
import React from "react";
import InlineCourseMobile from "../../CommonAssets/InlineCourseMobile";
import Loading from "../../CommonAssets/Loading";

interface Props {
  isDataFetched: boolean | null;
}

function FullRanking({ isDataFetched }: Props) {
  return (
    <div id="mobileCourseContainer">
      <GenerateList isDataFetched={isDataFetched} />
    </div>
  );
}

export default FullRanking;

interface Category {
  isDataFetched: boolean | null;
}

function GenerateList({ isDataFetched }: Category) {
  const categoryName = sessionStorage.getItem("categoryName");
  const getCourses = sessionStorage.getItem("category" + categoryName);

  if (!getCourses) {
    if (isDataFetched === null) {
      return <Loading />;
    } else if (isDataFetched === false) {
      return <div>No courses found:/</div>;
    }
  }

  if (getCourses !== null) {
    const courses = JSON.parse(getCourses);

    const slicedCourseName = (course: string) => {
      course = course.split("|")[0];
      let courseName = course.split("");
      if (courseName.length > 30) {
        courseName = courseName.slice(0, 30);
        courseName.push(" ...");
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
}
