import "./InlineCourse.css";

interface Props {
  title: string;
  author: string;
  rank: string;
  type: string;
  link: string;
  opinion: string;
}

function InlineCourse({ title, author, rank, type, link, opinion }: Props) {
  return (
    <div id="inlineCourse">
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
