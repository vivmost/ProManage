import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./Task.module.css";
import formatDueDate from "../../Utils/DueDateFormat.js";
import Logo from "../../Assets/Logo.png";
import { useParams } from "react-router-dom";

const Task = () => {
  const { taskId } = useParams();
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("");
  const [assignedPerson, setAssignedPerson] = useState("");
  const [dueDate, setDueDate] = useState(null);
  const [checklists, setChecklists] = useState([]);

  useEffect(() => {
    const fetchTaskData = async () => {
      try {
        const response = await axios({
          method: "get",
          url: `${process.env.REACT_APP_BACKEND_HOST}/api/task/taskById/${taskId}`,
        });
        const taskData = response.data;
        setTitle(taskData.title);
        setPriority(taskData.priority);
        if (taskData.assignPerson !== "") {
          setAssignedPerson(taskData.assignPerson);
        }
        setAssignedPerson(taskData.assignPerson);
        setDueDate(taskData.dueDate);
        setChecklists(taskData.checklists);
      } catch (error) {
        console.error("Error fetching task data:", error);
      }
    };
    fetchTaskData();
  }, []);

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

  return (
    <div className={styles.taskContainer}>
      <div className={styles.logoHeader}>
        <img src={Logo} alt="Pro Manage Logo" />
        <h3>Pro Manage</h3>
      </div>
      <div className={styles.task}>
        <div className={styles.taskCard}>
          <div className={styles.header}>
            <div className={styles.priority}>
              <div
                className={`${styles.priorityBullet} ${getPriorityClass(
                  priority
                )}`}
              />
              <span>{priority.toUpperCase() + " PRIORITY"}</span>
              {assignedPerson && (
                <div className={styles.assignedPerson}>
                  {getInitials(assignedPerson)}
                </div>
              )}
            </div>
          </div>
          <div className={styles.taskTitle}>{title}</div>
          <div className={styles.taskChecklist}>
            <span>
              {`Checklist (${
                checklists.filter((item) => item.checked).length
              }/${checklists.length})`}
            </span>
          </div>
          <div className={styles.checklistItems}>
            {checklists.map((item) => (
              <div key={item._id} className={styles.checklistItem}>
                <input
                  type="checkbox"
                  style={{ accentColor: "#17A2B8" }}
                  checked={item.checked}
                />
                <span>{item.description}</span>
              </div>
            ))}
          </div>
          <div className={styles.taskButtons}>
            {dueDate && (
              <>
                <span>Due Date</span>
                <div className={styles.overdue}>{formatDueDate(dueDate)}</div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Task;
