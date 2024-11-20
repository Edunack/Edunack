import "./CourseRank.css";

interface Props {
  rank: string;
  type: string;
  link: string;
  opinion: string;
  flexDirection?: "column" | "row";
}

function CourseRank({ rank, type, link, opinion, flexDirection }: Props) {
  return (
    <div style={{ flexDirection: flexDirection }} id="courseInfo">
      <p style={{ fontSize: "5vh", margin: "3vh" }}>{rank}</p>
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

export default CourseRank;
