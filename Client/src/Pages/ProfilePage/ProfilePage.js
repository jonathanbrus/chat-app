import React, { useState } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { motion } from "framer-motion";

import classes from "./ProfilePage.module.css";
import RequestListItem from "../../Components/RequestListItem/RequestListItem";
import { signOut } from "../../Redux/Actions/ActionCreators";
import { Loader } from "../../Components/UI/Loader/Loader";
import { arrowRight, arrowDown, signOutBTN } from "../../SVGs";

const initialState = {
  userName: "",
  email: "",
  status: "",
};

const ProfilePage = (props) => {
  const { userName, status } = props.User;

  const [toggle, setToggle] = useState(false);

  const [formData, setFormData] = useState(initialState);

  const onChangeHandler = (e) => {
    const { name, value } = e.target;

    setFormData((prevFormData) => {
      return { ...prevFormData, [name]: value };
    });
  };

  const onSubmitHandler = (e) => {
    e.preventDefault();
    // props.onSignUp(props.history, formData);
  };

  return (
    <motion.div
      initial={{ x: "-50%" }}
      animate={{ x: 0 }}
      exit={{}}
      transition={{ type: "spring", damping: 12 }}
      className={classes.ProfilePage}
    >
      <section className={classes.TopSection}>
        <div className={classes.PageHeader}>My Profile</div>
        <button
          className={classes.SignOutBTN}
          onClick={() => props.onSignOut(props.history)}
        >
          {signOutBTN}
        </button>
        <div className={classes.ProfileInfo}>
          <div className={classes.DisplayImage}>
            {userName.slice(0, 2).toUpperCase()}
          </div>
          <div className={classes.More}>
            <div className={classes.Name}>{userName}</div>
            <div className={classes.Status}>Status: {status}</div>
          </div>
        </div>
      </section>
      <section className={classes.BottomSection}>
        <div className={classes.Edit}>
          <div
            className={classes.Heading}
            onClick={() => setToggle((prevToggle) => !prevToggle)}
          >
            <span>Edit Information</span>
            {toggle ? arrowDown : arrowRight}
          </div>
          {toggle && (
            <motion.form
              initial={{ y: "-80%" }}
              animate={{ y: 0 }}
              className={classes.Form}
              onSubmit={onSubmitHandler}
            >
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
              </div>
              <div className={classes.Field}>
                <label htmlFor="status">Status</label>
                <input
                  name="status"
                  type="text"
                  onChange={onChangeHandler}
                  value={formData.status}
                  placeholder="Enter status"
                  minLength="6"
                  maxLength="36"
                  required
                />
              </div>
              <button type="submit">Save Changes</button>
            </motion.form>
          )}
        </div>
        <div className={classes.RequestsContainer}>
          <div className={classes.Heading}>Requests</div>
          <div className={classes.Requests}>
            {props.Requests.length > 0 ? (
              props.Requests.map((request, index) => (
                <RequestListItem key={index} Req={request} />
              ))
            ) : (
              <Loader message="All your requests will be here!" />
            )}
          </div>
        </div>
      </section>
    </motion.div>
  );
};

const mapStateToProps = (state) => {
  return {
    User: state.Auth.user,
    Requests: state.Auth.user.requests,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onSignOut: (historyProp) => dispatch(signOut(historyProp)),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(ProfilePage)
);
