// src/AddPeopleModal.js
import React, { useState } from "react";
import axios from "axios";
import styles from "./AddEmail.module.css";

const AddEmail = ({ onClose }) => {
  const [email, setEmail] = useState("");
  const token = localStorage.getItem("token");
  const [step, setStep] = useState(1);

  const handleAddEmail = async () => {
    try {
      await axios({
        method: "post",
        url: `${process.env.REACT_APP_BACKEND_HOST}/api/auth/addEmail`,
        headers: { Authorization: `${token}` },
        data: { email },
      });
      setStep(2);
    } catch (error) {
      console.error("Error adding email:", error);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        {step === 1 && (
          <div>
            <h4>Add people to the board</h4>
            <input
              type="email"
              placeholder="Enter the email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
            />
            <div className={styles.modalButtons}>
              <button onClick={() => onClose()} className={styles.cancelButton}>
                Cancel
              </button>
              <button
                onClick={() => handleAddEmail()}
                className={styles.addButton}
              >
                Add Email
              </button>
            </div>
          </div>
        )}
        {step === 2 && (
          <div className={styles.resultEmail}>
            <h2>{email} added to the board</h2>
            <button onClick={() => onClose()} className={styles.confirmButton}>
              Okay, got it!
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddEmail;
