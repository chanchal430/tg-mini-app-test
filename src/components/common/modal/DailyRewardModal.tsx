import React from "react";
import styles from './styles.module.css'

const rewards = [
  { label: "Day 1", value: "100" },
  { label: "Day 2", value: "500" },
  { label: "Day 3", value: "1,000" },
  { label: "Day 4", value: "5,000" },
  { label: "Day 5", value: "Skin" },
  { label: "Day 6", value: "20,000" },
  { label: "Day 7", value: "50,000" },
  { label: "Day 8", value: "100,000" },
  { label: "Day 9", value: "250,000" },
  { label: "Day 10", value: "500,000" },
  { label: "Day 11", value: "1M" },
  { label: "Day 12", value: "5M" },
];

const DailyRewardModal = ({ isOpen, onClose, onClaim, currentDay }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.rewardoverlay}>
      <div className={styles.rewardmodal}>
        <button className={styles.close} onClick={onClose}>×</button>
        <h1>{currentDay}</h1>
        <p>Daily reward</p>
        <div className={styles.grid}>
          {rewards.map((reward, index) => (
            <div
              key={index}
              className={`${styles.dayCard} ${
                currentDay - 1 === index ? styles.active : ""
              }`}
            >
              <p>{reward.label}</p>
              <div className={styles.iconBox}>🎁</div>
              <span>{reward.value}</span>
            </div>
          ))}
        </div>
        <button className={styles.collectBtn} onClick={onClaim}>
          Collect
        </button>
      </div>
    </div>
  );
};

export default DailyRewardModal;
