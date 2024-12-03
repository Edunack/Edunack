import "./Recommendations.css";
import "../../CommonAssets/Course";
import Course from "../../CommonAssets/Course";
import Button from "../../CommonAssets/Button";
import { useContext } from "react";
import { MagnificationContext } from "../../main";

function Recommendations() {
  const { magnificationLevel } = useContext(MagnificationContext);

  const applyMagnification = {
    marginTop: `${90 * magnificationLevel}vh`,
  };
  return (
    <div id="recommendationsContainer" style={applyMagnification}>
      <p id="title" className="onTop">
        What's on your mind?
      </p>
      <p id="content" className="onTop">
        <span className="toCenter">
          <svg
            width="3vh"
            height="4vh"
            viewBox="0 0 11 26"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M10 1L1 13L10 25" stroke="white" />
          </svg>
        </span>{" "}
        Sports{" "}
        <span className="toCenter">
          <svg
            width="1vh"
            height="5vh"
            viewBox="0 0 1 36"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <line
              x1="0.5"
              y1="-2.18557e-08"
              x2="0.500002"
              y2="36"
              stroke="#B8B8B8"
            />
          </svg>
        </span>{" "}
        <span id="mainElement">PHP Programming</span>{" "}
        <span className="toCenter">
          <svg
            width="1vh"
            height="5vh"
            viewBox="0 0 1 36"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <line
              x1="0.5"
              y1="-2.18557e-08"
              x2="0.500002"
              y2="36"
              stroke="#B8B8B8"
            />
          </svg>
        </span>{" "}
        Ebroidery{" "}
        <span className="toCenter">
          <svg
            width="3vh"
            height="4vh"
            viewBox="0 0 11 26"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M1 1L10 13L1 25" stroke="white" />
          </svg>
        </span>
      </p>
      <div id="courses">
        <Course
          title="PHP beginner"
          author="TUTORIALER 3248"
          image="../img/codeSeg.jpg"
        />
        <Course
          title="PHP intermediate"
          author="TUTORIALER 3248"
          image="../img/codeSeg.jpg"
        />
        <Course
          title="PHP advanced"
          author="TUTORIALER 3248"
          image="../img/codeSeg.jpg"
        />
      </div>
      <Button
        bgColor="CECECE"
        color="#1E1E1E"
        fontSize="2.75vh"
        fontWeight={500}
        zIndex={4}
        borderRadius="2vh"
      >
        START NOW
      </Button>
    </div>
  );
}

export default Recommendations;
