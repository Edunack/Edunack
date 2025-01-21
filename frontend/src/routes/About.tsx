import "./About.css";

function About() {
  return (
    <div id="aboutPage">
      <div id="aboutPageContainer">
        <div id="aboutHeaderDecors">
          <div id="aboutHeader">
            <span>ABOUT US</span>
          </div>
          <div id="aboutHeaderDecor"></div>
        </div>
        <div id="whoWeAre">
          <span>
            WE ARE A <span style={{ fontWeight: 500 }}>SMALL TEAM</span>
          </span>
          <span>
            SET OUT TO MAKE A{" "}
            <span style={{ fontWeight: 500 }}>GREAT IMPACT</span> ON THE WORLD.
          </span>
        </div>
        <div id="whatWeBelieve">
          <span>
            WE BELIEVE THAT{" "}
            <span style={{ fontWeight: 500 }}>
              EVERYONE HAS A RIGHT TO HIGH QUALITY EDUCATION.
            </span>
          </span>
          <svg
            width="56"
            height="46"
            viewBox="0 0 56 46"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clip-path="url(#clip0_586_366)">
              <path
                d="M6.2793 6.16992L8.96563 6.34467L7.47754 8.6718L6.2793 6.16992Z"
                fill="#F15A29"
              />
              <path
                d="M7.0081 16.4816L0 1.84668L15.7164 2.85987L7.0081 16.4816Z"
                fill="#EF4136"
              />
              <path
                d="M52.8096 26.9594C48.5995 39.6654 35.2602 46.425 23.0155 42.0581C10.7707 37.6894 4.25649 23.8476 8.46491 11.1416L52.8096 26.9594Z"
                fill="#FBB040"
              />
              <path
                d="M30.6599 46.0001C27.8181 46.0001 24.9634 45.5095 22.1977 44.5215C15.6414 42.1843 10.3546 37.3368 7.31202 30.8696C4.26946 24.4057 3.8355 17.0983 6.08949 10.295L6.90721 7.83008L56.0027 25.3399L55.185 27.8065C52.9327 34.6098 48.2611 40.0958 42.0303 43.253C38.4291 45.0777 34.5558 46.0001 30.6615 46.0001H30.6599ZM10.1635 14.5057C9.17739 19.244 9.74413 24.157 11.8265 28.5828C14.2796 33.7949 18.5431 37.7048 23.8316 39.5917C29.1184 41.4736 34.7971 41.114 39.8232 38.5684C44.0883 36.4076 47.4466 32.8926 49.4756 28.5273L10.1635 14.5057Z"
                fill="#F7941D"
              />
              <path
                d="M31.595 19.4404C33.7924 12.8085 30.392 5.58517 24.0008 3.30508C17.6096 1.02499 10.6485 4.5535 8.45117 11.1854L31.595 19.4404Z"
                fill="#FBB040"
              />
              <path
                d="M33.1542 22.7521L5.25781 12.805L6.07553 10.3384C7.35636 6.47386 10.0119 3.35533 13.5516 1.56251C17.0929 -0.231991 21.0973 -0.489068 24.8183 0.841684C28.5442 2.1674 31.5479 4.92299 33.2772 8.59768C35.0066 12.269 35.2527 16.4226 33.9719 20.2888L33.1542 22.7537V22.7521ZM11.9518 9.67808L29.7279 16.0176C29.8493 14.2651 29.5238 12.5042 28.7612 10.8845C27.6212 8.46327 25.6409 6.64524 23.1845 5.76984C20.7265 4.89611 18.0887 5.06245 15.7554 6.24534C14.1944 7.03674 12.8926 8.21795 11.9518 9.67808Z"
                fill="#F7941D"
              />
            </g>
            <defs>
              <clipPath id="clip0_586_366">
                <rect width="56" height="46" fill="white" />
              </clipPath>
            </defs>
          </svg>
        </div>
        <div id="whatWeDo">
          <span>
            THAT IS WHY THE THREE OF US HAVE SPENT COUNTLESS HOURS MAKING
            EDUNACK
          </span>
        </div>
        <div id="aboutCreators">
          <div id="creators">
            <span>OUR TEAM:</span>
            <div className="creatorsGithub">
              <svg
                width="23"
                height="23"
                viewBox="0 0 23 23"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
              >
                <rect width="23" height="23" fill="url(#pattern0_587_353)" />
                <defs>
                  <pattern
                    id="pattern0_587_353"
                    patternContentUnits="objectBoundingBox"
                    width="1"
                    height="1"
                  >
                    <use
                      xlinkHref="#image0_587_353"
                      transform="translate(-0.0104167) scale(0.0104167)"
                    />
                  </pattern>
                  <image
                    id="image0_587_353"
                    width="98"
                    height="96"
                    xlinkHref="data:image/png;base64,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"
                  />
                </defs>
              </svg>
              <a href="https://github.com/NataliaPrzemylska" target="_blank">
                NataliaPrzemyłska
              </a>
            </div>
            <div className="creatorsGithub">
              <svg
                width="23"
                height="23"
                viewBox="0 0 23 23"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
              >
                <rect width="23" height="23" fill="url(#pattern0_587_353)" />
                <defs>
                  <pattern
                    id="pattern0_587_353"
                    patternContentUnits="objectBoundingBox"
                    width="1"
                    height="1"
                  >
                    <use
                      xlinkHref="#image0_587_353"
                      transform="translate(-0.0104167) scale(0.0104167)"
                    />
                  </pattern>
                  <image
                    id="image0_587_353"
                    width="98"
                    height="96"
                    xlinkHref="data:image/png;base64,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"
                  />
                </defs>
              </svg>
              <a href="https://github.com/PiotrekB416" target="_blank">
                PiotrekB416
              </a>
            </div>
            <div className="creatorsGithub">
              <svg
                width="23"
                height="23"
                viewBox="0 0 23 23"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
              >
                <rect width="23" height="23" fill="url(#pattern0_587_353)" />
                <defs>
                  <pattern
                    id="pattern0_587_353"
                    patternContentUnits="objectBoundingBox"
                    width="1"
                    height="1"
                  >
                    <use
                      xlinkHref="#image0_587_353"
                      transform="translate(-0.0104167) scale(0.0104167)"
                    />
                  </pattern>
                  <image
                    id="image0_587_353"
                    width="98"
                    height="96"
                    xlinkHref="data:image/png;base64,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"
                  />
                </defs>
              </svg>
              <a href="https://github.com/lunaru100" target="_blank">
                lunaru100
              </a>
            </div>
          </div>
          <div id="aboutCreatorsDecor"></div>
        </div>
        <div id="ourMessage">
          <span style={{ fontSize: "100%" }}>
            We know that we cannot fix all the education issues.
            <br />
            But we still try our best.
          </span>
          <span style={{ color: "#B1B1B1", fontSize: "90%" }}>
            Edunack is a web application that allows you to find the best course
            for you. Our ranking is based mostly on user reviews of the courses
          </span>
          <span style={{ color: "#B1B1B1", fontSize: "80%" }}>
            Our plans for the future include:
            <br />
            Self-hosted AI to filter out irrelevant websites/videos
            <br />
            Web extension which allows user to measure their progress and
            receive reminders
          </span>
          <span style={{ fontSize: "100%", width: "55%" }}>
            If you would like to share a thought with us, reach us at:
          </span>
          <a
            href="mailto:contact@edunack.eu"
            style={{ fontSize: "130%", fontWeight: "bold" }}
          >
            contact@edunack.eu
          </a>
        </div>
      </div>
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
