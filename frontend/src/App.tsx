import WelcomePanel from "./assets/WelcomePanel";
import InfoPanel from "./assets/InfoPanel";
import Menu from "./assets/Menu";
import Recommendations from "./assets/Recommendations";
import Advert from "./assets/Advert";
import Footer from "./assets/Footer";

function App() {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <Menu />
      <WelcomePanel />
      <InfoPanel />
      <Recommendations />
      <Advert />
      <Footer />
    </div>
  );
}

export default App;
