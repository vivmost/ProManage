// src/Analytics.js

import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../Navbar/Navbar";
import styles from "./Analytics.module.css";

const Analytics = () => {
  const [taskData, setTaskData] = useState({
    backlog: 0,
    todo: 0,
    inProgress: 0,
    completed: 0,
    lowPriority: 0,
    moderatePriority: 0,
    highPriority: 0,
    dueDateTasks: 0,
  });
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchTaskData = async () => {
      try {
        const response = await axios({
          method: "get",
          url: `${process.env.REACT_APP_BACKEND_HOST}/api/task/taskAnalytics`,
          headers: { Authorization: `${token}` },
        });

        const taskData = response.data.analytics;

        setTaskData({
          backlog: taskData.taskSections.backlog || 0,
          todo: taskData.taskSections.todo || 0,
          inProgress: taskData.taskSections.inProgress || 0,
          completed: taskData.taskSections.completed || 0,
          lowPriority: taskData.priorities.low || 0,
          moderatePriority: taskData.priorities.moderate || 0,
          highPriority: taskData.priorities.high || 0,
          dueDateTasks: taskData.dueDateTasks || 0,
        });
      } catch (error) {
        console.error("Error fetching task analytics:", error);
      }
    };

    fetchTaskData();
  });

  const formatValue = (value) =>
    value !== 0 && value < 10 ? `0${value}` : value;

  return (
    <div className={styles.analyticsContainer}>
      <Navbar option="Analytics" />
      <div className={styles.analyticsContent}>
        <span className={styles.analyticsTitle}>Analytics</span>
        <div className={styles.boxContainer}>
          <div className={styles.box}>
            <div className={styles.boxItem}>
              <span className={styles.bullet}>&#8226;</span>
              <div className={styles.taskBox}>
                <span>Backlog Tasks</span>
                <span>{formatValue(taskData.backlog)}</span>
              </div>
            </div>
            <div className={styles.boxItem}>
              <span className={styles.bullet}>&#8226;</span>
              <div className={styles.taskBox}>
                <span>To-do Tasks</span>
                <span>{formatValue(taskData.todo)}</span>
              </div>
            </div>
            <div className={styles.boxItem}>
              <span className={styles.bullet}>&#8226;</span>
              <div className={styles.taskBox}>
                <span>In-Progress Tasks</span>{" "}
                <span>{formatValue(taskData.inProgress)}</span>
              </div>
            </div>
            <div className={styles.boxItem}>
              <span className={styles.bullet}>&#8226;</span>
              <div className={styles.taskBox}>
                <span>Completed Tasks</span>
                <span>{formatValue(taskData.completed)}</span>
              </div>
            </div>
          </div>
          <div className={styles.box}>
            <div className={styles.boxItem}>
              <span className={styles.bullet}>&#8226;</span>
              <div className={styles.taskBox}>
                <span>Low Priority</span>
                <span> {formatValue(taskData.lowPriority)}</span>
              </div>
            </div>
            <div className={styles.boxItem}>
              <span className={styles.bullet}>&#8226;</span>
              <div className={styles.taskBox}>
                <span>Moderate Priority</span>
                <span> {formatValue(taskData.moderatePriority)}</span>
              </div>
            </div>
            <div className={styles.boxItem}>
              <span className={styles.bullet}>&#8226;</span>
              <div className={styles.taskBox}>
                <span>High Priority</span>
                <span>{formatValue(taskData.highPriority)}</span>
              </div>
            </div>
            <div className={styles.boxItem}>
              <span className={styles.bullet}>&#8226;</span>
              <div className={styles.taskBox}>
                <span>Due Date Tasks</span>
                <span>{formatValue(taskData.dueDateTasks)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
