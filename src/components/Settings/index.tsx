import React from "react";
import { Link } from "react-router-dom";
import { FaUserEdit, FaUserFriends } from "react-icons/fa";
import { MdOutlineArrowForwardIos } from "react-icons/md";

/** Assets */
import logo from "../../assets/images/logo.png";

/** Styles */
import styles from "./styles.module.css";

const Settings = () => {
  return (
    <div className={styles.container}>
      <div className={styles.profileSection}>
        <img src={logo} alt="Avatar" className={styles.avatar} />
        <h2 className={styles.username}>Shiri 🐾</h2>
        <div className={styles.levelRow}>
          <span>3 lvl</span>
          <div className={styles.progressBar}>
            <div className={styles.progressFill}></div>
          </div>
          <span>4 lvl</span>
        </div>
        <p className={styles.points}>💰 842 / 70k</p>
      </div>

      <div className={styles.card}>
        <Link to="/wallet" className={styles.cardItem}>
          <div>
            <p className={styles.cardTitle}>Connect Wallet</p>
            <p className={styles.cardSubtitle}>Connect your TON wallet</p>
          </div>
          {/* <MdOutlineArrowForwardIos /> */}
        </Link>

        <Link to="/settings" className={styles.cardItem}>
          <div>
            <p className={styles.cardTitle}>Settings</p>
            <p className={styles.cardSubtitle}>Language, music, sounds and vibration</p>
          </div>
          {/* <MdOutlineArrowForwardIos /> */}
        </Link>
      </div>
    </div>
  );
};

export default Settings;
