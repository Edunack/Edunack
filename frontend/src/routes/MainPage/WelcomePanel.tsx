import "./WelcomePanel.css";
import Button from "../../CommonAssets/Button";

function WelcomePanel() {
  return (
    <div id="WelcomePanel">
      <p id="title">
        WHAT WOULD YOU LIKE TO <br />
        LEARN TODAY?
      </p>
      <p id="subtext">Focus on your work - let us do the searching</p>
      <Button
        bgColor="#1e1e1e"
        color="white"
        fontSize="2.75vh"
        fontWeight={400}
        zIndex={1}
        borderRadius="2vh"
        margin="5vh 0 0 0"
      >
        START NOW
      </Button>
    </div>
  );
}

export default WelcomePanel;
