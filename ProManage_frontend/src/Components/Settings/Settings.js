import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../Navbar/Navbar";
import styles from "./Settings.module.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import userIcon from "../../Assets/usericon.png";
import envelopeIcon from "../../Assets/envelopeicon.png";
import lockIcon from "../../Assets/lockicon.png";
import eyeIcon from "../../Assets/eyeicon.png";
import eyeSlashIcon from "../../Assets/eyeslash.png";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const token = localStorage.getItem("token");

  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  useEffect(() => {
    setName(localStorage.getItem("name"));
    setEmail(localStorage.getItem("email"));
  }, []);

  const [updateField, setUpdateField] = useState("");

  const handleUpdate = async (e) => {
    e.preventDefault();

    let updateData = {};

    if (updateField === "name" && name.trim()) {
      updateData = { name };
    } else if (updateField === "email" && email.trim()) {
      updateData = { email };
    } else if (updateField === "password") {
      if (oldPassword.trim() && newPassword.trim()) {
        updateData = { oldPassword, newPassword };
      } else {
        toast.warning("Please provide both old and new passwords.");
        return;
      }
    } else {
      toast.warning("Please fill out the updating field.");
      return;
    }

    try {
      await axios({
        method: "patch",
        url: `${process.env.REACT_APP_BACKEND_HOST}/api/auth/updateCredentials`,
        headers: { Authorization: `${token}` },
        data: updateData,
      });

      toast.success("Updated Successfully!");
      localStorage.removeItem("token");
      navigate("/login");
    } catch (error) {
      toast.error("Updation Failed");
    }
  };

  const handleFieldChange = (field) => {
    setUpdateField(field);
  };

  return (
    <div className={styles.settingsContainer}>
      <Navbar option="Settings" />
      <div className={styles.settingsContent}>
        <span>Settings</span>
        <form onSubmit={handleUpdate} className={styles.form}>
          <div className={styles.inputGroup}>
            <img src={userIcon} alt="user icon" />
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onClick={() => handleFieldChange("name")}
            />
          </div>
          <div className={styles.inputGroup}>
            <img src={envelopeIcon} alt="envelope icon" />
            <input
              type="email"
              placeholder="Update Email"
              value={email}
              autoComplete="new-email"
              onChange={(e) => setEmail(e.target.value)}
              onClick={() => handleFieldChange("email")}
            />
          </div>
          <div className={styles.inputGroup}>
            <img src={lockIcon} alt="lock icon" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Old Password"
              value={oldPassword}
              autoComplete="new-password"
              onChange={(e) => setOldPassword(e.target.value)}
              onClick={() => handleFieldChange("password")}
            />
            {showPassword ? (
              <img
                src={eyeIcon}
                alt="eye icon"
                onClick={() => setShowPassword(!showPassword)}
              />
            ) : (
              <img
                src={eyeSlashIcon}
                alt="eye slash icon"
                onClick={() => setShowPassword(!showPassword)}
              />
            )}
          </div>
          <div className={styles.inputGroup}>
            <img src={lockIcon} alt="lock icon" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              onClick={() => handleFieldChange("password")}
            />
            {showNewPassword ? (
              <img
                src={eyeIcon}
                alt="eye icon"
                onClick={() => setShowNewPassword(!showNewPassword)}
              />
            ) : (
              <img
                src={eyeSlashIcon}
                alt="eye slash icon"
                onClick={() => setShowNewPassword(!showNewPassword)}
              />
            )}
          </div>
          <button type="submit" className={styles.updateButton}>
            Update
          </button>
        </form>
      </div>
    </div>
  );
};

export default Settings;
