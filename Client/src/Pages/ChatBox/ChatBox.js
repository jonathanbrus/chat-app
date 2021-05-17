import React, { useCallback, useEffect, useState, useRef } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { motion } from "framer-motion";

import { sendMsg } from "../../Redux/Actions/ActionCreators";
import { back, send } from "../../SVGs";
import classes from "./ChatBox.module.css";
import Message from "../../Components/Message/Message";

const ChatBox = (props) => {
  const [friend, setFriend] = useState(null);
  const [value, setValue] = useState("");

  const {
    User,
    currentChat: { _id, members, messages },
    friends,
    onSendMessage,
  } = props;

  const userIndex = members.indexOf(User.userName);

  useEffect(() => {
    const friendIndex = userIndex ? 0 : 1;

    const friend = friends.find(
      (friend) => friend.userName === members[friendIndex]
    );

    setFriend(friend);
  }, [members, friends, userIndex]);

  const sendMessage = () => {
    let message = {
      from: members[userIndex],
      to: friend.userName,
      message: value,
    };
    onSendMessage({ convoId: _id, message: message });
    setValue("");
  };

  const setRef = useCallback(
    (node) => node && node.scrollIntoView({ smooth: true }),
    [] //  to move to the last message sent
  );

  const focusRef = useRef();

  useEffect(() => {
    focusRef.current.focus();
  }, []);

  return (
    <motion.div
      initial={{ x: "-100%" }}
      animate={{ x: 0 }}
      exit={{}}
      transition={{ type: "spring", damping: 12 }}
      className={classes.ChatBox}
    >
      <div className={classes.Header}>
        <button onClick={props.history.goBack}>{back}</button>
        <div className={classes.Info}>
          <div style={{ fontWeight: "bold" }}>{friend && friend.userName}</div>
          <div style={{ fontSize: "0.8rem", fontWeight: "lighter" }}>
            {friend && friend.status}
          </div>
        </div>
      </div>
      <section className={classes.MessagesContainer}>
        {messages.map((message, index) => (
          <Message
            forwardRef={messages.length - 1 === index ? setRef : null}
            key={index}
            message={message.message}
            from={message.from}
            to={message.to}
          />
        ))}
      </section>
      <div className={classes.InputContainer}>
        <input
          ref={focusRef}
          onKeyPress={(e) => e.key === "Enter" && value && sendMessage()}
          onChange={(e) => setValue(e.target.value)}
          value={value}
        />
        <button onClick={sendMessage} className={classes.SendIcon}>
          {send}
        </button>
      </div>
    </motion.div>
  );
};

const mapStateToProps = (state) => {
  return {
    User: state.Auth.user,
    currentChat: state.Chat.currentChat,
    friends: state.Friends.friends,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onSendMessage: (message) => dispatch(sendMsg(message)),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(ChatBox)
);
