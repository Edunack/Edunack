import "./InfoPanel.css";

function InfoPanel() {
  return (
    <div id="infoPanel">
      <svg width="0" height="0">
        <defs>
          <clipPath id="roundedPoly" clipPathUnits="objectBoundingBox">
            <path
              d="
            M 1 0.997 
            L 0 0.691 
            V 0.00015 
            C 0.066 0.0038, 0.375 0.166, 0.515 0.161 
            C 0.664 0.158, 0.884 0.0197, 1 0.00015 
            L 1 0.997 Z"
            />
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
