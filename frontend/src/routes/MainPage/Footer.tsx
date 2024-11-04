import "./Footer.css";

function Footer() {
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
        <ul className="footerLists">
          <li>Return to top</li>
          <li>Ranking</li>
          <li>About</li>
        </ul>
        <ul className="footerLists">
          <li>Contact us:</li>
          <li>support@edunack.com</li>
          <li>feedback@edunack.com</li>
          <li>invest@edunack.com</li>
        </ul>
      </div>
    </div>
  );
}

export default Footer;
