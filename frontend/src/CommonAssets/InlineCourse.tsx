import "./InlineCourse.css";
import { useNavigate } from "react-router-dom";

interface Props {
  id: string;
  title: string;
  author: string;
  rank: string;
  type: string;
  link: string;
  opinion: string;
}

function InlineCourse({ id, title, author, rank, type, link, opinion }: Props) {
  const navigate = useNavigate();
  return (
    <div id="inlineCourse" onClick={() => navigate(`/course/${id}`)}>
      <span style={{ fontSize: "5vh" }}>{rank}</span>
      <span>
        {title}
        <br />
        by {author}
      </span>
      <span>{type}</span>
      <span>
        <a href={link} id="link" target="_blank">
          see course
        </a>
      </span>
      <span>{opinion}</span>
    </div>
  );
}

export default InlineCourse;
