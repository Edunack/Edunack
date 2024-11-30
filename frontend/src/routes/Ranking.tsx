import Top3 from "./RankingPage/Top3";
import OutsidePodium from "./RankingPage/OutsidePodium";
import "./Ranking.css";

interface Props {
  courses: any[];
  category: string;
}

function Ranking({ courses, category }: Props) {
  return (
    <div id="ranking">
      <p id="category">
        Top searches in: <b>{category}</b>
      </p>
      <Top3 courses={courses} />
      <OutsidePodium courses={courses} />
    </div>
  );
}

export default Ranking;
