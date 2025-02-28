import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Home from "./components/Home/Home";
import Game from "./components/Game/Game";
import Invite from "./components/Invite/Invite";
import TaskMain from "./components/TaskMain/TaskMain";
import Footer from "./components/Footer/Footer";
import { CoinProvider } from "./context/CoinContext";
import "./App.css";
import Settings from "./components/Settings/Settings";
import ProfileUpdate from "./components/ProfileUpdate/ProfileUpdate";
import { TonConnectUIProvider } from "@tonconnect/ui-react";
// import { useTonAddress } from "@tonconnect/ui-react";

function App() {
  return (
    <TonConnectUIProvider manifestUrl="https://tg-mini-app-nine-ruddy.vercel.app/tonconnect-manifest.json"
    walletsListConfiguration={{
                includeWallets: [
                  {
                    name: "Tg Mini App",
                    appName: "ton_telegram",
                    imageUrl: "https://telegram.org/favicon.ico",
                    universalLink: "https://app.tonkeeper.com/ton-connect",
                    platforms: ["ios", "android", "chrome"]
                  }
                ]
              }}>
      <CoinProvider>
        <Router>
          <Routes>
            {/* <Route path="/" element={<Login />} /> */}
            <Route path="/*" element={<ProtectedLayout />} />
          </Routes>
        </Router>
      </CoinProvider>
    </TonConnectUIProvider>
  );
}


const ProtectedLayout = () => {
 

  return (
    <div className="app-container">
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/game" element={<Game />} />
          <Route path="/task" element={<TaskMain />} />
          <Route path="/invite" element={<Invite />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/profile" element={<ProfileUpdate />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
};

export default App;

