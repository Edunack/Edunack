import "./InfoPanel.css";

function InfoPanel() {
  return (
    <div id="infoPanel">
      <svg
        width={0}
        height={0}
        preserveAspectRatio="none"
        viewBox="0 0 1440 1920"
      >
        <defs>
          <clipPath id="rankWave" clipPathUnits="userSpaceOnUse">
            <path d="m0,333.42S700.74-168.28,938,59.16c364.67,349.56,982,274.27,982,274.27v1087.58H0V333.42Z" />
          </clipPath>
        </defs>
      </svg>
      <div id="infoTransform">
        <div id="howTo" className="sect">
          <p>How does this work?</p>
          <ul>
            <li>You tell us what you want to learn</li>
            <li>We show you the courses that people found most helpful</li>
            <li>we show you where can you take the course</li>
            <li>we will try to keep you motivated with our extension</li>
          </ul>
        </div>
        <div id="catchphrase" className="sect">
          <p>
            HAVE YOU EVER WANTED TO LEARN A SKILL AND THERE WERE JUST TOO MANY
            COURSES
            <br />
            /TUTORIALS?
            <br /> <span id="wrapper">FIND THE BEST SUITED ONE ON EDUNACK</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default InfoPanel;
