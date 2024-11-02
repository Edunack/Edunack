import "./Advert.css";
import Tile from "./AdditionalAssets/Tile";

function Advert() {
  return (
    <div id="advertContainer">
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
          <Tile color="white" bgColor="#60316C" shadow="#3A2E65">
            <p className="titles">
              THE
              <br />
              INNOVATION
            </p>
            <span className="content">
              We are veri silli We are veri silli We are verrrri silli We are
              veri silli We are veri silli We are verrrri silli We are verrrrri
              silli We are verrri silli We are veri silli We are vei silli We
              are veri silli We are verri silli We are veri silli We are veri
              silli
            </span>
          </Tile>
          <Tile color="white" bgColor="#3A2E65" shadow="#60316C">
            <p className="titles">THE IDEA</p>
            <span className="content">
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
