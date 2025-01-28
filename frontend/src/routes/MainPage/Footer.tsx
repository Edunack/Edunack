import { useNavigate } from "react-router-dom";
import "./Footer.css";

function Footer() {
  const navigate = useNavigate();
  return (
    <div id="footer">
      <div id="logoMotto">
        <img src="../img/logo-text.svg" alt="app logo" />
        <span id="motto">BECAUSE EVERYONE DESERVES A CHANCE TO GROW</span>
      </div>
      <svg
        width="1vh"
        height="35vh"
        viewBox="0 0 1 272"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        id="line"
      >
        <line x1="0.5" x2="0.5" y2="272" stroke="white" />
      </svg>
      <div id="FooterLists">
        <ul className="footerLists" id="navs">
          <li onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            Return to top
          </li>
          <li onClick={() => navigate("/search")}>Ranking</li>
          <li onClick={() => navigate("/about")}>About</li>
        </ul>
        <ul className="footerLists">
          <li>Contact us:</li>
          <li>
            <a href="mailto:support@edunack.com">support@edunack.com</a>
          </li>
          <li>
            <a href="mailto:feedback@edunack.com">feedback@edunack.com</a>
          </li>
          <li>
            <a href="mailto:invest@edunack.com">invest@edunack.com</a>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Footer;
