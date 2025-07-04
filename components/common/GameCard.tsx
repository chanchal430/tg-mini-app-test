import React from "react";
import styles from "./styles/GameCard.module.css";

import Colors from "@/theme/Colors";
// import { useSelector } from 'react-redux';
import { Button, Caption, Text } from "@telegram-apps/telegram-ui";
import Hourglass from "../../public/Timer.svg";
// import Trophy from '../../public/assets/trophy.svg';
// import Participant from '../../public/assets/Participant.svg';

interface GameCardProps {
  // icon: React.ElementType;
  mainText: string;
  primaryText?: string;
  secondaryText?: string;
  onPlaceClick?: () => void;
  className?: string;
  onClick?: () => void;
  userReward?: boolean;

  btnText?: any;
  isDisabled?: boolean;
}

const GameCard: React.FC<GameCardProps> = ({
  mainText,
  primaryText,
  secondaryText,
  onPlaceClick,
  className,
  onClick,
  userReward = true,
  btnText,
  isDisabled = false,
}) => {
  // const language = useSelector((state: any) => state.language.language);
  // const strings = useSelector((state: any) => state.language.strings[language]);

  return (
    <>
      <div
        className={`${styles.card} ${className} ${
          isDisabled ? styles.disabled : ""
        }`}
        onClick={onClick}
      >
        {/* <Icon className={styles.flag} /> */}
        <div className={styles.childCard}>
          <div className={styles.left}>
            <div className={styles.details}>
              <Text weight="3" className={styles.mainText}>
                {mainText}
              </Text>
              <Caption weight="3" className={styles.secondaryText}>
                {secondaryText}
              </Caption>
            </div>
          </div>
          <div className={styles.right}>
            <Button
              className={styles.placeButton}
              onClick={onPlaceClick}
              style={{ color: Colors.dark.base.content.DEFAULT }}
              size="s"
            >
              {btnText}
            </Button>
          </div>
        </div>
      </div>
      {userReward && (
        <div className={styles.eventRewardDetails}>
          <div className={styles.rowItem}>
            {/* <Trophy style={{ height: 20, width: 20 }} />
             <Caption level="2" weight='3' style={{ color: Colors.textSecondary }}>{primaryText}</Caption> */}
          </div>
          <div className={styles.rowItem}>
            {/* <Trophy style={{ height: 14, width: 14, }} /> */}
            <Caption
              level="2"
              weight="3"
              style={{
                color: Colors.dark.base.content["50"],
                marginLeft: 2,
              }}
            >
              {primaryText}
            </Caption>
          </div>
          <div className={styles.rowItem}>
            {/* <Participant style={{ height: 14, width: 14 }} /> */}
            <Caption
              level="2"
              weight="3"
              style={{
                color: Colors.dark.base.content["50"],
                marginLeft: 2,
              }}
            >
              {primaryText}
            </Caption>
          </div>
          <div className={styles.rowItem}>
            <Hourglass style={{ height: 14, width: 14 }} />
            <Caption
              level="2"
              weight="3"
              style={{ color: Colors.dark.base.content["50"], marginLeft: 2 }}
            >
              {"1D 6H"}
            </Caption>
          </div>
        </div>
      )}
    </>
  );
};

export default GameCard;
