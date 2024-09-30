import "./WelcomePanel.css";

function WelcomePanel() {
  return (
    <div className="WelcomePanel">
      <p id="title">
        WHAT WOULD YOU LIKE TO <br />
        LEARN TODAY?
      </p>
      <p id="subtext">Focus on your work - let us do the searching</p>
      <br />
      <button id="start">START NOW</button>
    </div>
  );
}

export default WelcomePanel;
