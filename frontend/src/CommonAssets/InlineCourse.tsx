import "./InlineCourse.css";
import { useNavigate } from "react-router-dom";

interface Props {
  id: string;
  title: string;
  author: string;
  rating: number;
  numOfRatings: number;
}

function InlineCourse({ id, title, author, rating, numOfRatings }: Props) {
  const navigate = useNavigate();
  let isOpinion = true;

  console.log("rating: ", rating);
  console.log("numOfRatings: ", numOfRatings);

  if (rating == 0 && numOfRatings == null) {
    isOpinion = false;
  }

  return (
    <div id="inlineCourse" onClick={() => navigate(`/course/${id}`)}>
      <span style={{ maxWidth: "80%" }}>
        {title}
        <br />
        by {author}
      </span>
      <span style={{ maxWidth: "20%" }}>
        {isOpinion ? (
          <div id="inlineCourseRating">
            <img
              src={`/img/star.svg`}
              alt="star"
              style={{ height: "3vh", width: "3vh" }}
            />
            <span style={{ marginLeft: "0.2vw" }}>{rating}</span>
            <span>({numOfRatings})</span>
          </div>
        ) : (
          <span>no ratings</span>
        )}
      </span>
    </div>
  );
}

export default InlineCourse;
