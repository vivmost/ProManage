import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "../Navbar/Navbar.module.css";
import Logo from "../../Assets/Logo.png";
import dashboardIcon from "../../Assets/dashboard.png";
import analyticsIcon from "../../Assets/Analytics.png";
import settingsIcon from "../../Assets/Settings.png";
import logoutIcon from "../../Assets/Logout.png";

const Navbar = ({ option }) => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(option);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className={styles.navbar}>
      <div className={styles.navbarheader}>
        <img src={Logo} alt="Logo" className={styles.navbarlogo} />
        <h4>Pro Manage</h4>
      </div>
      <div className={styles.navbarbuttons}>
        <Link to="/dashboard" className={styles.link}>
          <button
            className={`${styles.buttontag} ${
              selected === "Dashboard" ? styles.selected : ""
            }`}
            onClick={() => setSelected("Dashboard")}
          >
            <img
              src={dashboardIcon}
              alt="Dashboard"
              className={styles.buttonimg}
            />
            Board
          </button>
        </Link>

        <Link to="/analytics" className={styles.link}>
          <button
            className={`${styles.buttontag} ${
              selected === "Analytics" ? styles.selected : ""
            }`}
            onClick={() => setSelected("Analytics")}
          >
            <img
              src={analyticsIcon}
              alt="analytics"
              className={styles.buttonimg}
            />
            Analytics
          </button>
        </Link>

        <Link to="/settings" className={styles.link}>
          <button
            className={`${styles.buttontag} ${
              selected === "Settings" ? styles.selected : ""
            }`}
            onClick={() => setSelected("Settings")}
          >
            <img
              src={settingsIcon}
              alt="settings"
              className={styles.buttonimg}
            />
            <span>Settings</span>
          </button>
        </Link>
      </div>
      <button onClick={() => handleLogout()} className={styles.logoutbutton}>
        <img src={logoutIcon} alt="Logout" className={styles.buttonimg} />
        Log out
      </button>
    </div>
  );
};

export default Navbar;
