import "./Menu.css";
import { Outlet } from "react-router-dom";

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
          <span>EDUNACK</span>
        </div>
        <ul id="menu">
          <li className="menuItem" style={{ fontWeight: 700 }}>
            home
          </li>
          <li className="menuItem">ranking</li>
          <li className="menuItem">about</li>
          <li className="menuItem">log in</li>
        </ul>
      </div>
      <div>
        <Outlet />
      </div>
    </>
  );
}

export default Menu;
