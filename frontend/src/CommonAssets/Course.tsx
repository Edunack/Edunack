import "./Course.css";

interface Props {
  title: string;
  author: string;
  image: string;
}

function Course({ title, author, image }: Props) {
  return (
    <div id="courseContainer">
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
