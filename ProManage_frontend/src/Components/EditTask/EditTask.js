import React, { useState, useEffect } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styles from "./EditTask.module.css";
import Trash from "../../Assets/Delete.png";
import Select from "react-select";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditTask = ({ taskId, setCheck, onClose }) => {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("");
  const [assignedPerson, setAssignedPerson] = useState("");
  const [dueDate, setDueDate] = useState(null);
  const [checklists, setChecklists] = useState([]);
  const [addedPeople, setAddedPeople] = useState([]);
  const [initialData, setInitialData] = useState(null);
  const [renderCheck, setRenderCheck] = useState(false);

  const token = localStorage.getItem("token");
  const userEmail = localStorage.getItem("email");

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
        setInitialData(taskData);
      } catch (error) {
        console.error("Error fetching task data:", error);
      }
    };

    fetchAddedPeople();
    fetchTaskData();
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
        item._id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const handleRemoveChecklistsItem = (id) => {
    setChecklists(checklists.filter((item) => item._id !== id));
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
      assignPerson: assignedPerson,
      dueDate,
      checklists,
    };

    if (JSON.stringify(taskData) === JSON.stringify(initialData)) {
      toast.info("No changes made.");
      return;
    }

    try {
      await axios({
        method: "patch",
        url: `${process.env.REACT_APP_BACKEND_HOST}/api/task/editTask/${taskId}`,
        headers: { Authorization: `${token}` },
        data: taskData,
      });

      toast.success("Task updated successfully!");
      setCheck(!renderCheck);
      setRenderCheck(!renderCheck);
      onClose();
    } catch (error) {
      console.error("Error updating task:", error);
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
                  checked={priority === "high"}
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
                  checked={priority === "moderate"}
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
                  checked={priority === "low"}
                  onChange={(e) => setPriority(e.target.value)}
                />
                <span className={`${styles.bullet} ${styles.low}`}></span> LOW
                PRIORITY
              </label>
            </div>
          </div>

          {userEmail !== assignedPerson && (
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
          )}

          {userEmail === assignedPerson && (
            <span className={styles.assignedPersonSpan}>
              Assigned to you ({assignedPerson})
            </span>
          )}

          <div className={styles.checklistGroup}>
            <label>
              Checklists ({checklists.filter((item) => item.checked).length}/
              {checklists.length})<span>*</span>
            </label>
            {checklists.map((item) => (
              <div key={item._id} className={styles.checklistItem}>
                <input
                  type="checkbox"
                  checked={item.checked}
                  style={{ accentColor: "#17A2B8" }}
                  onChange={(e) =>
                    handleChecklistsChange(
                      item._id,
                      "checked",
                      e.target.checked
                    )
                  }
                />
                <input
                  type="text"
                  value={item.description}
                  onChange={(e) =>
                    handleChecklistsChange(
                      item._id,
                      "description",
                      e.target.value
                    )
                  }
                  className={styles.descriptionControl}
                />
                <img
                  src={Trash}
                  alt="trash icon"
                  onClick={() => handleRemoveChecklistsItem(item._id)}
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

export default EditTask;
