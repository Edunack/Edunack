import "./InlineCoursePremium.css";
import { useNavigate, Link } from "react-router-dom";

interface Props {
  id: string;
  title: string;
  author: string;
  url: string;
}

function InlineCoursePremium({ id, title, author, url }: Props) {
  const navigate = useNavigate();

  return (
    <div id="inlineCoursePremium" onClick={() => navigate(`/course/${id}`)}>
      <span style={{ width: "40%" }}>
        {title}
        <br />
        by {author}
      </span>
      <span style={{ width: "20%" }} className="linkToCenter">
        <Link to={`/course/${id}`}>
          course
          <br />
          details
        </Link>
      </span>
      <span style={{ width: "20%", textAlign: "center" }}>
        mark as
        <br />
        completed
      </span>
      <span style={{ width: "20%" }} className="linkToCenter">
        <a href={url} target="_blank">
          course
          <br />
          details
        </a>
      </span>
    </div>
  );
}

export default InlineCoursePremium;
