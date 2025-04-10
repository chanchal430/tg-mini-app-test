/** 3P Dependecies */
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import { TonConnectUIProvider } from "@tonconnect/ui-react";

/** Helpers */
// import { CoinProvider } from "./context/CoinContext";

/** Styles */
import "./App.css";

/** Components */
import Home from "./components/Home";
import Game from "./components/Game"
import Invite from "./components/Invite";
import TaskMain from "./components/TaskMain";
import Navbar from "./components/Navbar";
import Settings from "./components/Settings";
import ProfileUpdate from "./components/ProfileUpdate";
import { Root } from "./core/Root";

function App() {
  return (
    <TonConnectUIProvider manifestUrl="https://tg-mini-app-nine-ruddy.vercel.app/tonconnect-manifest.json">
      <Root>
        {/* <CoinProvider> */}
          <Router>
            <Routes>

              <Route path="/*" element={<ProtectedLayout />} />
            </Routes>
          </Router>
        {/* </CoinProvider> */}
      </Root>
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
      <Navbar />
    </div>
  );
};

export default App;

