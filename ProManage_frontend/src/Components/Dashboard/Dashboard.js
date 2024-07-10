import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../Navbar/Navbar";
import styles from "./Dashboard.module.css";
import TaskBox from "./TaskBox/TaskBox";
import AddEmail from "./AddEmail/AddEmail";
import people from "../../Assets/people.png";
import format from "../../Utils/FormatDate";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Dashboard = () => {
  const userName = localStorage.getItem("name");
  const token = localStorage.getItem("token");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filters, setFilters] = useState("week");
  const [tasks, setTasks] = useState([]);
  const [check, setCheck] = useState(false);

  const fetchFilteredTasks = async (filters) => {
    try {
      const response = await axios({
        method: "get",
        url: `${process.env.REACT_APP_BACKEND_HOST}/api/task/filteredTasks?filter=${filters}`,
        headers: { Authorization: `${token}` },
      });
      setTasks(response.data);
      console.log(tasks);
    } catch (error) {
      console.error("Error fetching filtered tasks:", error);
    }
  };

  useEffect(() => {
    fetchFilteredTasks(filters);
  }, [filters, check]);

  return (
    <div className={styles.boardContainer}>
      <Navbar option="Dashboard" />
      <div className={styles.boardContent}>
        <div className={styles.header}>
          <div className={styles.welcome}>Welcome! {userName}</div>
          <div className={styles.date}>{format(new Date())}</div>
        </div>
        <div className={styles.boardHeader}>
          <div className={styles.boardHeading}>
            <span>Board</span>
            <button
              className={styles.addPeopleButton}
              onClick={() => setIsModalOpen(true)}
            >
              <img src={people} alt="people icon" />
              Add People
            </button>
            {isModalOpen && <AddEmail onClose={() => setIsModalOpen(false)} />}
          </div>
          <div className={styles.filter}>
            <select
              value={filters}
              onChange={(e) => setFilters(e.target.value)}
            >
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
          </div>
        </div>
        <div className={styles.taskBoxes}>
          <TaskBox
            section="backlog"
            tasks={tasks["backlogTasks"]}
            allTasks={tasks}
            setTasks={setTasks}
            setCheck={setCheck}
          />
          <TaskBox
            section="to do"
            tasks={tasks["todoTasks"]}
            allTasks={tasks}
            setTasks={setTasks}
            setCheck={setCheck}
          />
          <TaskBox
            section="in Progress"
            tasks={tasks["inProgressTasks"]}
            allTasks={tasks}
            setTasks={setTasks}
            setCheck={setCheck}
          />
          <TaskBox
            section="done"
            tasks={tasks["completedTasks"]}
            allTasks={tasks}
            setTasks={setTasks}
            setCheck={setCheck}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
