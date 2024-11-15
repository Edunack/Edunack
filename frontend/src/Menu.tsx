import "./Menu.css";
import { Outlet, Link } from "react-router-dom";
//import { useAccessibility } from "./AccessibilityContext";

function Menu() {
  //const { toggleMagnify } = useAccessibility();
  return (
    <>
      <div id="containerMenu">
        <div id="logoContainer">
          <img
            src="../img/logo.svg"
            alt="Edunack logo"
            style={{ width: "3vh", height: "3vh", margin: "0 1vh" }}
          />
          <span>
            <Link to={``} className="menuLink">
              EDUNACK
            </Link>
          </span>
        </div>
        {/*<button id="MagnifyText" onClick={toggleMagnify}>
          <img
            src="../img/magnifyText.svg"
            alt="magnify text"
            style={{ width: "5vh", height: "5vh" }}
          />
        </button>*/}
        <ul id="menu">
          <li className="menuItem" style={{ fontWeight: 700 }}>
            <Link to={``} className="menuLink">
              home
            </Link>
          </li>
          <li className="menuItem">
            {" "}
            <Link to={`Ranking`} className="menuLink">
              ranking
            </Link>
          </li>
          <li className="menuItem">
            <Link to={`About`} className="menuLink">
              about
            </Link>
          </li>
          <li className="menuItem">
            <Link to={`Login`} className="menuLink">
              log in
            </Link>
          </li>
        </ul>
      </div>
      <div style={{transform: "translateY(10vh)"}}>
        <Outlet />
      </div>
    </>
  );
}

export default Menu;
