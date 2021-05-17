import React from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";

import * as actionTypes from "../../Redux/Actions/ActionTypes";
import classes from "./ChatListItem.module.css";

const ChatListItem = (props) => {
  const {
    User,
    chat: { _id, members },
  } = props;

  const userIndex = members.indexOf(User.userName);

  const friendIndex = userIndex ? 0 : 1;

  return (
    <div
      className={classes.ListItem}
      onClick={() => {
        console.log(props.chat);
        props.setCurrent(props.chat);
        props.history.push(`/chat/${_id}`);
      }}
    >
      <div className={classes.Name}>{members[friendIndex]}</div>
      <div className={classes.LastMessage}>{props.lastMsg}</div>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    User: state.Auth.user,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setCurrent: (curnChat) =>
      dispatch({ type: actionTypes.SETCURCHAT, payLoad: curnChat }),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(ChatListItem)
);
