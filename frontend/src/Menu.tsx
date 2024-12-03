import { useContext } from "react";
import "./Menu.css";
import { Outlet, Link } from "react-router-dom";
import { MagnificationContext } from "./main.tsx";

function Menu() {
  const { setMagnificationLevel } = useContext(MagnificationContext);
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
        <div>
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
        </div>
        <ul id="menu">
          <li className="menuItem" style={{ fontWeight: 700 }}>
            <Link to={``} className="menuLink">
              home
            </Link>
          </li>
          <li className="menuItem">
            {" "}
            <Link to={`Search`} className="menuLink">
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
      <div style={{ transform: "translateY(10vh)" }}>
        <Outlet />
      </div>
    </>
  );
}

export default Menu;
