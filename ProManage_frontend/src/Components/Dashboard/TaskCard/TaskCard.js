import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./TaskCard.module.css";
import burgerIcon from "../../../Assets/burger.png";
import collapseIcon from "../../../Assets/Arrow.png";
import formatDueDate from "../../../Utils/DueDateFormat";
import EditTask from "../../EditTask/EditTask";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TaskCard = ({
  task,
  section,
  isCollapsed,
  setCheck,
  handleChangeTaskSection,
  handleDeleteTask,
}) => {
  const [isChecklistCollapsed, setIsChecklistCollapsed] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const token = localStorage.getItem("token");
  const [isCheck, setIsCheck] = useState(false);
  const [deleteQuizId, setDeleteQuizId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleToggleChecklist = () => {
    setIsChecklistCollapsed(!isChecklistCollapsed);
  };

  useEffect(() => {
    setIsChecklistCollapsed(isCollapsed);
  }, [isCollapsed]);

  const getPriorityClass = (priority) => {
    switch (priority) {
      case "low":
        return styles.priorityLow;
      case "moderate":
        return styles.priorityModerate;
      case "high":
        return styles.priorityHigh;
      default:
        return "";
    }
  };

  const getInitials = (email) => {
    if (!email) return "";
    const [username] = email.split("@");
    const initials = username.substring(0, 2).toUpperCase();
    return initials;
  };

  const handleCheckItem = async (taskId, checklistId, checked) => {
    task.checklists = task.checklists.map((item) =>
      item._id === checklistId ? { ...item, checked: checked } : item
    );

    setIsCheck(!isCheck);

    try {
      await axios({
        method: "patch",
        url: `${process.env.REACT_APP_BACKEND_HOST}/api/task/updateChecklistChecked/${taskId}`,
        headers: { Authorization: `${token}` },
        data: { checklistId, checked },
      });
    } catch (error) {
      console.error("Error updating checklist item:", error);
    }
  };

  const handleShareTask = async (taskId) => {
    try {
      const response = await axios({
        method: "get",
        url: `${process.env.REACT_APP_BACKEND_HOST}/api/task/shareTask/${taskId}`,
        headers: { Authorization: `${token}` },
      });
      navigator.clipboard.writeText(response.data.shareableLink);
      toast.success("Share Link copied");
    } catch (error) {
      console.error("Error sharing quiz:", error);
      toast.error("Failed to copy link");
    }
  };

  return (
    <div className={styles.taskCard}>
      <div className={styles.header}>
        <div className={styles.priority}>
          <div
            className={`${styles.priorityBullet} ${getPriorityClass(
              task.priority
            )}`}
          />
          <span>{task.priority.toUpperCase() + " PRIORITY"}</span>
          {task.assignPerson && (
            <div className={styles.assignedPerson}>
              {getInitials(task.assignPerson)}
            </div>
          )}
        </div>
        <div
          className={styles.burgerMenu}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <img src={burgerIcon} alt="burgericon" />
          <div
            className={`${styles.menuContent} ${menuOpen ? styles.open : ""}`}
          >
            <div
              className={styles.menuItem}
              onClick={() => setIsModalOpen(true)}
            >
              Edit
            </div>
            <div
              className={styles.menuItem}
              onClick={() => handleShareTask(task._id)}
            >
              Share
            </div>
            <div
              className={styles.menuDeleteItem}
              onClick={() => setDeleteQuizId(task._id)}
            >
              Delete
            </div>
          </div>
        </div>
        {isModalOpen && (
          <EditTask
            taskId={task._id}
            setCheck={setCheck}
            onClose={() => setIsModalOpen(false)}
          />
        )}
      </div>
      <div className={styles.taskTitle}>{task.title}</div>
      <div className={styles.taskChecklist}>
        <span>
          {`Checklist (${
            task.checklists.filter((item) => item.checked).length
          }/${task.checklists.length})`}
        </span>
        <img
          onClick={handleToggleChecklist}
          src={collapseIcon}
          alt="collapseIcon"
        />
      </div>
      {!isChecklistCollapsed && (
        <div className={styles.checklistItems}>
          {task.checklists.map((item) => (
            <div key={item._id} className={styles.checklistItem}>
              <input
                type="checkbox"
                style={{ accentColor: "#17A2B8" }}
                checked={item.checked}
                onChange={(e) =>
                  handleCheckItem(task._id, item._id, e.target.checked)
                }
              />
              <span>{item.description}</span>
            </div>
          ))}
        </div>
      )}
      <div className={styles.taskButtons}>
        {task.dueDate && (
          <div
            className={`${styles.dueDate} ${
              section === "done"
                ? styles.completed
                : new Date(task.dueDate) < new Date()
                ? styles.overdue
                : ""
            }`}
          >
            {formatDueDate(task.dueDate)}
          </div>
        )}
        <div className={styles.taskSectionButtons}>
          {section !== "backlog" && (
            <button
              onClick={() => handleChangeTaskSection(task._id, "backlog")}
            >
              BACKLOG
            </button>
          )}
          {section !== "to do" && (
            <button onClick={() => handleChangeTaskSection(task._id, "todo")}>
              TODO
            </button>
          )}
          {section !== "in Progress" && (
            <button
              onClick={() => handleChangeTaskSection(task._id, "in progress")}
            >
              PROGRESS
            </button>
          )}
          {section !== "done" && (
            <button
              onClick={() => handleChangeTaskSection(task._id, "completed")}
            >
              DONE
            </button>
          )}
        </div>
      </div>
      {deleteQuizId && (
        <div className={styles.modalBox}>
          <div className={styles.modalBoxContent}>
            <p>Are you sure you want to Delete ?</p>
            <div className={styles.modalButtons}>
              <button onClick={() => handleDeleteTask(deleteQuizId)}>
                Yes, Delete
              </button>
              <button onClick={() => setDeleteQuizId(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskCard;
