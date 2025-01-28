import WelcomePanel from "./MainPage/WelcomePanel";
import InfoPanel from "./MainPage/InfoPanel";
import Recommendations from "./MainPage/Recommendations";
import Advert from "./MainPage/Advert";
import Footer from "./MainPage/Footer";
import "./MainPage.css";
import Button from "../CommonAssets/Button";
import { useNavigate } from "react-router-dom";

function App() {
  const isMobile = window.innerWidth <= 768;
  const navigate = useNavigate();
  return (
    <div id="MainPage">
      {isMobile ? (
        <div id="mobileMainPage">
          <div id="mobileHeaderDecors">
            <div id="mobileHeaderBigger"></div>
            <div id="mobileHeaderSmaller"></div>
          </div>
          <div id="mobileMainPageContent">
            <div id="mobileHeader">
              <span>HI THERE!</span>
              <svg
                width="56"
                height="46"
                viewBox="0 0 56 46"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clip-path="url(#clip0_558_688)">
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
                  <clipPath id="clip0_558_688">
                    <rect width="56" height="46" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </div>
            <div id="mobileSubHeader">
              <span style={{ fontWeight: 300 }}>
                OUR GOAL IS TO HELP YOU FIND{" "}
                <span style={{ fontWeight: 600 }}>
                  THE BEST COURSE FOR YOU AND FOCUS ON COMPLETING IT!
                </span>
              </span>
            </div>
            <div id="mobileHeaderButtons">
              <Button
                bgColor="#90299C"
                borderBottom="5px solid #72067C"
                borderRadius="5px"
                width="50%"
                height="6vh"
                margin="0"
                padding="0"
                fontWeight={600}
                onClick={() => navigate("/search")}
              >
                START NOW
              </Button>
              <Button
                bgColor="#773482"
                color="#EFEFEF"
                borderBottom="5px solid #351C38"
                borderRadius="5px"
                width="50%"
                height="6vh"
                margin="0"
                padding="0"
                fontWeight={600}
                onClick={() => navigate("/about")}
              >
                LEARN MORE
              </Button>
            </div>
          </div>
          <div id="mobileDecors">
            <div id="pinkRect">
              <span style={{ fontWeight: 300, fontSize: "1.5vh" }}>
                SCROLL TO READ MORE :3
              </span>
              <svg
                width="23"
                height="31"
                viewBox="0 0 23 31"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M11.4688 2L11.4688 18.635"
                  stroke="#C18DC9"
                  stroke-width="3"
                  stroke-linecap="round"
                />
                <path
                  d="M3.06066 18.7264C2.47487 18.1407 1.52513 18.1407 0.93934 18.7264C0.353553 19.3122 0.353553 20.262 0.93934 20.8478L3.06066 18.7264ZM0.93934 20.8478L11.0391 30.9476L13.1605 28.8263L3.06066 18.7264L0.93934 20.8478Z"
                  fill="#C18DC9"
                />
                <path
                  d="M19.879 18.7267C20.4648 18.141 21.4145 18.141 22.0003 18.7267C22.5861 19.3125 22.5861 20.2623 22.0003 20.8481L19.879 18.7267ZM9.77918 28.8265L19.879 18.7267L22.0003 20.8481L11.9005 30.9479L9.77918 28.8265Z"
                  fill="#C18DC9"
                />
              </svg>
              <div id="chartTextInfo">
                <span
                  style={{
                    fontWeight: 300,
                    fontSize: "1.75vh",
                    textAlign: "center",
                    width: "70%",
                  }}
                >
                  HAVE YOU EVER STRUGGLED TO FIND A COURSE?
                </span>
                <span
                  style={{
                    fontWeight: 300,
                    fontSize: "1.25vh",
                    textAlign: "center",
                    width: "40%",
                    color: "#C3C3C3",
                  }}
                >
                  WE CONDUCTED AN ANNONYMOUS SURVEY
                </span>
              </div>
            </div>
            <div id="purpleRect"></div>
          </div>
          <div id="mobileDataHolder">
            <svg
              width="213"
              height="213"
              viewBox="0 0 213 213"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              id="chart"
            >
              <mask
                id="mask0_558_722"
                style={{ maskType: "alpha" }}
                maskUnits="userSpaceOnUse"
                x="0"
                y="0"
                width="213"
                height="213"
              >
                <circle cx="106.5" cy="106.5" r="106.5" fill="#6F6F6F" />
              </mask>
              <g mask="url(#mask0_558_722)">
                <circle cx="106.5" cy="106.5" r="106.5" fill="#F7941D" />
                <path
                  d="M106 107.5L313.75 -243.673L313.75 458.673L106 107.5Z"
                  fill="#90429C"
                />
              </g>
            </svg>
            <div className="chartResult">
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="9" cy="9" r="9" fill="#F7941D" />
              </svg>
              <span>YES (68%)</span>
            </div>
            <div className="chartResult">
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle cx="9" cy="9" r="9" fill="#90429C" />
              </svg>
              <span>NO (32%)</span>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <WelcomePanel />
          <InfoPanel />
          <Recommendations />
          <Advert />
          <Footer />
        </div>
      )}
    </div>
  );
}

export default App;
