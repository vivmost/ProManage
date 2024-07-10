import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "font-awesome/css/font-awesome.min.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "../Register/Register.module.css";
import SpaceSuit from "../../Assets/SpaceSuit.png";
import userIcon from "../../Assets/usericon.png";
import envelopeIcon from "../../Assets/envelopeicon.png";
import lockIcon from "../../Assets/lockicon.png";
import eyeIcon from "../../Assets/eyeicon.png";
import eyeSlashIcon from "../../Assets/eyeslash.png";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const [nameError, setNameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();

    let valid = true;
    if (!(name.trim().length > 0)) {
      setNameError(true);
      valid = false;
    } else {
      setNameError(false);
    }

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

    if (!(confirmPassword.trim().length > 0)) {
      setConfirmPasswordError(true);
      valid = false;
    } else {
      setConfirmPasswordError(false);
    }

    if (valid) {
      if (password !== confirmPassword) {
        toast.error("Passwords do not match!");
        return;
      }

      try {
        await axios.post(
          `${process.env.REACT_APP_BACKEND_HOST}/api/auth/register`,
          {
            name,
            email,
            password,
            confirmPassword,
          }
        );
        toast.success("Registered Successfully!");
        navigate("/login");
      } catch (error) {
        toast.error("Registration Failed!");
      }
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
        <span>Register</span>
        <form onSubmit={handleRegister} className={styles.form} noValidate>
          <div className={styles.inputGroup}>
            <img src={userIcon} alt="user icon" />
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          {nameError ? (
            <p className={styles.error}>Please fill correctly</p>
          ) : (
            <></>
          )}

          <div className={styles.inputGroup}>
            <img src={envelopeIcon} alt="envelope icon" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              autoComplete="new-email"
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
              placeholder="Password"
              autoComplete="new-password"
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

          <div className={styles.inputGroup}>
            <img src={lockIcon} alt="lock icon" />
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            {showConfirmPassword ? (
              <img
                src={eyeIcon}
                alt="eye icon"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              />
            ) : (
              <img
                src={eyeSlashIcon}
                alt="eye slash icon"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              />
            )}
          </div>
          {confirmPasswordError ? (
            <p className={styles.error}>
              Please fill Confirm Password correctly!
            </p>
          ) : (
            <></>
          )}

          <button type="submit" className={styles.registerButton}>
            Register
          </button>
        </form>
        <p>Have an account ?</p>
        <Link to="/login" className={styles.loginButton}>
          Log in
        </Link>
      </div>
    </div>
  );
};

export default Register;
