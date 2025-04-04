/** 3P Dependecies */
import React, { createContext, useEffect, useState } from "react";

const CoinContext = createContext();
const CoinProvider = ({ children }) => {
  const apiIp = process.env.REACT_APP_API_URL;
  const [totalCoins, setTotalCoins] = useState(0);
  const walletAddress = localStorage.getItem("walletAddress");
  const [tasks,setTasks] = useState([])

  const addCoins = (coins) => {
    setTotalCoins((prevCoins) => prevCoins + coins);
  };

  return (
    <CoinContext.Provider
      value={{
        totalCoins,
        addCoins,
        // fetchTasks,
        setTasks,
        tasks
      }}
    >
      {children}
    </CoinContext.Provider>
  );
};

export { CoinContext, CoinProvider };