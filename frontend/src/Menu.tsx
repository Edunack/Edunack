//import { useContext } from "react";
import "./Menu.css";
import { Outlet, Link } from "react-router-dom";
//import { MagnificationContext } from "./main.tsx";

function Menu() {
  //const { setMagnificationLevel } = useContext(MagnificationContext);

  return (
    <>
      <div id="containerMenu">
        {/*<div>
          <button
            className="textMagnifier"
            onClick={() => setMagnificationLevel(1)}
          >
            A
          </button>
          <button
            className="textMagnifier"
            onClick={() => setMagnificationLevel(1.25)}
          >
            A+
          </button>
          <button
            className="textMagnifier"
            onClick={() => setMagnificationLevel(1.5)}
          >
            A++
          </button>
        </div>*/}
        <div id="mainMenu" className="menuItem" style={{ width: "25%" }}>
          <ul id="menu" className="menuList">
            <li className="menuItem">
              <Link to={``} className="menuLink">
                HOME
              </Link>
            </li>
            <li className="menuItem">
              <Link to={`Search`} className="menuLink">
                RANKING
              </Link>
            </li>
            <li className="menuItem">
              <Link to={`About`} className="menuLink">
                ABOUT
              </Link>
            </li>
          </ul>
        </div>
        <div id="logoContainer" className="menuItem" style={{ width: "50%" }}>
          <img src="../img/logo.svg" alt="Edunack logo" />
          <span>
            <Link
              to={``}
              className="menuLink"
              style={{ fontFamily: '"Lato", sans-serif' }}
            >
              EDUNACK
            </Link>
          </span>
        </div>
        <div className="menuItem" style={{ width: "25%" }}>
          <ul id="loginMenu" className="menuList">
            <li className="menuItem">
              <Link to={`Login`} className="menuLink">
                LOGIN
              </Link>
            </li>
            <li className="menuItem">
              <Link to={`Profile`} className="menuLink">
                YOUR PROFILE
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div style={{ transform: "translateY(10vh)" }}>
        <Outlet />
      </div>
    </>
  );
}

export default Menu;
