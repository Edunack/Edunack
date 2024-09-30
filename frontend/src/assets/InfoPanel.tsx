import "./InfoPanel.css";

function InfoPanel() {
  return (
    <div id="container">
      <div id="left" className="sect">
        <p>
          YOOO.
          <br />
          DID YOU HAVE PROBLEMS FINDING THE RIGHT COURSE?
          <br />
          FEAR NOT
          <br />
          WE ARE HERE TO SAVE YOUR DAY!
        </p>
      </div>
      <div id="right" className="sect">
        <p>How does this work?</p>
        <ul>
          <li>You tell us what you want to learn</li>
          <li>We show you the courses that people found most helpful</li>
          <li>
            You can take an exam to blah blah blah blah blah blah blah blah blah
            blah
          </li>
          <li>blah blah blah blah blah blah blah blah blah blah blah blah</li>
        </ul>
      </div>
    </div>
  );
}

export default InfoPanel;
