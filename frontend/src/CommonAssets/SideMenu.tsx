import "./SideMenu.css";
import { useState, useContext } from "react";
import { MagnificationContext } from "../main";

function SideMenu() {
  const { setMagnificationLevel } = useContext(MagnificationContext);
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const toggleMenu = () => setIsSideMenuOpen((prev) => !prev);

  return (
    <div id="sideMenu">
      {isSideMenuOpen && (
        <div id="textMagnifiers">
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
      )}
      <div id="sideMenuIcon" onClick={toggleMenu}>
        <div
          id="triangle"
          style={{
            clipPath: isSideMenuOpen
              ? "polygon(0 50%, 100% 0, 100% 100%, 0 50%)"
              : "polygon(0 0, 100% 50%, 100% 50%, 0 100%)",
          }}
        ></div>
      </div>
    </div>
  );
}

export default SideMenu;
