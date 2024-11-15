import Search from "./RankingPage/Search";
import Top3 from "./RankingPage/Top3";
import OutsidePodium from "./RankingPage/OutsidePodium";
import "./Ranking.css";

function Ranking() {
  return (
    <div id="ranking">
      <Search />
      <Top3 />
      <OutsidePodium />
    </div>
  );
}

export default Ranking;
