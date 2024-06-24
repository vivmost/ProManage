import React from "react";
import styles from "./Login.module.css";
import logo from "../../Assets/Art.png";
import "font-awesome/css/font-awesome.min.css";

const Login = () => {
  return (
    <div className={styles.mainContainer}>
      <div className={styles.designGroupContainer}>
        <div className={styles.designGroup}>
          <div className={styles.circular}></div>
          <img className={styles.logo} src={logo} alt="logo" />
          <span>
            <h3>Welcome aboard my friend</h3>
            <h5>just a couple of clicks and we start</h5>
          </span>
        </div>
      </div>

      <div className={styles.functionGroup}>
        <div className={styles.formGroup}>
          <h4>Login</h4>
          <div className={styles.input_container}>
            <i className="fa fa-envelope"></i>
            <input
              className={styles.input_field}
              type="email"
              name="email"
              placeholder="Email"
            />
          </div>
        </div>

        <div className={styles.formGroup}>
          <div className={styles.input_container}>
            <i className="fa fa-lock"></i>
            <input
              className={styles.input_field}
              type="password"
              name="password"
              placeholder="Password"
            />
            <i className="fa fa-eye"></i>
          </div>
        </div>

        <button className={styles.button1}>LogIn</button>
        <p>Have no account yet?</p>
        <button className={styles.button2}>Register</button>
      </div>
    </div>
  );
};

export default Login;
