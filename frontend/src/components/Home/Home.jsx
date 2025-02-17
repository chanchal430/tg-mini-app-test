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

  const effectRan = useRef(false);

  useEffect(() => {
    if (userFriendlyAddress) {
      sendWalletAddress();
    }
  }, [userFriendlyAddress]);

  const sendWalletAddress = async () => {
    if (!userFriendlyAddress) return;

    try {
      const response = await fetch(`${apiIp}api/connectWallet`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ walletAddress: userFriendlyAddress }),
      });

      const data = await response.json();
      console.log("API Response:", data);

      if (response.ok && data.success) {
        setWalletConnected(true);
        setEarnPerTap(data.user.tapPoints);
        setGamePoints(data.user.gamePoints);
        setTaskPoints(data.user.taskPoints);
        setTotalPoints(data.user.totalPoints);
        // setName(`${data.user.firstName} ${data.user.lastName}`);
        if (
          data.user.firstName.trim() !== "" ||
          data.user.lastName.trim() !== ""
        ) {
          setName(`${data.user.firstName} ${data.user.lastName}`);
        } else {
          setName("Hello User");
        }
        localStorage.setItem("walletAddress", userFriendlyAddress);
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
    if (walletConnected) {
      const fetchBalance = async () => {
        try {
          const response = await fetch(
            `https://tonapi.io/v2/accounts/${encodeURIComponent(
              userFriendlyAddress
            )}`
          );
          const data = await response.json();
          setBalance(data.balance);
        } catch (error) {
          console.error("Error fetching balance:", error);
        }
      };
      fetchBalance();
    }
  }, [walletConnected]);

  const removeAddress = () => {
    setWalletInfo(null);
    setWalletConnected(false);
    localStorage.removeItem("walletConnected");
    localStorage.removeItem("walletAddress");
    setEarnPerTap(0);
    setGamePoints(0);
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
    if (!walletConnected) {
      setWalletMessage("Please connect your wallet first!");
      setTimeout(() => setWalletMessage(""), 2000);
      return;
    }

    if (tapLimitReached) return;

    setIsPressed(true);
    const walletAddress = localStorage.getItem("walletAddress");

    try {
      const response = await fetch(`${apiIp}api/updateTapPoints`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "wallet-address": walletAddress,
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
          {/* <h5>{name ? name:'Hello User'} </h5> */}
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
              {/* <h3>Error</h3> */}
              <p>{modalMessage}</p>
              {/* <button onClick={() => setModalOpen(false)}>Close</button> */}
            </div>
          </div>
        )}
      </div>

      <Task
        walletConnected={walletConnected}
        updateTaskPoints={(points) => setTaskPoints((prev) => prev + points)}
        updateTotalPoints={(points) => setTotalPoints((prev) => prev + points)}
      />
    </div>
  );
};

export default Home;

// import React, { useEffect, useRef, useState } from "react";
// import "./Home.css";
// import logo from "../../assets/images/logo.png";
// import unionlogo from "../../assets/images/Union.svg";
// import folkImage from "../../assets/images/image 3.png";
// import bitcoinImage from "../../assets/images/bitcoin.svg";
// import Task from "../Task/Task";
// import { useTonAddress } from "@tonconnect/ui-react";
// import { useTonConnectUI } from "@tonconnect/ui-react";
// import loader from "../../assets/images/Loader.gif";
// import { TonConnectButton } from "@tonconnect/ui-react";
// // import { TonConnect } from "@tonconnect/sdk";

// const Home = () => {
//   const apiIp = process.env.REACT_APP_API_URL;

//   console.log("apiIp === ", apiIp);
//   const userFriendlyAddress = useTonAddress();
//   // const { totalCoins } = useCoins();
//   const [walletConnected, setWalletConnected] = useState(false);
//   const [balance, setBalance] = useState(null);
//   const [tonConnectUI] = useTonConnectUI();
//   const [earnPerTap, setEarnPerTap] = useState(0);
//   const [gamePoints, setGamePoints] = useState(
//     localStorage.getItem("gamePoints") || 0
//   );
//   const [taskPoints, setTaskPoints] = useState(0);
//   const [walletInfo, setWalletInfo] = useState(null);

//   const [totalPoints, setTotalPoints] = useState(0);
//   const [tapLimitReached, setTapLimitReached] = useState(false);
//   const [name, setName] = useState("");
//   const [coins, setCoins] = useState([]);
//   const [isPressed, setIsPressed] = useState(false);
//   const [modalOpen, setModalOpen] = useState(false);
//   const [modalMessage, setModalMessage] = useState("");
//   const effectRan = useRef(false);
//   const [walletMessage, setWalletMessage] = useState("");
//   useEffect(() => {
//     if (!effectRan.current && userFriendlyAddress) {
//       effectRan.current = true;
//       setWalletConnected(true);
//       sendWalletAddress();
//     }
//   }, [userFriendlyAddress]);

//   // useEffect(async () => {
//   //   if (userFriendlyAddress) {
//   //     setWalletConnected(true);
//   //     await sendWalletAddress();
//   //   }
//   // }, [userFriendlyAddress]);

//   useEffect(() => {
//     const fetchBalance = async () => {
//       if (userFriendlyAddress) {
//         try {
//           const response = await fetch(
//             `https://tonapi.io/v2/accounts/${encodeURIComponent(
//               userFriendlyAddress
//             )}`
//           );
//           const data = await response.json();
//           setBalance(data.balance);
//         } catch (error) {
//           console.error("Error fetching balance:", error);
//         }
//       }
//     };
//     fetchBalance();
//   }, [userFriendlyAddress]);

//   const sendWalletAddress = async () => {
//     try {
//       const response = await fetch(`${apiIp}/api/connectWallet`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ walletAddress: userFriendlyAddress }),
//       });

//       const data = await response.json();
//       console.log("data from API", data);

//       if (data.success===true) {
//         setEarnPerTap(data.user.tapPoints);
//         setGamePoints(data.user.gamePoints);
//         setTaskPoints(data.user.taskPoints);
//         setTotalPoints(data.user.totalPoints);
//         setName(`${data.user.firstName} ${data.user.lastName}`);
//         localStorage.setItem("walletAddress", userFriendlyAddress);
//         console.log("walletAddresss=====", userFriendlyAddress);
//       }
//     } catch (error) {
//       console.error("Error sending wallet address:", error);
//     }
//   };
//   const connectAddress = () => {
//     localStorage.setItem("walletConnected", "true");
//   };

//   useEffect(() => {
//     if (localStorage.getItem("walletConnected") === "true") {
//       localStorage.removeItem("walletConnected");
//       return;
//     }

//     const unsubscribe = tonConnectUI.onStatusChange((walletInfo) => {
//       if (walletInfo && walletInfo.account) {
//         setWalletInfo(walletInfo);
//         connectAddress();
//       }
//     });

//     return () => unsubscribe();
//   }, []);

//   useEffect(() => {
//     const unsubscribe = tonConnectUI.onStatusChange((walletInfo) => {
//       if (!walletInfo || !walletInfo.account) {
//         removeAddress();
//       }
//     });

//     return () => unsubscribe();
//   }, [tonConnectUI]);

//   const removeAddress = () => {
//     setWalletInfo(null);
//     setWalletConnected(false);
//     localStorage.removeItem("walletConnected");
//     localStorage.removeItem("walletInfo");
//     localStorage.removeItem("walletAddress");
//     setEarnPerTap(0);
//     setGamePoints(0);
//     setTaskPoints(0);
//     setTotalPoints(0);
//   };

//   // useEffect(() => {
//   //   if (userFriendlyAddress) {
//   //     setWalletConnected(true);

//   //     const fetchUserData = async () => {
//   //       try {
//   //         const response = await fetch(`${apiIp}/api/connectWallet`, {
//   //           method: "POST",
//   //           headers: {
//   //             "Content-Type": "application/json",
//   //           },
//   //           body: JSON.stringify({ walletAddress: userFriendlyAddress }),
//   //         });

//   //         const data = await response.json();
//   //         console.log("Updated user data:", data);

//   //         localStorage.setItem("walletAddress", data.user.walletAddress);

//   //         if (response.ok) {
//   //           setEarnPerTap(data.user.tapPoints);

//   //           setGamePoints(localStorage.getItem("gamePoints"))
//   //           // setGamePoints(data.user.gamePoints);
//   //           setTaskPoints(data.user.taskPoints);
//   //           setTotalPoints(data.user.totalPoints);
//   //           if (
//   //             data.user.firstName.trim() !== "" ||
//   //             data.user.lastName.trim() !== ""
//   //           ) {
//   //             setName(`${data.user.firstName} ${data.user.lastName}`);
//   //           } else {
//   //             setName("Hello User");
//   //           }
//   //         }
//   //       } catch (error) {
//   //         console.error("Error fetching user data:", error);
//   //       }
//   //     };

//   //     fetchUserData();
//   //   } else {
//   //     removeAddress();
//   //   }
//   // },[]);

//   const handleImagePress = async () => {
//     if (!walletConnected) {
//       setWalletMessage("Please connect your wallet first!");
//       setTimeout(() => setWalletMessage(""), 2000);
//       return;
//     }

//     if (tapLimitReached) return;

//     setIsPressed(true);
//     const walletAddress = localStorage.getItem("walletAddress");

//     try {
//       const response = await fetch(`${apiIp}/api/updateTapPoints`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           "wallet-address": walletAddress,
//         },
//         body: JSON.stringify({
//           walletAddress: userFriendlyAddress,
//           points: 2,
//         }),
//       });

//       const data = await response.json();
//       console.log("Tap points and total points updated:", data);

//       if (!response.ok || data.success === false) {
//         setModalMessage(data.error || "Failed to update tap points");
//         setModalOpen(true);

//         setTimeout(() => {
//           setModalOpen(false);
//         }, 2000);

//         if (data.error.includes("You have reached the daily limit")) {
//           setTapLimitReached(true);
//         }
//         return;
//       }

//       setEarnPerTap(data.updatedTapPoints || earnPerTap + 2);
//       setTotalPoints(data.updatedTotalPoints || totalPoints + 2);
//     } catch (error) {
//       console.error("Error updating tap points:", error);
//       setModalMessage(
//         "An error occurred while updating tap points. Please try again later."
//       );
//       setModalOpen(true);
//       setTimeout(() => {
//         setModalOpen(false);
//       }, 2000);
//     }

//     if (navigator.vibrate) {
//       navigator.vibrate(200);
//     }

//     const newCoin = { id: Date.now() };
//     setCoins((prevCoins) => [...prevCoins, newCoin]);

//     setTimeout(() => {
//       setCoins((prevCoins) =>
//         prevCoins.filter((coin) => coin.id !== newCoin.id)
//       );
//     }, 1000);

//     setTimeout(() => {
//       setIsPressed(false);
//     }, 150);
//   };

//   return (
//     <div className="home-container">
//       <h3 className="home-heading">Folks Finance</h3>
//       <div className="home-header">
//         <div className="profile-div">
//           <img src={unionlogo} alt="Union Logo" />
//           <h5>{name} </h5>
//         </div>
//         <div className="folkImage-div">
//           <img src={folkImage} alt="Folk Logo" />
//           <h5>Folk</h5>
//         </div>
//       </div>

//       <div className="home-main-container">
//         <div className="home-main-cards">
//           <div className="home-main-card">
//             <span className="home-card1-span">Earn per tap</span>
//             <div className="home-bitcoin-card">
//               <img src={bitcoinImage} alt="Bitcoin" />
//               <span>+{earnPerTap}</span>
//             </div>
//           </div>
//           <div className="home-main-card">
//             <span className="home-card2-span">Earn from Tasks</span>
//             <div className="home-bitcoin-card">
//               <img src={bitcoinImage} alt="Bitcoin" />
//               <span>+{taskPoints}</span>
//             </div>
//           </div>
//           <div className="home-main-card">
//             <span className="home-card3-span">Earn from Games</span>
//             <div className="home-bitcoin-card">
//               <img src={bitcoinImage} alt="Bitcoin" />
//               <span>+{gamePoints}</span>
//             </div>
//           </div>
//         </div>

//         <div className="home-div2">
//           <img src={bitcoinImage} alt="Bitcoin" />
//           {totalPoints !== null ? <h4>{totalPoints}</h4> : <h4>Loading</h4>}
//         </div>
//         <TonConnectButton />
//         {walletConnected ? (
//           <div className="new-data">
//             <p>
//               Wallet Balance:{" "}
//               {balance !== null ? (
//                 balance
//               ) : (
//                 <img src={loader} className="loader" />
//               )}
//             </p>
//             {/* <span>{shortAddress(userFriendlyAddress)}</span> */}
//           </div>
//         ) : null}

//         <div className="gradient-container2"></div>
//         {walletMessage && <p className="wallet-message">{walletMessage}</p>}

//         <div
//           className={`logo-container ${tapLimitReached ? "disabled" : ""}`}
//           onClick={tapLimitReached ? null : handleImagePress}
//         >
//           <img
//             src={logo}
//             className={`home-image-logo ${isPressed ? "pressed" : ""}`}
//             alt="Logo"
//           />
//           {!tapLimitReached &&
//             coins.map((coin) => (
//               <img
//                 key={coin.id}
//                 src={bitcoinImage}
//                 className="coin-animation"
//                 alt="Coin"
//               />
//             ))}
//         </div>
//         {modalOpen && (
//           <div className="modal-overlay">
//             <div className="modal-content">
//               {/* <h3>Error</h3> */}
//               <p>{modalMessage}</p>
//               {/* <button onClick={() => setModalOpen(false)}>Close</button> */}
//             </div>
//           </div>
//         )}
//       </div>

//       <Task   walletConnected={walletConnected}
//   updateTaskPoints={(points) => setTaskPoints((prev) => prev + points)}
//   updateTotalPoints={(points) => setTotalPoints((prev) => prev + points)}/>
//     </div>
//   );
// };

// export default Home;
