import "./CourseRank.css";

interface Props {
  rank: string;
  type: string;
  price: string;
  opinion: string;
  flexDirection?: "column" | "row";
}

function CourseRank({ rank, type, price, opinion, flexDirection }: Props) {
  return (
    <div style={{ flexDirection: flexDirection }} id="courseInfo">
      <p style={{ fontSize: "5vh", margin: "3vh" }}>{rank}</p>
      <span>{type}</span>
      <span>{price}</span>
      <span>{opinion}</span>
    </div>
  );
}

export default CourseRank;
