import "./Menu.css";
import { Outlet, Link } from "react-router-dom";

function Menu() {
  return (
    <>
      <div id="containerMenu">
        <div id="logoContainer">
          <img
            src="../img/logo.svg"
            alt="Edunack logo"
            style={{ width: "3vh", height: "3vh", margin: "0px 8px" }}
          />
          <span>
            <Link to={``} className="menuLink">
              EDUNACK
            </Link>
          </span>
        </div>
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
      <div>
        <Outlet />
      </div>
    </>
  );
}

export default Menu;
