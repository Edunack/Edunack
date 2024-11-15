import InlineCourse from "../../CommonAssets/InlineCourse";
import "./OutsidePodium.css";

function OutsidePodium() {
  return (
    <div id="outside">
      <InlineCourse
        title="Welcome to PHP"
        author="programming is lajf"
        rank="4."
        type="video"
        price="free"
        opinion="very positive ratings"
      />
      <div className="line"></div>
      <InlineCourse
        title="Welcome to PHP"
        author="programming is lajf"
        rank="5."
        type="video"
        price="free"
        opinion="no ratings"
      />
      <div className="line"></div>
      <InlineCourse
        title="Welcome to PHP"
        author="programming is lajf"
        rank="6."
        type="video"
        price="free"
        opinion="nice ratings"
      />
    </div>
  );
}

export default OutsidePodium;
