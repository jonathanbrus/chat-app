import React, { useState } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { AnimatePresence, motion } from "framer-motion";
import axios from "axios";

import * as actionTypes from "../../Redux/Actions/ActionTypes";
import { startConvo } from "../../Redux/Actions/ActionCreators";
import classes from "./FriendListItem.module.css";
import { options } from "../../SVGs";

const FriendListItem = (props) => {
  const [toggle, setToggle] = useState(false);

  const startChat = (friend) => {
    const alreadyChat = props.chats.filter((chat) =>
      chat.members.includes(friend.userName)
    );

    if (alreadyChat.length) {
      props.setCurrent(alreadyChat[0]);
      return props.history.push(`/chat/${alreadyChat[0]._id}`);
    }

    props.onStartConvo(props.history, friend);
  };

  const removeFriend = (id) => {
    const { accessToken, refreshToken } = JSON.parse(
      localStorage.getItem("messengerData")
    );

    axios
      .delete(`${process.env.REACT_APP_BASE_URL}remove-friend`, {
        params: { id: id },
        headers: {
          Authorization: accessToken,
          "refresh-token": refreshToken,
        },
      })
      .then(({ data }) => console.log(data))
      .catch((err) => console.log(err));
  };

  return (
    <div className={classes.FriendListItem}>
      <div style={{ flex: 1, maxWidth: "calc(100% - 32px)" }}>
        <div className={classes.Name}>{props.friend.userName}</div>
        <div className={classes.Status}>{props.friend.status}</div>
      </div>
      <button onClick={() => setToggle((prevState) => !prevState)}>
        {options}
      </button>
      <AnimatePresence>
        {toggle && (
          <motion.div
            initial={{ opacity: 0, x: "-100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "-100%" }}
            transition={{ type: "tween" }}
            className={classes.optionsContainer}
          >
            <div onClick={() => startChat(props.friend)}>Chat</div>
            <div onClick={() => removeFriend(props.friend._id)}>Remove</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    chats: state.Chat.chats,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onStartConvo: (historyProp, friendId) =>
      dispatch(startConvo(historyProp, friendId)),
    setCurrent: (curnChat) =>
      dispatch({ type: actionTypes.SETCURCHAT, payLoad: curnChat }),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(FriendListItem)
);
