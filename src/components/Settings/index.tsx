/** 3P Dependecies */
import React from "react";
import { Link } from "react-router-dom";
import { MdOutlineArrowForwardIos } from "react-icons/md";
import { FaRegHandPointRight } from "react-icons/fa";

/** Assets */
import logo from "../../assets/images/logo.png";

/** Styles */
import styles from "./styles.module.css";

const Settings = () => {
  return (
    <div className={styles["setting-main-container"]}>
      <div className={styles["setting-container"]}>
        <img src={logo} className={styles["loginImage"]} alt="Logo" />
        <div className={styles["basic-setting-div"]}>
          <h4>Basic Settings</h4>
          <ul>
            <li>
              <Link to={"/profile"}>
                Profile Update
              </Link>
            </li>
            <li>
              {/* <FaRegHandPointRight /> */}
              <Link to={"/invite"}>
                Invite 
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Settings;
