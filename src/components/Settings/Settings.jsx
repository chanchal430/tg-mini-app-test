import React from "react";
import "./Settings.css";
import logo from "../../assets/images/logo.png";
import { Link } from "react-router-dom";
import { MdOutlineArrowForwardIos } from "react-icons/md";
import { FaRegHandPointRight } from "react-icons/fa";

const Settings = () => {
  return (
    <div className="setting-main-container">
      <span className="setting-title">Folks Finance</span>
      <div className="setting-container">
        <img src={logo} className="loginImage" alt="Logo" />
        <div className="basic-setting-div">
          <h4>Basic Settings</h4>
          <ul>
            <li>
              <FaRegHandPointRight />
              <Link to={"/profile"}>
                Profile Update <MdOutlineArrowForwardIos />
              </Link>
            </li>
            <li>
              <FaRegHandPointRight />
              <Link to={"/invite"}>
                Invite <MdOutlineArrowForwardIos />
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Settings;
