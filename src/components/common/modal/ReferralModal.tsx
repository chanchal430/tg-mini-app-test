import React from 'react';
import styles from './styles.module.css';
import GiftIcon from '../../../assets/images/Gift.svg'

const ReferralModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <img
            src={GiftIcon}
            alt="Gift"
            className={styles.giftImage}
          />
          <button onClick={onClose} className={styles.closeBtn}>×</button>
        </div>
        <div className={styles.modalContent}>
        <span>Send a gift to a friend and earn even more!</span>
        <p>
          Send free gifts to your friends and start earning 20% of each friend's profits!
        </p>
        <button className={styles.claimBtn}>Claim</button>
        <p className={styles.rewardNote}>Don't forget to collect the daily reward</p>
        </div>
       
      </div>
    </div>
  );
};

export default ReferralModal;
