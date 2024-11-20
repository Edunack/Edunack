import Course from "../../CommonAssets/Course";
import CourseRank from "../../CommonAssets/CourseRank";
import "./Top3.css";

interface Props {
  courses: any[];
}

function Top3({ courses }: Props) {
  return (
    <div id="top3">
      <div className="top3Courses">
        <Course
          title={courses[1].name.split("|")[0]}
          author={courses[1].author}
          image="./img/codeSeg.jpg"
        />
        <CourseRank
          rank="2."
          type={courses[1].medium}
          link={courses[1].url}
          opinion={
            courses[1].rating == 0 ? "very positive ratings" : "no ratings"
          }
          flexDirection="column"
        />
      </div>
      <div className="top3Courses">
        <Course
          title={courses[0].name.split("|")[0]}
          author={courses[0].author}
          image="./img/codeSeg.jpg"
        />
        <CourseRank
          rank="1."
          type={courses[0].medium}
          link={courses[0].url}
          opinion={
            courses[0].rating == 0 ? "very positive ratings" : "no ratings"
          }
          flexDirection="column"
        />
      </div>
      <div className="top3Courses">
        <Course
          title={courses[2].name.split("|")[0]}
          author={courses[2].author}
          image="./img/codeSeg.jpg"
        />
        <CourseRank
          rank="3."
          type={courses[2].medium}
          link={courses[2].url}
          opinion={
            courses[2].rating == 0 ? "very positive ratings" : "no ratings"
          }
          flexDirection="column"
        />
      </div>
    </div>
  );
}

export default Top3;
