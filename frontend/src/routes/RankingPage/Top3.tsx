import Course from "../../CommonAssets/Course";
import CourseRank from "../../CommonAssets/CourseRank";
import "./Top3.css";

function Top3() {
  return (
    <div id="top3">
      <div className="top3Courses">
        <Course
          title="PHP beginner"
          author="TUTORIALER 3248"
          image="./img/codeSeg.jpg"
        />
        <CourseRank
          rank="2."
          type="web course"
          price="free"
          opinion="very positive ratings"
          flexDirection="column"
        />
      </div>
      <div className="top3Courses">
        <Course
          title="PHP beginner"
          author="TUTORIALER 3248"
          image="./img/codeSeg.jpg"
        />
        <CourseRank
          rank="1."
          type="web course"
          price="free"
          opinion="very positive ratings"
          flexDirection="column"
        />
      </div>
      <div className="top3Courses">
        <Course
          title="PHP beginner"
          author="TUTORIALER 3248"
          image="./img/codeSeg.jpg"
        />
        <CourseRank
          rank="3."
          type="web course"
          price="30$"
          opinion="very positive ratings"
          flexDirection="column"
        />
      </div>
    </div>
  );
}

export default Top3;
