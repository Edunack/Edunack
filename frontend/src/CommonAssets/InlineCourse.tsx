import "./InlineCourse.css";

interface Props {
  title: string;
  author: string;
  rank: string;
  type: string;
  price: string;
  opinion: string;
}

function InlineCourse({ title, author, rank, type, price, opinion }: Props) {
  return (
    <div id="inlineCourse">
      <span style={{fontSize: "5vh"}}>{rank}</span>
      <span>
        {title}
        <br />
        by {author}
      </span>
      <span>{type}</span>
      <span>{price}</span>
      <span>{opinion}</span>
    </div>
  );
}

export default InlineCourse;
