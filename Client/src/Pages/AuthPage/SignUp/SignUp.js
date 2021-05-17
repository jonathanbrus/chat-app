import React, { useState } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

import { signUp } from "../../../Redux/Actions/ActionCreators";
import classes from "./SignUp.module.css";

const initialState = {
  userName: "",
  email: "",
  password: "",
};

const SignUp = (props) => {
  const [formData, setFormData] = useState(initialState);

  const onChangeHandler = (e) => {
    const { name, value } = e.target;

    setFormData((prevFormData) => {
      return { ...prevFormData, [name]: value };
    });
  };

  const onSubmitHandler = (e) => {
    e.preventDefault();
    props.onSignUp(props.history, formData);
  };

  return (
    <form className={classes.Form} onSubmit={onSubmitHandler}>
      <div className={classes.Field}>
        <label htmlFor="userName">User Name</label>
        <input
          name="userName"
          type="text"
          onChange={onChangeHandler}
          value={formData.userName}
          placeholder="Enter User Name"
          minLength="4"
          maxLength="36"
          required
        />
        <div className={classes.Error}></div>
      </div>
      <div className={classes.Field}>
        <label htmlFor="email">Email</label>
        <input
          name="email"
          type="email"
          onChange={onChangeHandler}
          value={formData.email}
          placeholder="Enter Email"
          required
        />
        <div className={classes.Error}></div>
      </div>
      <div className={classes.Field}>
        <label htmlFor="password">Password</label>
        <input
          name="password"
          type="password"
          onChange={onChangeHandler}
          value={formData.password}
          placeholder="Enter password"
          minLength="6"
          maxLength="36"
          required
        />
        <div className={classes.Error}></div>
      </div>
      <button type="submit">Sign Up</button>
    </form>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    onSignUp: (historyProp, userData) =>
      dispatch(signUp(historyProp, userData)),
  };
};

export default withRouter(connect(null, mapDispatchToProps)(SignUp));
