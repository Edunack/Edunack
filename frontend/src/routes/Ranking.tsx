import Search from "./RankingPage/Search";
import Top3 from "./RankingPage/Top3";
import OutsidePodium from "./RankingPage/OutsidePodium";
import "./Ranking.css";
import { useState } from "react";

function Ranking() {
  const [ShowResult, setShowResults] = useState(false);
  return (
    <div id="ranking">
      <Search onSearch={() => setShowResults(true)} />
      {ShowResult && (
        <>
          <Top3 />
          <OutsidePodium />
        </>
      )}
    </div>
  );
}

export default Ranking;
