import React, { useState } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

import { signIn } from "../../../Redux/Actions/ActionCreators";
import classes from "./SignIn.module.css";

const initialState = {
  email: "",
  password: "",
};

const SignIn = (props) => {
  const [formData, setFormData] = useState(initialState);

  const onChangeHandler = (e) => {
    const { name, value } = e.target;

    setFormData((prevFormData) => {
      return { ...prevFormData, [name]: value };
    });
  };

  const onSubmitHandler = (e) => {
    e.preventDefault();
    props.onSignIn(props.history, formData);
  };

  return (
    <form className={classes.Form} onSubmit={onSubmitHandler}>
      <div className={classes.Field}>
        <label htmlFor="email">Eamil</label>
        <input
          name="email"
          type="email"
          onChange={onChangeHandler}
          value={formData.email}
          placeholder="Enter Your Email"
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
          placeholder="Enter Your Password"
          minLength="6"
          maxLength="36"
          required
        />
        <div className={classes.Error}></div>
      </div>
      <button type="submit">Sign In</button>
    </form>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    onSignIn: (historyProp, formData) =>
      dispatch(signIn(historyProp, formData)),
  };
};

export default withRouter(connect(null, mapDispatchToProps)(SignIn));
