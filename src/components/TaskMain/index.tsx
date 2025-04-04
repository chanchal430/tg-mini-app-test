/** 3P Dependecies */
import React from "react";

/** Local Imports */
import Task from "../Task";

/** Styles */
import styles from "./styles.module.css";

const TaskMain = () => {
  return (
    <div className={styles["task-main-container"]}>
      <span className={styles["task-title"]}>Folks Finance</span>
      <div className={styles["task-main-container-div"]}>
        <Task />
      </div>
    </div>
  );
};

export default TaskMain;
