import Top3 from "./RankingPage/Top3";
import OutsidePodium from "./RankingPage/OutsidePodium";
import "./Ranking.css";

function Ranking() {
  const categoryName = sessionStorage.getItem("categoryName");
  return (
    <div id="ranking">
      <p id="category">
        Top searches in: <b>{categoryName}</b>
      </p>
      <Top3 />
      <OutsidePodium />
    </div>
  );
}

export default Ranking;
