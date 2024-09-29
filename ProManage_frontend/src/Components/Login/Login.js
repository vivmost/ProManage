import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "font-awesome/css/font-awesome.min.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "../Login/Login.module.css";
import SpaceSuit from "../../Assets/SpaceSuit.png";
import envelopeIcon from "../../Assets/envelopeicon.png";
import lockIcon from "../../Assets/lockicon.png";
import eyeIcon from "../../Assets/eyeicon.png";
import eyeSlashIcon from "../../Assets/eyeslash.png";
import { jwtDecode } from "jwt-decode";

const Login = () => {
  const [email, setEmail] = useState("guest@gmail.com");
  const [password, setPassword] = useState("guest@123");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    let valid = true;

    const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    if (!(email.trim().length > 0)) {
      setEmailError(true);
      valid = false;
    } else {
      if (isValidEmail(email)) {
        setEmailError(false);
      } else {
        setEmailError(true);
      }
    }

    if (!(password.trim().length > 0)) {
      setPasswordError(true);
      valid = false;
    } else {
      setPasswordError(false);
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_HOST}/api/auth/login`,
        {
          email,
          password,
        }
      );
      const token = response?.data?.token;
      const userData = jwtDecode(token);
      localStorage.setItem("token", token);
      localStorage.setItem("name", userData.name);
      localStorage.setItem("email", userData.email);
      toast.success("Login Successfull!");
      navigate("/dashboard");
    } catch (error) {
      toast.error("Login Failed");
    }
  };

  return (
    <div className={styles.registerContainer}>
      <div className={styles.leftContainer}>
        <div className={styles.circle}>
          <img
            src={SpaceSuit}
            alt="Space Suit Goodie"
            className={styles.image}
          />
        </div>
        <h1>Welcome aboard my friend</h1>
        <p>just a couple of clicks and we start</p>
      </div>
      <div className={styles.rightContainer}>
        <span>Login</span>
        <form onSubmit={handleLogin} className={styles.form} noValidate>
          <div className={styles.inputGroup}>
            <img src={envelopeIcon} alt="envelope icon" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          {emailError ? (
            <p className={styles.error}>Please fill Email correctly!</p>
          ) : (
            <></>
          )}
          <div className={styles.inputGroup}>
            <img src={lockIcon} alt="lock icon" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
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
          {passwordError ? (
            <p className={styles.error}>Please fill Password correctly!</p>
          ) : (
            <></>
          )}

          <button type="submit" className={styles.loginButton}>
            Log in
          </button>
        </form>
        <p>Have no account yet ?</p>
        <Link to="/" className={styles.registerButton}>
          Register
        </Link>
      </div>
    </div>
  );
};

export default Login;
