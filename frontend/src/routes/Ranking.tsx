import Search from "./RankingPage/Search";
import Top3 from "./RankingPage/Top3";
import OutsidePodium from "./RankingPage/OutsidePodium";
import "./Ranking.css";
import { useState } from "react";

function Ranking() {
  const [ShowResult, setShowResults] = useState(false);
  const [courses, setCourses] = useState<Object[]>([]);
  return (
    <div id="ranking">
      <Search
        onSearch={() => setShowResults(true)}
        onUpdateCourses={setCourses}
      />
      {ShowResult && (
        <>
          <Top3 courses={courses} />
          <OutsidePodium courses={courses} />
        </>
      )}
    </div>
  );
}

export default Ranking;
