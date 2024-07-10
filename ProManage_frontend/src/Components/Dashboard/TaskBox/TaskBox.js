import React, { useState } from "react";
import axios from "axios";
import styles from "./TaskBox.module.css";
import TaskCard from "../TaskCard/TaskCard";
import CollapseAllIcon from "../../../Assets/collapseall.png";
import AddIcon from "../../../Assets/plus.png";
import AddTask from "../../AddTask/AddTask";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TaskBox = ({
  section,
  tasks = [],
  allTasks = [],
  setCheck,
  setTasks,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const token = localStorage.getItem("token");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCollapseAll = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleChangeTaskSection = async (taskId, newSection) => {
    const sections = [
      "backlogTasks",
      "todoTasks",
      "inProgressTasks",
      "completedTasks",
    ];

    const updatedTasks = { ...allTasks };

    var taskToMove;
    let setSection;

    console.log(updatedTasks);

    // Find and remove the task from its current section
    for (const section of sections) {
      updatedTasks[section] = updatedTasks[section]
        .map((task) => {
          if (task._id === taskId) {
            taskToMove = task;
            return null;
          }
          return task;
        })
        .filter((task) => task !== null);
    }

    console.log(updatedTasks);

    if (newSection === "todo") {
      setSection = "todoTasks";
    } else if (newSection === "backlog") {
      setSection = "backlogTasks";
    } else if (newSection === "in progress") {
      setSection = "inProgressTasks";
    } else {
      setSection = "completedTasks";
    }

    if (taskToMove) {
      // Add the task to the new section
      updatedTasks[setSection] = [...updatedTasks[setSection], taskToMove];
    }

    setTasks(updatedTasks);

    try {
      await axios({
        method: "patch",
        url: `${process.env.REACT_APP_BACKEND_HOST}/api/task/updateTaskSection/${taskId}`,
        headers: { Authorization: `${token}` },
        data: { newSection },
      });
    } catch (error) {
      console.error("Error updating task section:", error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    setTasks((allTasks) => {
      const updatedTasks = { ...allTasks };

      for (const section in updatedTasks) {
        updatedTasks[section] = updatedTasks[section].filter(
          (task) => task._id !== taskId
        );
      }

      return updatedTasks;
    });

    try {
      await axios({
        method: "delete",
        url: `${process.env.REACT_APP_BACKEND_HOST}/api/task/deleteTask/${taskId}`,
        headers: { Authorization: `${token}` },
      });
      toast.success("Task deleted successfully");
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  return (
    <div className={styles.taskBox}>
      <div className={styles.taskBoxHeader}>
        <span>{section.charAt(0).toUpperCase() + section.slice(1)}</span>
        <div>
          {section === "to do" && (
            <button
              className={styles.addButton}
              onClick={() => setIsModalOpen(true)}
            >
              <img src={AddIcon} alt="add" />
            </button>
          )}
          {isModalOpen && (
            <AddTask
              allTasks={allTasks}
              onClose={() => setIsModalOpen(false)}
            />
          )}
          <img
            className={styles.collapseAllButton}
            onClick={handleCollapseAll}
            src={CollapseAllIcon}
            alt="collapse all"
          />
        </div>
      </div>
      <div className={styles.taskCards}>
        {tasks.length !== 0 &&
          tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              allTasks={allTasks}
              setCheck={setCheck}
              section={section}
              isCollapsed={isCollapsed}
              handleChangeTaskSection={handleChangeTaskSection}
              handleDeleteTask={handleDeleteTask}
            />
          ))}
      </div>
    </div>
  );
};

export default TaskBox;
