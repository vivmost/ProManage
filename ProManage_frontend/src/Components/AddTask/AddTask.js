import React, { useState, useEffect } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styles from "./AddTask.module.css";
import Trash from "../../Assets/Delete.png";
import Select from "react-select";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AddTask = ({ allTasks, onClose }) => {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("");
  const [assignedPerson, setAssignedPerson] = useState("");
  const [dueDate, setDueDate] = useState(null);
  const [checklists, setChecklists] = useState([]);
  const token = localStorage.getItem("token");
  const [addedPeople, setAddedPeople] = useState([]);

  useEffect(() => {
    const fetchAddedPeople = async () => {
      try {
        const response = await axios({
          method: "get",
          url: `${process.env.REACT_APP_BACKEND_HOST}/api/auth/addedPeople`,
          headers: { Authorization: `${token}` },
        });
        setAddedPeople(response.data);
      } catch (error) {
        console.error("Error fetching added people:", error);
      }
    };

    fetchAddedPeople();
  }, []);

  const handleAssign = (value) => {
    setAssignedPerson(value);
  };

  const customStyles = {
    control: (provided) => ({
      ...provided,
      width: "28rem",
      background: "white",
      borderColor: "#ccc",
      minHeight: "35px",
    }),
    option: (provided) => ({
      ...provided,
      display: "flex",
      alignItems: "center",
      border: "none",
      padding: "5px",
      backgroundColor: "white",
      color: "black",
      maxHeight: "4rem",
    }),
  };

  const formatOptionLabel = ({ value, label }) => (
    <div className={styles.assignOption}>
      <span className={styles.initials}>{value.slice(0, 2).toUpperCase()}</span>
      {label}
      <button
        type="button"
        className={styles.assignButton}
        onClick={() => handleAssign(value)}
      >
        Assign
      </button>
    </div>
  );

  const handleAddChecklistsItem = () => {
    setChecklists([
      ...checklists,
      { id: Date.now(), description: "", checked: false },
    ]);
  };

  const handleChecklistsChange = (id, field, value) => {
    setChecklists(
      checklists.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const handleRemoveChecklistsItem = (id) => {
    setChecklists(checklists.filter((item) => item.id !== id));
  };

  const handleSave = async () => {
    if (!title || !priority || checklists.length === 0) {
      toast.warning("Required field needs to be filled!");
      return;
    }

    for (const checklist of checklists) {
      if (!checklist.description.trim()) {
        toast.warning("Please fill out all checklists!");
        return;
      }
    }
    const taskData = {
      title,
      priority,
      assignedPerson,
      dueDate,
      checklists,
    };
    try {
      const response = await axios({
        method: "post",
        url: `${process.env.REACT_APP_BACKEND_HOST}/api/task/addTask`,
        headers: { Authorization: `${token}` },
        data: taskData,
      });

      const updatedTask = { ...allTasks };

      updatedTask["todoTasks"] = updatedTask["todoTasks"].push(
        response.data.savedTask
      );

      toast.success("Task added successfully!");
      onClose();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalBody}>
          <div className={styles.titleGroup}>
            <label className>
              Title <span>*</span>
            </label>
            <input
              type="text"
              placeholder="Enter Task Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={styles.titleControl}
            />
          </div>

          <div className={styles.priorityGroup}>
            <label>
              Select Priority <span>*</span>
            </label>
            <div className={styles.priorityOptions}>
              <label>
                <input
                  type="radio"
                  name="priority"
                  value="high"
                  onChange={(e) => setPriority(e.target.value)}
                />
                <span className={`${styles.bullet} ${styles.high}`}></span>
                HIGH PRIORITY
              </label>
              <label>
                <input
                  type="radio"
                  name="priority"
                  value="moderate"
                  onChange={(e) => setPriority(e.target.value)}
                />
                <span className={`${styles.bullet} ${styles.moderate}`}></span>{" "}
                MODERATE PRIORITY
              </label>
              <label>
                <input
                  type="radio"
                  name="priority"
                  value="low"
                  onChange={(e) => setPriority(e.target.value)}
                />
                <span className={`${styles.bullet} ${styles.low}`}></span> LOW
                PRIORITY
              </label>
            </div>
          </div>

          <div className={styles.assignToContainer}>
            <span>Assign to</span>
            <Select
              value={
                assignedPerson
                  ? { value: assignedPerson, label: assignedPerson }
                  : ""
              }
              onChange={() => handleAssign}
              options={addedPeople.map((person) => ({
                value: person.addEmail,
                label: person.addEmail,
              }))}
              styles={customStyles}
              formatOptionLabel={formatOptionLabel}
              isClearable
              placeholder="Add a assignee"
            />
          </div>

          <div className={styles.checklistGroup}>
            <label>
              Checklists ({checklists.filter((item) => item.checked).length}/
              {checklists.length})<span>*</span>
            </label>
            {checklists.map((item) => (
              <div key={item.id} className={styles.checklistItem}>
                <input
                  type="checkbox"
                  checked={item.checked}
                  style={{ accentColor: "#17A2B8" }}
                  onChange={(e) =>
                    handleChecklistsChange(item.id, "checked", e.target.checked)
                  }
                />
                <input
                  type="text"
                  value={item.description}
                  onChange={(e) =>
                    handleChecklistsChange(
                      item.id,
                      "description",
                      e.target.value
                    )
                  }
                  className={styles.descriptionControl}
                />
                <img
                  src={Trash}
                  alt="trash icon"
                  onClick={() => handleRemoveChecklistsItem(item.id)}
                  className={styles.deleteButton}
                />
              </div>
            ))}
            <span onClick={handleAddChecklistsItem} className={styles.addNew}>
              + Add New
            </span>
          </div>
        </div>
        <div className={styles.modalFooter}>
          <DatePicker
            selected={dueDate}
            placeholderText="Select Due Date"
            onChange={(date) => setDueDate(date)}
            dateFormat="MM/dd/yyyy"
            className={styles.dueDate}
            withPortal
          />
          <div>
            <button onClick={onClose} className={styles.cancelButton}>
              Cancel
            </button>
            <button onClick={handleSave} className={styles.saveButton}>
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddTask;
