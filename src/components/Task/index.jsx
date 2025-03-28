/** 3P Dependecies */
import React, { useState, useEffect, useContext } from "react";

/** Assets */
import coinIcon from "../../assets/images/bitcoin.svg";

/** Helpers */
import { CoinContext } from "../../context/CoinContext";

/** Styles */
import "./styles.module.css";


const Task = ({ telegramUserId }) => {
  const telegramUserIdHeader = localStorage.getItem("telegramUserId");
  const { addCoins } = useContext(CoinContext);
  const [activeTab, setActiveTab] = useState("dailyTasks");
  const [tasks, setTasks] = useState({
    dailyTasks: [],
    weeklyTasks: [],
    monthlyTasks: [],
  });
  const [loading, setLoading] = useState(true);
  const apiIp = process.env.REACT_APP_API_URL;

  const fetchTasks = async () => {
    if (!telegramUserIdHeader) {
      alert("Data Not Found");
      return;
    }
    try {
      console.log("Fetching tasks for telegramId:", telegramUserIdHeader);
      const response = await fetch(`${apiIp}/api/tasks`, {
        method: "GET",
        headers: {
          "telegram-id": telegramUserIdHeader,
        },
      });

      const result = await response.json();

      if (result.data.success) {
        setTasks({
          dailyTasks: result.data.dailyTasks || [],
          weeklyTasks: result.data.weeklyTasks || [],
          monthlyTasks: result.data.monthlyTasks || [],
        });
      } else {
        console.error("API returned an error:", result.error);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [telegramUserIdHeader]);

  const switchTab = (tab) => {
    setActiveTab(tab);
  };

  const handleTaskClick = async (task, taskType) => {
    if (task.completed) return;

    window.open(task.link, "_blank");

    setTimeout(async () => {
      try {
        const response = await fetch(`${apiIp}/api/completeTask`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "telegram-id": telegramUserIdHeader,
          },
          body: JSON.stringify({
            taskId: task.id,
            taskType,
            points: task.coins,
          }),
        });

        const data = await response.json();
        console.log("data from completTask Api", data);
        if (data.status) {
          markTaskCompleted(task, taskType);
          fetchTasks();
          window.location.reload();
        } else {
          alert(data.error);
        }
      } catch (error) {
        console.error("Error completing task:", error);
      }
    }, 1000);
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
            {tab
              .replace(/([A-Z])/g, " $1")
              .trim()
              .charAt(0)
              .toUpperCase() +
              tab
                .replace(/([A-Z])/g, " $1")
                .trim()
                .slice(1)}
          </button>
        ))}
      </div>

      <div className="task-list">
        {loading ? (
          <p className="loading-text">Loading tasks...</p>
        ) : tasks[activeTab]?.length > 0 ? (
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
    </div>
  );
};

export default Task;