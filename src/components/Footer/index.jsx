/** 3P Dependecies */
import React, { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

/** Assets */
import homeImage from "../../assets/images/home.svg";
import gameImage from "../../assets/images/mingcute_game-2-line.svg";
import taskImage from "../../assets/images/grommet-icons_task.svg";
import settingsImage from '../../assets/images/settings.svg'

/** Styles */
import "./styles.module.css"

const Footer = () => {
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  return (
    <div className="footer-container">
      <div
        className={`footer-card ${
          location.pathname === "/" ? "active" : ""
        }`}
      >
        <Link to="/">
          <img src={homeImage} alt="Home" />
          <p>Home</p>
        </Link>
      </div>
      <div
        className={`footer-card ${
          location.pathname === "/game" ? "active" : ""
        }`}
      >
        <Link to={"/game"}>
          <img src={gameImage} alt="Game" />
          <p>Game</p>
        </Link>
      </div>
      <div
        className={`footer-card ${
          location.pathname === "/task" ? "active" : ""
        }`}
      >
        <Link to="/task">
          <img src={taskImage} alt="Task" />
          <p>Task</p>
        </Link>
      </div>
      <div
        className={`footer-card ${
          location.pathname === "/settings" ? "active" : ""
        }`}
      >
        <Link to="/settings">
          <img src={settingsImage} alt="Settings" />
          <p>Settings</p>
        </Link>
      </div>
    </div>
  );
};

export default Footer;
