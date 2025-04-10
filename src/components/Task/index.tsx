import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../store";
import { fetchTasks, completeTask as completeTaskThunk } from "../../store/slices/appSlice";
import coinIcon from "../../assets/images/bitcoin.svg";
import styles from "./styles.module.css";

export interface TaskItem {
  id: string;
  platform: string;
  description: string;
  coins: number;
  icon: string;
  link: string;
  completed: boolean;
}

const Task = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { telegramUserId } = useSelector((state: RootState) => state.user);
  const { tasks, loading } = useSelector((state: RootState) => state.app);

  const [activeTab, setActiveTab] = useState<"dailyTasks" | "weeklyTasks" | "monthlyTasks">("dailyTasks");

  useEffect(() => {
    if (telegramUserId) {
      dispatch(fetchTasks(telegramUserId));
    }
  }, [telegramUserId, dispatch]);

  const switchTab = (tab: "dailyTasks" | "weeklyTasks" | "monthlyTasks") => {
    setActiveTab(tab);
  };

  const handleTaskClick = async (task: TaskItem, taskType: string) => {
    if (task.completed) return;
    window.open(task.link, "_blank");
    await dispatch(completeTaskThunk({ telegramUserId, task, taskType }));
  };

  return (
    <div className={styles["task-container"]}>
      <div className={styles["task-tabs"]}>
        {["dailyTasks", "weeklyTasks", "monthlyTasks"].map((tab) => (
          <button
            key={tab}
            className={`${styles['tab-button']} ${activeTab === tab ? "active" : ""}`}
            onClick={() => switchTab(tab as "dailyTasks" | "weeklyTasks" | "monthlyTasks")}
          >
            {tab.replace(/([A-Z])/g, " $1").trim().replace(/^\w/, (c) => c.toUpperCase())}
          </button>
        ))}
      </div>

      <div className={styles["task-list"]}>
        {loading ? (
          <p className={styles["loading-text"]}>Loading tasks...</p>
        ) : tasks[activeTab]?.length > 0 ? (
          tasks[activeTab].map((task: TaskItem) => (
            <div
              key={task.id}
              className={`task-card ${task.completed ? "disabled-card" : ""}`}
            >
              <div className={styles["task-header"]}>
                <img
                  src={task.icon}
                  alt={task.platform}
                  className={styles["task-icon"]}
                />
                <div className={styles["task-content"]}>
                  <h3 className={styles["task-title"]}>{task.platform}</h3>
                  <p className={styles["task-desc"]}>{task.description}</p>
                  <p className="coin-reward">
                    <img
                      src={coinIcon}
                      alt="Coins"
                      className={styles["coin-icon-task"]}
                    />
                    {task.coins} coins {task.completed && "(Added to your account)"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleTaskClick(task, activeTab)}
                className={`${styles['task-btn']} ${task.completed ? "completed" : ""}`}
                disabled={task.completed}
              >
                {task.completed ? "Completed" : "Subscribe"}
              </button>
            </div>
          ))
        ) : (
          <p className={styles["no-tasks"]}>No tasks available for this category.</p>
        )}
      </div>
    </div>
  );
};

export default Task;
