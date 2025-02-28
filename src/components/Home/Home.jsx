import React, { useEffect, useRef, useState } from "react";
import "./Home.css";
import logo from "../../assets/images/logo.png";
import unionlogo from "../../assets/images/Union.svg";
import folkImage from "../../assets/images/image 3.png";
import bitcoinImage from "../../assets/images/bitcoin.svg";
import Task from "../Task/Task";
import {
  useTonAddress,
  useTonConnectUI,
  TonConnectButton,
} from "@tonconnect/ui-react";
import loader from "../../assets/images/Loader.gif";

const Home = () => {
  const apiIp = process.env.REACT_APP_API_URL;
  console.log("apiIp === ", apiIp);

  const userFriendlyAddress = useTonAddress();
  const [tonConnectUI] = useTonConnectUI();

  const [walletConnected, setWalletConnected] = useState(false);
  const [balance, setBalance] = useState(null);
  const [earnPerTap, setEarnPerTap] = useState(0);
  const [gamePoints, setGamePoints] = useState(
    localStorage.getItem("gamePoints") || 0
  );
  const [taskPoints, setTaskPoints] = useState(0);
  const [walletInfo, setWalletInfo] = useState(null);
  const [totalPoints, setTotalPoints] = useState(0);
  const [tapLimitReached, setTapLimitReached] = useState(false);
  const [name, setName] = useState("");
  const [isPressed, setIsPressed] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [walletMessage, setWalletMessage] = useState("");
  const [coins, setCoins] = useState([]);
  const [telegramUserId, setTelegramUserId] = useState(null);
  const effectRan = useRef(false);
  const [isTelegramSaved, setIsTelegramSaved] = useState(false);

  useEffect(() => {
    if (window.Telegram && window.Telegram.WebApp) {
      window.Telegram.WebApp.ready();
      const user = window.Telegram.WebApp.initDataUnsafe.user;
      if (user) {
        const telegramUserId = user.id;
        console.log("telegramUserId", telegramUserId);
        setTelegramUserId(telegramUserId);
        localStorage.setItem("telegramUserId", telegramUserId);
        fetch(`${apiIp}api/save-telegram-id`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            telegramUserId: telegramUserId,
          }),
        })
          .then((res) => res.json())
          .then((data) => {
            console.log("Telegram ID saved:", data);
            if (data.message ==="Telegram user ID successfully saved") {
              setIsTelegramSaved(true);
            }
            else if(data.message==="User With this Telegram ID already exist"){
              setIsTelegramSaved(true);
            }
          })
          .catch((err) => console.error("Error sending Telegram ID:", err));
      }
    }
  }, []);


  const sendWalletAddress = async () => {

    try {
      const response = await fetch(`${apiIp}api/connectWallet`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ walletAddress: userFriendlyAddress }),
      });

      const data = await response.json();
      console.log("Wallet Connection API Response:", data);

      if (response.ok && data.success) {
        setWalletConnected(true);
        localStorage.setItem("walletAddress", userFriendlyAddress);
        console.log(
          "Wallet address saved to localStorage:",
          userFriendlyAddress
        );
      } else {
        console.error(
          "Wallet connection failed:",
          data.error || "Unknown error"
        );
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
    }
  };

  useEffect(() => {
    if (userFriendlyAddress) {
      sendWalletAddress();
    }
  }, [userFriendlyAddress]);

  useEffect(() => {
    if (!isTelegramSaved || !telegramUserId) return;

    const getUserData = async () => {
      try {
        const response = await fetch(`${apiIp}api/user`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "telegram-id": telegramUserId,
          },
        });

        if (response.ok) {
          const result = await response.json();
          console.log("User Data Response:", result);

          setEarnPerTap(result.user.tapPoints);
          // setGamePoints(result.user.gamePoints);
          setTaskPoints(result.user.taskPoints);
          setTotalPoints(result.user.totalPoints);

          if (result.user.firstName?.trim() || result.user.lastName?.trim()) {
            setName(`${result.user.firstName} ${result.user.lastName}`);
          } else {
            setName("Hello User");
          }
        } else {
          console.error("Failed to fetch user data");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    getUserData();
  }, [telegramUserId, isTelegramSaved]);

  const removeAddress = () => {
    setWalletInfo(null);
    setWalletConnected(false);
    localStorage.removeItem("walletConnected");
    localStorage.removeItem("walletAddress");
    setEarnPerTap(0);
    // setGamePoints(0);
    setTaskPoints(0);
    setTotalPoints(0);
  };

  useEffect(() => {
    const unsubscribe = tonConnectUI.onStatusChange((walletInfo) => {
      if (walletInfo?.account) {
        setWalletInfo(walletInfo);
      } else {
        removeAddress();
      }
    });
    return () => unsubscribe();
  }, [tonConnectUI]);

  const handleImagePress = async () => {
    if (!isTelegramSaved) {
      console.log("Waiting for Telegram API to complete...");
      return;
    }
    setIsPressed(true);
    const telegramUserId = localStorage.getItem("telegramUserId");

    try {
      console.log("Sending tap points update request...");
      const response = await fetch(`${apiIp}api/updateTapPoints`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "telegram-id": telegramUserId,
        },
        body: JSON.stringify({ walletAddress: userFriendlyAddress, points: 2 }),
      });

      const data = await response.json();
      console.log("Tap points updated:", data);

      if (!response.ok || data.success === false) {
        setModalMessage(data.error || "Failed to update tap points");
        setModalOpen(true);
        setTimeout(() => setModalOpen(false), 2000);

        if (data.error.includes("You have reached the daily limit")) {
          setTapLimitReached(true);
        }
        return;
      }

      setEarnPerTap(data.updatedTapPoints || earnPerTap + 2);
      setTotalPoints(data.updatedTotalPoints || totalPoints + 2);
    } catch (error) {
      console.error("Error updating tap points:", error);
      setModalMessage("An error occurred while updating tap points.");
      setModalOpen(true);
      setTimeout(() => setModalOpen(false), 2000);
    }

    if (navigator.vibrate) {
      navigator.vibrate(200);
    }

    const newCoin = { id: Date.now() };
    setCoins((prevCoins) => [...prevCoins, newCoin]);

    setTimeout(() => {
      setCoins((prevCoins) =>
        prevCoins.filter((coin) => coin.id !== newCoin.id)
      );
    }, 1000);

    setTimeout(() => {
      setIsPressed(false);
    }, 150);
  };

  return (
    <div className="home-container">
      <h3 className="home-heading">Folks Finance</h3>
      <div className="home-header">
        <div className="profile-div">
          <img src={unionlogo} alt="Union Logo" />

          <h5>{name && name !== "" ? name : "Hello User"}</h5>
        </div>
        <div className="folkImage-div">
          <img src={folkImage} alt="Folk Logo" />
          <h5>Folk</h5>
        </div>
      </div>

      <div className="home-main-container">
        <div className="home-main-cards">
          <div className="home-main-card">
            <span className="home-card1-span">Earn per tap</span>
            <div className="home-bitcoin-card">
              <img src={bitcoinImage} alt="Bitcoin" />
              <span>+{earnPerTap}</span>
            </div>
          </div>
          <div className="home-main-card">
            <span className="home-card2-span">Earn from Tasks</span>
            <div className="home-bitcoin-card">
              <img src={bitcoinImage} alt="Bitcoin" />
              <span>+{taskPoints}</span>
            </div>
          </div>
          <div className="home-main-card">
            <span className="home-card3-span">Earn from Games</span>
            <div className="home-bitcoin-card">
              <img src={bitcoinImage} alt="Bitcoin" />
              <span>+{gamePoints}</span>
            </div>
          </div>
        </div>
        {/* <h4>TelegramUserId: {telegramUserId}</h4> */}
        <div className="home-div2">
          <img src={bitcoinImage} alt="Bitcoin" />
          {totalPoints !== null ? <h4>{totalPoints}</h4> : <h4>Loading</h4>}
        </div>
        <TonConnectButton />
        {walletConnected ? (
          <div className="new-data">
            <p>
              Wallet Balance:{" "}
              {balance !== null ? (
                balance
              ) : (
                <img src={loader} className="loader" />
              )}
            </p>
            {/* <span>{shortAddress(userFriendlyAddress)}</span> */}
          </div>
        ) : null}

        <div className="gradient-container2"></div>
        {walletMessage && <p className="wallet-message">{walletMessage}</p>}

        <div
          className={`logo-container ${tapLimitReached ? "disabled" : ""}`}
          onClick={tapLimitReached ? null : handleImagePress}
        >
          <img
            src={logo}
            className={`home-image-logo ${isPressed ? "pressed" : ""}`}
            alt="Logo"
          />
          {!tapLimitReached &&
            coins.map((coin) => (
              <img
                key={coin.id}
                src={bitcoinImage}
                className="coin-animation"
                alt="Coin"
              />
            ))}
        </div>
        {modalOpen && (
          <div className="modal-overlay">
            <div className="modal-content">
              <p>{modalMessage}</p>
            </div>
          </div>
        )}
      </div>

      {isTelegramSaved && (
        <Task
          telegramUserId={telegramUserId}
          // isTelegramSaved={isTelegramSaved}
          updateTaskPoints={(points) => setTaskPoints((prev) => prev + points)}
          updateTotalPoints={(points) =>
            setTotalPoints((prev) => prev + points)
          }
        />
      )}
    </div>
  );
};

export default Home;

