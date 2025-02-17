import "./Menu.css";
import { Outlet, Link } from "react-router-dom";
import { useState, useContext } from "react";
import SideMenu from "./CommonAssets/SideMenu";
import { MagnificationContext } from "./main";

function Menu() {
  const { magnificationLevel, setMagnificationLevel } =
    useContext(MagnificationContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  const logout = () => {
    fetch("/api/auth/logout", { method: "POST" }).then((data) => {
      if (data.status === 200) {
        sessionStorage.removeItem("username");
        sessionStorage.removeItem("userId");
        window.location.reload();
      } else {
        alert("Error logging out");
      }
    });
  };

  return (
    <div style={{ width: "100%" }}>
      <div id="burgerMenu" onClick={toggleMenu}>
        {isMenuOpen ? (
          <svg
            width="31"
            height="31"
            viewBox="0 0 31 31"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M2 3L29 28"
              stroke="#FFE9E9"
              stroke-width="4"
              stroke-linecap="round"
            />
            <path
              d="M2 28L29 3"
              stroke="#FFE9E9"
              stroke-width="4"
              stroke-linecap="round"
            />
          </svg>
        ) : (
          <svg
            width="35"
            height="28"
            viewBox="0 0 35 28"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M2 2H33"
              stroke="#FFE9E9"
              stroke-width="4"
              stroke-linecap="round"
            />
            <path
              d="M2 13.6758H33"
              stroke="#FFE9E9"
              stroke-width="4"
              stroke-linecap="round"
            />
            <path
              d="M2 26H33"
              stroke="#FFE9E9"
              stroke-width="4"
              stroke-linecap="round"
            />
          </svg>
        )}
      </div>
      {isMenuOpen ? (
        <div id="mobileMenu">
          <div
            id="logoContainer"
            className="mobileMenuItem"
            style={{ width: magnificationLevel > 1.25 ? "60%" : "50%" }}
          >
            <img src="../img/logo.svg" alt="Edunack logo" />
            <span>
              <Link
                to={``}
                className="menuLink"
                style={{ fontFamily: '"Lato", sans-serif', fontWeight: "bold" }}
              >
                EDUNACK
              </Link>
            </span>
          </div>
          <ul>
            <li className="mobileMenuItem">
              <Link to={``} className="menuLink" onClick={toggleMenu}>
                HOME
              </Link>
            </li>
            <li className="mobileMenuItem">
              <Link to={`Search`} className="menuLink" onClick={toggleMenu}>
                RANKING
              </Link>
            </li>
            <li className="mobileMenuItem">
              <Link to={`About`} className="menuLink" onClick={toggleMenu}>
                ABOUT
              </Link>
            </li>
            <li className="mobileMenuItem">
              {sessionStorage.getItem("userId") ? (
                <span onClick={logout}>LOG OUT</span>
              ) : (
                <Link to={`Login`} className="menuLink">
                  LOGIN
                </Link>
              )}
            </li>
            <li className="mobileMenuItem">
              <Link to={`Profile`} className="menuLink" onClick={toggleMenu}>
                YOUR PROFILE
              </Link>
            </li>
            <li className="mobileMenuItem" id="magnifierOption">
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
            </li>
          </ul>
        </div>
      ) : (
        <div style={{ display: "none" }}></div>
      )}
      <div id="containerMenu">
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
              {sessionStorage.getItem("userId") ? (
                <span onClick={logout}>LOG OUT</span>
              ) : (
                <Link to={`Login`} className="menuLink">
                  LOGIN
                </Link>
              )}
            </li>
            <li className="menuItem">
              <Link to={`Profile`} className="menuLink">
                YOUR PROFILE
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <MagnificationContext.Provider
        value={{ magnificationLevel, setMagnificationLevel }}
      >
        <SideMenu />
      </MagnificationContext.Provider>
      <div id="outlet">
        <Outlet />
      </div>
    </div>
  );
}

export default Menu;
