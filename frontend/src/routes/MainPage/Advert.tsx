import "./Advert.css";
import { useContext } from "react";
import Tile from "../../CommonAssets/Tile";
import { MagnificationContext } from "../../main";
function Advert() {
  const { magnificationLevel } = useContext(MagnificationContext);

  const applyMagnification = {
    marginTop: `${
      magnificationLevel > 1
        ? -35 * (1 / (magnificationLevel * 2))
        : -35 * (1 / magnificationLevel)
    }%`,
  };

  return (
    <div id="advertContainer" style={applyMagnification}>
      <svg width="0" height="0">
        <defs>
          <clipPath id="bg" clipPathUnits="objectBoundingBox">
            <path d="M0,0 L1,0.2675 V1 H0 V0 Z"></path>
          </clipPath>
        </defs>
      </svg>
      <div id="maintainSpace">
        <p id="title">FIND THE BEST COURSE FOR YOU</p>
        <div id="tilesContainer">
          <Tile
            color="white"
            bgColor="#60316C"
            shadow="0 0 7.5vh #3A2E65"
            width="40vh"
            height="45vh"
            borderRadius="4vh"
            padding="5vh"
          >
            <p className="titles">
              THE
              <br />
              INNOVATION
            </p>
            <span className="TileContent">
              We are veri silli We are veri silli We are verrrri silli We are
              veri silli We are veri silli We are verrrri silli We are verrrrri
              silli We are verrri silli We are veri silli We are vei silli We
              are veri silli We are verri silli We are veri silli We are veri
              silli
            </span>
          </Tile>
          <Tile
            color="white"
            bgColor="#3A2E65"
            shadow="0 0 7.5vh #60316C"
            width="40vh"
            height="45vh"
            borderRadius="4vh"
            padding="5vh"
          >
            <p className="titles">THE IDEA</p>
            <span className="TileContent">
              We are dedicated to popularizing courses of good quality to the
              public. We strongly believe that education should be free, and
              those who create amazing courses, especially those who do it with
              no profit, should receive the appreciation.
            </span>
          </Tile>
        </div>
      </div>
    </div>
  );
}

export default Advert;
