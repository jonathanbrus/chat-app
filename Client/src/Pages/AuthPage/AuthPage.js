import React, { useState } from "react";

import classes from "./AuthPage.module.css";
import { LOGO } from "../../SVGs";
import SignIn from "./SignIn/SignIn";
import SignUp from "./SignUp/SignUp";

const AuthPage = (props) => {
  const [toggle, setToggle] = useState(true);

  return (
    <div className={classes.AuthPage}>
      <div>
        <h2 style={{ color: "white", display: "flex", alignItems: "center" }}>
          {LOGO}
          <span style={{ marginLeft: "0.5rem" }}>JoeyMessenger</span>
        </h2>
        <p>{toggle ? "Sign in to continue." : "Create your account."}</p>
      </div>
      <div className={classes.formContainer}>
        {toggle ? <SignIn /> : <SignUp />}
      </div>
      <div>
        {toggle ? (
          <p>
            Don't have an account?
            <span
              className={classes.Toggle}
              onClick={() => setToggle((prev) => !prev)}
            >
              {" "}
              Sign Up
            </span>
          </p>
        ) : (
          <p>
            Already have an account?
            <span
              className={classes.Toggle}
              onClick={() => setToggle((prev) => !prev)}
            >
              {" "}
              Sign In
            </span>
          </p>
        )}
      </div>
    </div>
  );
};

export default AuthPage;
