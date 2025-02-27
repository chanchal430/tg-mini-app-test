import React, { createContext, useEffect, useState } from "react";

const CoinContext = createContext();
const CoinProvider = ({ children }) => {
  const apiIp = process.env.REACT_APP_API_URL;
  const [totalCoins, setTotalCoins] = useState(0);
  const walletAddress = localStorage.getItem("walletAddress");
  const [tasks,setTasks] = useState([])
  // const fetchTasks = async () => {
  //   try {
  //     const response = await fetch(`${apiIp}api/tasks`, {
  //       method: "GET",
  //       headers: {
  //         "Content-Type": "application/json",
  //         "wallet-address": walletAddress,
  //       },
  //     });
  
  //     const data = await response.json();
  
  //     if (data.success) {
  //       setTasks({
  //         dailyTasks: data.dailyTasks,
  //         weeklyTasks: data.weeklyTasks,
  //         monthlyTasks: data.monthlyTasks,
  //       });
  //     }
  //   } catch (error) {
  //     console.error("Error fetching tasks:", error);
  //   }
  // };
  
  // useEffect(() => {
  //   fetchTasks();
  // }, []);
  
  // console.log("All taks ", tasks)

  // const getDailyTasks = async () => {
  //   const res = await fetch(`${apiIp}/api/dailyTasks`, {
  //     method: `GET`,
  //     headers: {
  //       "Content-Type": "application/json",
  //       "wallet-address": walletAddress,
  //     },
  //   });
  //   const result = await res.json();
  //   console.log("Result for Daily Taks === ", result);
  //   setDailyTasks(result.tasks ||[]);
  // };
  // const getWeeklyTasks = async () => {
  //   const res = await fetch(`${apiIp}/api/weeklyTasks`, {
  //     method: `GET`,
  //     headers: {
  //       "Content-Type": "application/json",
  //       "wallet-address": walletAddress,
  //     },
  //   });
  //   const result = await res.json();
  //   console.log("Result for Weekly Taks === ", result);
  //   setWeeklyTasks(result.tasks||[]);
  // };

  // const getMonthlyTasks = async () => {
  //   const res = await fetch(`${apiIp}/api/monthlyTasks`, {
  //     method: `GET`,
  //     headers: {
  //       "Content-Type": "application/json",
  //       "wallet-address": walletAddress,
  //     },
  //   });
  //   const result = await res.json();
  //   console.log("Result for Monthly Taks === ", result);
  //   setMonthlyTasks(result.tasks||[]);
  // };

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
