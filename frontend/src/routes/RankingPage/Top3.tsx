import Course from "../../CommonAssets/Course";
import Loading from "../../CommonAssets/Loading";
import { useContext } from "react";
import { MagnificationContext } from "../../main";
import "./Top3.css";

interface Props {
  isDataFetched: boolean | null;
}

function Top3({ isDataFetched }: Props) {
  const categoryName = sessionStorage.getItem("categoryName");
  const getCourses = sessionStorage.getItem("category" + categoryName);
  const { magnificationLevel } = useContext(MagnificationContext);

  const applyMagnification = {
    gap: `${
      magnificationLevel > 1
        ? 20 / (magnificationLevel * 2)
        : 20 * magnificationLevel
    }vw`,
  };

  if (!getCourses) {
    if (isDataFetched === null) {
      return <Loading />;
    } else if (isDataFetched === false) {
      return <div>No courses found:/</div>;
    }
  }

  if (getCourses !== null) {
    const courses = JSON.parse(getCourses);

    return (
      <div id="top3" style={applyMagnification}>
        <div className="top3Courses">
          <Course
            id={courses[1].id}
            title={courses[1].name.split("|")[0]}
            author={courses[1].author}
            link={courses[1].url}
            rating={courses[1].rating}
            numOfRatings={courses[1].rating_count}
          />
        </div>
        <div className="top3Courses">
          <Course
            id={courses[0].id}
            title={courses[0].name.split("|")[0]}
            author={courses[0].author}
            link={courses[0].url}
            rating={courses[0].rating}
            numOfRatings={courses[0].rating_count}
          />
        </div>
        <div className="top3Courses">
          <Course
            id={courses[2].id}
            title={courses[2].name.split("|")[0]}
            author={courses[2].author}
            link={courses[2].url}
            rating={courses[2].rating}
            numOfRatings={courses[2].rating_count}
          />
        </div>
      </div>
    );
  }
}

export default Top3;
