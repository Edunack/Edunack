import "./Course.css";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { MagnificationContext } from "../main";
import Button from "./Button";

interface Props {
  id: string;
  title: string;
  author: string;
  link: string;
  rating: number;
  numOfRatings: number;
  scale?: number;
  margin?: number;
}

function Course({
  id,
  title,
  author,
  link,
  rating,
  numOfRatings,
  scale = 1,
  margin = 5,
}: Props) {
  const { magnificationLevel } = useContext(MagnificationContext);
  const navigate = useNavigate();
  let isOpinion = true;

  if (rating == 0 && numOfRatings == 0) {
    isOpinion = false;
  }

  const applyMagnification = {
    height: `${45 * magnificationLevel}vh`,
    width: `${15 * magnificationLevel}vw`,
    margin: `${margin * magnificationLevel}% 0`,
    marginTop: 0,
    zoom: `${scale * magnificationLevel}`,
  };

  return (
    <div id="courseContainer" style={applyMagnification}>
      <div id="mainInfo">
        <span>
          <span style={{ fontWeight: 700 }}>{title}</span>
          <br />
          <span style={{ fontWeight: 100, fontSize: "2vh" }}>by {author}</span>
        </span>
      </div>
      <div id="courseRating">
        {isOpinion ? (
          <span>no ratings</span>
        ) : (
          <>
            <img src={`/img/star.svg`} alt="star" style={{ width: "8%" }} />
            <span style={{ marginLeft: "0.2vw" }}>{rating}</span>
            <span>({numOfRatings})</span>
          </>
        )}
      </div>
      <Button
        bgColor="#412941"
        color="#EBD1EB"
        border="4px solid #8A6B8A"
        borderRadius="1vh"
        width="85%"
        height="15%"
        padding="0"
        margin="0"
        onClick={() => navigate(`/course/${id}`)}
      >
        more about
      </Button>
      <Button
        bgColor="#241824"
        color="#EBD1EB"
        border="4px solid #594659"
        borderRadius="1vh"
        width="85%"
        height="15%"
        padding="0"
        margin="0"
        onClick={() => window.open(link, "_blank")}
      >
        start now
      </Button>
    </div>
  );
}

export default Course;
