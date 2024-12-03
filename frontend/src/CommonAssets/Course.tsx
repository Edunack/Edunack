import "./Course.css";
import { useContext } from "react";
import { MagnificationContext } from "../main";

interface Props {
  title: string;
  author: string;
  image: string;
}

function Course({ title, author, image }: Props) {
  const { magnificationLevel } = useContext(MagnificationContext);

  const applyMagnification = {
    height: `${35 * magnificationLevel}vh`,
    width: `${23 * magnificationLevel}vh`,
    margin: `${5 * magnificationLevel}% 0`,
  };

  return (
    <div id="courseContainer" style={applyMagnification}>
      <div style={{ backgroundImage: `url(${image})` }} id="image"></div>
      <div id="blur"></div>
      <div id="info">
        <p>
          <p id="title">{title}</p>
          <br /> course by <br />
          <p id="author">{author}</p>
        </p>
      </div>
    </div>
  );
}

export default Course;
