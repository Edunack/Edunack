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

  if (rating == 0 && numOfRatings == 0) {
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
          <span>no ratings</span>
        ) : (
          <>
            <img src={`/img/star.svg`} alt="star" style={{ width: "8%" }} />
            <span style={{ marginLeft: "0.2vw" }}>{rating}</span>
            <span>({numOfRatings})</span>
          </>
        )}
      </span>
    </div>
  );
}

export default InlineCourse;
