import React from "react";
import Task from "../Task/Task";
import "./TaskMain.css";
const TaskMain = () => {
  return (
    <div className="task-main-container">
      <span className="task-title">Folks Finance</span>
      <div className="task-main-container-div">
        <Task />
      </div>
    </div>
  );
};

export default TaskMain;
