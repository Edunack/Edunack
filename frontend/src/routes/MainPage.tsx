import WelcomePanel from "./MainPage/WelcomePanel";
import InfoPanel from "./MainPage/InfoPanel";
import Recommendations from "./MainPage/Recommendations";
import Advert from "./MainPage/Advert";
import Footer from "./MainPage/Footer";
import "./MainPage.css";

function App() {
  return (
    <div id="MainPage">
      <WelcomePanel />
      <InfoPanel />
      <Recommendations />
      <Advert />
      <Footer />
    </div>
  );
}

export default App;
