import "./Advert.css";
import Tile from "./CommonAssets/Tile";

function Advert() {
  return (
    <div id="advertContainer">
      <p id="title">FIND THE BEST COURSE FOR YOU</p>
      <div id="tilesContainer">
        <Tile color="white" bgColor="#6A4583" shadow="#576887">
          <p>THE INNOVATION</p>
          <span>
            We are veri silli We are veri silli We are verrrri silli We are veri
            silli We are veri silli We are verrrri silli We are verrrrri silli
            We are verrri silli We are veri silli We are vei silli We are veri
            silli We are verri silli We are veri silli We are veri silli
          </span>
        </Tile>
        <Tile color="white" bgColor="#576887" shadow="#6A4583">
          <p>THE IDEA</p>
          <span>
            We are dedicated to popularizing courses of good quality to the
            public. We strongly believe that education should be free, and those
            who create amazing courses, especially those who do it with no
            profit, should receive the appreciation.
          </span>
        </Tile>
      </div>
    </div>
  );
}

export default Advert;
