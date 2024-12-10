import "./About.css";

function About() {
  return (
    <div id="aboutPage">
      <div id="aboutContainer">
        <p id="about">About Us</p>
        <div id="aboutProject">
          <div id="ourTeamContainer">
            <p className="projectTitles">Our team</p>
            <div id="ourTeam">
              <img src="./img/github.svg" alt="github" />
              <div>
                <p className="team">
                  <a
                    href="https://github.com/NataliaPrzemylska"
                    target="_blank"
                  >
                    NataliaPrzemyłska
                  </a>
                </p>
                <p className="team">
                  <a href="https://github.com/PiotrekB416" target="_blank">
                    PiotrekB416
                  </a>
                </p>
                <p className="team">
                  <a href="https://github.com/lunaru100" target="_blank">
                    lunaru100
                  </a>
                </p>
              </div>
            </div>
          </div>
          <div id="projectDescription">
            <p className="projectTitles">Project description</p>
            <span>
              Edunack is a web application that allows you to find the best
              course for you. Our ranking is based on user reviews of the
              courses and is enchanced by the AI usage.
            </span>
            <p></p>
          </div>
        </div>
        <p style={{ fontSize: "3vh", margin: "3vh 0 0 0" }}>
          Contact us: contact@edunack.com
        </p>
      </div>
    </div>
  );
}

export default About;
