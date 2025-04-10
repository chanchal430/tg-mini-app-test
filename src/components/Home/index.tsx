/** 3P Dependecies */
import React, { useEffect, useRef, useState } from "react";
import {
  useTonAddress,
  useTonConnectUI,
  TonConnectButton,
} from "@tonconnect/ui-react";

import { useSignal } from "@telegram-apps/sdk-react";
import { initData } from "@telegram-apps/sdk-react";

/** Assets */
import logo from "../../assets/images/logo.png";
import unionlogo from "../../assets/images/Union.svg";
import folkImage from "../../assets/images/image 3.png";
import bitcoinImage from "../../assets/images/bitcoin.svg";
import loader from "../../assets/images/Loader.gif";

/** Components */

import ReferralModal from "../common/modal/ReferralModal";


/** Styles */
import styles from "./styles.module.css";
import DailyRewardModal from "../common/modal/DailyRewardModal";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { fetchUserData, postTapPoints, setTelegramUserId } from "../../store/slices/userSlice";
import { connectWallet, saveTelegramId } from "../../services/userService";
import { FolksTapper } from "../Tapper";


const Home = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    telegramUserId,
    tapPoints: earnPerTap,
    taskPoints,
    totalPoints,
    name,
  } = useSelector((state: RootState) => state.user);

  const userFriendlyAddress = useTonAddress();
  const [tonConnectUI] = useTonConnectUI();

  const [walletConnected, setWalletConnected] = useState(false);
  const [balance, setBalance] = useState(null);
  const [gamePoints, setGamePoints] = useState(
    localStorage.getItem("gamePoints") || 0
  );
  const [tapLimitReached, setTapLimitReached] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [walletMessage, setWalletMessage] = useState("");
  const [coins, setCoins] = useState([]);
  const [isTelegramSaved, setIsTelegramSaved] = useState(true);
  const [isReferralModalOpen, setIsReferralModalOpen] = useState(true);
  const [showDailyReward, setShowDailyReward] = useState(false);
  const [currentDay, setCurrentDay] = useState(1);

  const telegramUser = useSignal(initData.user);

  useEffect(() => {
    if (telegramUser?.id) {
      const telegramId = String(telegramUser.id);
      dispatch(setTelegramUserId(telegramId));
      localStorage.setItem("telegramUserId", telegramId);
      saveTelegramId(telegramId)
        .then(() => setIsTelegramSaved(true))
        .catch((err) => console.error("Error sending Telegram ID:", err));
    }
  }, [telegramUser?.id]);

  useEffect(() => {
    const lastClaim = localStorage.getItem("lastClaimedAt");
    const streak = parseInt(localStorage.getItem("rewardStreak") || "1");
    if (!lastClaim || Date.now() - Number(lastClaim) > 24 * 60 * 60 * 1000) {
      setCurrentDay(streak);
      setShowDailyReward(true);
    }
  }, []);

  const sendWalletAddress = async () => {
    try {
      const data = await connectWallet(userFriendlyAddress);
      if (data.success) {
        setWalletConnected(true);
        localStorage.setItem("walletAddress", userFriendlyAddress);
      } else {
        console.error("Wallet connection failed:", data.error);
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
    }
  };

  useEffect(() => {
    if (userFriendlyAddress) sendWalletAddress();
  }, [userFriendlyAddress]);

  useEffect(() => {
    if (!isTelegramSaved || !telegramUserId) return;
    dispatch(fetchUserData(telegramUserId));
  }, [telegramUserId, isTelegramSaved]);

  const removeAddress = () => {
    setWalletConnected(false);
    localStorage.removeItem("walletConnected");
    localStorage.removeItem("walletAddress");
  };

  useEffect(() => {
    const unsubscribe = tonConnectUI.onStatusChange((walletInfo) => {
      if (!walletInfo?.account) removeAddress();
    });
    return () => unsubscribe();
  }, [tonConnectUI]);

  const handleImagePress = async () => {
    if (!isTelegramSaved || !telegramUserId) {
      console.log("Waiting for Telegram API to complete...");
      return;
    }

    setIsPressed(true);

    try {
      const result = await dispatch(postTapPoints({ telegramUserId, points: 2 })).unwrap();
    } catch (error: any) {
      setModalMessage(error.message || "Failed to update tap points");
      setModalOpen(true);
      setTimeout(() => setModalOpen(false), 2000);
      if (error.message.includes("daily limit")) setTapLimitReached(true);
      return;
    }

    if (navigator.vibrate) navigator.vibrate(200);
    const newCoin = { id: Date.now() };
    setCoins((prevCoins) => [...prevCoins, newCoin]);
    setTimeout(() => {
      setCoins((prevCoins) => prevCoins.filter((coin) => coin.id !== newCoin.id));
    }, 1000);
    setTimeout(() => setIsPressed(false), 150);
  };

  const handleDailyRewardClaim = () => {
    localStorage.setItem("lastClaimedAt", Date.now().toString());
    let newStreak = currentDay + 1;
    if (newStreak > 12) newStreak = 1;
    localStorage.setItem("rewardStreak", newStreak.toString());
    setShowDailyReward(false);
  };

  return (
    <div className={styles["home-container"]}>
      {/* <h3 className={styles["home-heading"]}>Folks Finance</h3>  */}
      <div className={styles["home-header"]}>
        <div className={styles["profile-div"]}>
          <img src={unionlogo} alt="Union Logo" />

          <h5>{name && name !== "" ? name : "Hello User"}</h5>
        </div>
        <div className={styles["folkImage-div"]}>
          <img src={folkImage} alt="Folk Logo" />
          <p>About Folk's</p>
        </div>
      </div>

      <div className={styles["home-main-container"]}>
        <div className={styles["home-main-cards"]}>
          <div className={styles["home-main-card"]}>
            <span className={styles["home-card1-span"]}>Earn per tap</span>
            <div className={styles["home-bitcoin-card"]}>
              <img src={bitcoinImage} alt="Bitcoin" />
              <span>+{earnPerTap}</span>
            </div>
          </div>
          <div className={styles["home-main-card"]}>
            <span className={styles["home-card2-span"]}>Earn from Tasks</span>
            <div className={styles["home-bitcoin-card"]}>
              <img src={bitcoinImage} alt="Bitcoin" />
              <span>+{taskPoints}</span>
            </div>
          </div>
          <div className={styles["home-main-card"]}>
            <span className={styles["home-card3-span"]}>Earn from Games</span>
            <div className={styles["home-bitcoin-card"]}>
              <img src={bitcoinImage} alt="Bitcoin" />
              <span>+{gamePoints}</span>
            </div>
          </div>
        </div>
        <div className={styles["home-div2"]}>
          <img src={bitcoinImage} alt="Bitcoin" />
          {totalPoints !== null ? <h4>{totalPoints}</h4> : <h4>Loading</h4>}
        </div>
        <TonConnectButton />
        {walletConnected ? (
          <div className={styles["new-data"]}>
            <p>
              Wallet Balance:{" "}
              {balance !== null ? (
                balance
              ) : (
                <img src={loader} className={styles["loader"]} />
              )}
            </p>
          </div>
        ) : null}

        <div className={styles["gradient-container2"]}></div>
        {walletMessage && <p className={styles["wallet-message"]}>{walletMessage}</p>}

        <div
          className={`${styles['logo-container']} ${tapLimitReached ? "disabled" : ""}`}
          onClick={tapLimitReached ? null : handleImagePress}
        >
          {/* <img
            src={logo}
            className={`${styles['home-image-logo']} ${isPressed ? "pressed" : ""}`}
            alt="Logo"
          /> */}
             <FolksTapper
                    canIClickPlease={true}
                    sleep={false}
                    funMode={false}
                    clickValue={1}
                    cooldown={0}
                    handleClick={() => {}}
                />
          {!tapLimitReached &&
            coins.map((coin) => (
              <img
                key={coin.id}
                src={bitcoinImage}
                className={styles["coin-animation"]}
                alt="Coin"
              />
            ))}
        </div>
        {modalOpen && (
          <div className={styles["modal-overlay"]}>
            <div className={styles["modal-content"]}>
              <p>{modalMessage}</p>
            </div>
          </div>
        )}
      </div>

      {/* {isTelegramSaved && (
        <Task
          telegramUserId={telegramUserId}
          updateTaskPoints={(points) => setTaskPoints((prev) => prev + points)}
          updateTotalPoints={(points) =>
            setTotalPoints((prev) => prev + points)
          }
        />
      )} */}

      <ReferralModal isOpen={isReferralModalOpen} onClose={() => setIsReferralModalOpen(false)} />
      <DailyRewardModal
        isOpen={showDailyReward}
        onClose={() => setShowDailyReward(false)}
        onClaim={handleDailyRewardClaim}
        currentDay={currentDay}
      />
    </div>
  );
};

export default Home;




// useEffect(() => {
//   const checkTelegramStatus = async () => {
//     const telegramStatus = await isTMA();
//     setInTelegram(telegramStatus);
//   };
//   checkTelegramStatus();
// }, []);

// const saveUserDetails = async () => {
//   try {
//     if (isUserSaved) return;
//     console.log("Saving user data in the background...");
//     await API.post("/user", JSON.stringify({ uid: user.id }));
//     setIsUserSaved(true);
//     console.log("User data saved successfully.");
//   } catch (error) {
//     console.error("Error saving user details:", error);
//   }
// };

