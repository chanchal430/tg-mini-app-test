import React, { useState, useEffect, useContext } from "react";
import "./Task.css";
import coinIcon from "../../assets/images/bitcoin.svg";
import { CoinContext } from "../../context/CoinContext";

const Task = () => {
  const { addCoins } = useContext(CoinContext);
  const [activeTab, setActiveTab] = useState("dailyTasks");
  const [tasks, setTasks] = useState({ dailyTasks: [], weeklyTasks: [], monthlyTasks: [] });
  const [loading, setLoading] = useState(true);
  const [isWalletConnected, setWalletConnected] = useState(false);  // Add state for wallet connection
  const apiIp = process.env.REACT_APP_API_URL;
  const walletAddress = localStorage.getItem("walletAddress");

  // Fetch tasks from the API
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${apiIp}api/tasks`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "wallet-address": walletAddress,
        },
      });

      const data = await response.json();

      if (data.success) {
        setTasks({
          dailyTasks: data.dailyTasks || [],
          weeklyTasks: data.weeklyTasks || [],
          monthlyTasks: data.monthlyTasks || [],
        });
      } else {
        console.error("API returned an error:", data.error);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (walletAddress) {
      setWalletConnected(true);
    } else {
      setWalletConnected(false); 
    }
  }, [walletAddress]);

  const switchTab = (tab) => {
    setActiveTab(tab);
  };

  const handleTaskClick = async (task, taskType) => {
    if (task.completed) return;

    window.open(task.link, "_blank");

    setTimeout(async () => {
      try {
        const response = await fetch(`${apiIp}api/completeTask`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "wallet-address": walletAddress,
          },
          body: JSON.stringify({
            taskId: task.id,
            taskType,
            points: task.coins,
          }),
        });

        const data = await response.json();

        if (data.success) {
          markTaskCompleted(task, taskType);
          fetchTasks();
        } else {
          alert(data.error);
        }
      } catch (error) {
        console.error("Error completing task:", error);
      }
    }, 3000);
  };

  const markTaskCompleted = (task, taskType) => {
    setTasks((prevTasks) => ({
      ...prevTasks,
      [taskType]: prevTasks[taskType].map((t) =>
        t.id === task.id ? { ...t, completed: true } : t
      ),
    }));
    addCoins(task.coins); 
  };

  return (
    <div className="task-container">
      <div className="task-tabs">
        {["dailyTasks", "weeklyTasks", "monthlyTasks"].map((tab) => (
          <button
            key={tab}
            className={`tab-button ${activeTab === tab ? "active" : ""}`}
            onClick={() => switchTab(tab)}
          >
            {tab.replace(/([A-Z])/g, " $1").trim().charAt(0).toUpperCase() +
              tab.replace(/([A-Z])/g, " $1").trim().slice(1)}
          </button>
        ))}
      </div>

      {isWalletConnected ? (
        loading ? (
          <p className="loading-text">Loading tasks...</p>
        ) : (
          <div className="task-list">
            {tasks[activeTab]?.length > 0 ? (
              tasks[activeTab].map((task) => (
                <div
                  key={task.id}
                  className={`task-card ${task.completed ? "disabled-card" : ""}`}
                >
                  <div className="task-header">
                    <img
                      src={task.icon}
                      alt={task.platform}
                      className="task-icon"
                    />
                    <div className="task-content">
                      <h3 className="task-title">{task.platform}</h3>
                      <p className="task-desc">{task.description}</p>
                      <p className="coin-reward">
                        <img
                          src={coinIcon}
                          alt="Coins"
                          className="coin-icon-task"
                        />{" "}
                        {task.coins} coins{" "}
                        {task.completed && "(Added to your account)"}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleTaskClick(task, activeTab)}
                    className={`task-btn ${task.completed ? "completed" : ""}`}
                    disabled={task.completed}
                  >
                    {task.completed ? "Completed" : "Subscribe"}
                  </button>
                </div>
              ))
            ) : (
              <p className="no-tasks">No tasks available for this category.</p>
            )}
          </div>
        )
      ) : (
        <p className="no-tasks">Please Connect Wallet To Get Your Tasks.</p>
      )}
    </div>
  );
};

export default Task;
