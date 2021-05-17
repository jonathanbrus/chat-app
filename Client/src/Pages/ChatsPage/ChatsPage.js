import React, { useState } from "react";
import { motion } from "framer-motion";
import { connect } from "react-redux";

import classes from "./ChatsPage.module.css";
import ChatListItem from "../../Components/ChatListItem/ChatListItem";
import { search } from "../../SVGs";
import { Loader } from "../../Components/UI/Loader/Loader";

const ChatsPage = (props) => {
  const [value, setValue] = useState("");

  let chats;

  if (value) {
    chats = props.chats.filter((chat) => {
      const userIndex = chat.members.indexOf(props.User.userName);
      const friendIndex = userIndex ? 0 : 1;
      return chat.members[friendIndex].match(new RegExp(value, "i")) && chat;
    });
  } else {
    chats = props.chats;
  }

  return (
    <motion.div
      initial={{ x: "-100%" }}
      animate={{ x: 0 }}
      exit={{}}
      transition={{ type: "spring", damping: 12 }}
      className={classes.ChatsPage}
    >
      <section className={classes.TopSection}>
        <div className={classes.PageHeader}>Chats</div>
        <div className={classes.SearchContainer}>
          <input
            type="text"
            onChange={(e) => setValue(e.target.value)}
            value={value}
            placeholder="Search by username"
          />
          <button>{search}</button>
        </div>
      </section>
      <section className={classes.ChatsList}>
        {props.chats?.length ? (
          chats.length ? (
            chats.map((chat, index) => (
              <ChatListItem
                key={index}
                lastMsg={chat.messages[chat.messages?.length - 1]?.message}
                chat={chat}
              />
            ))
          ) : (
            <Loader message="There is no result for the search." />
          )
        ) : (
          <Loader message="There are no chats yet, start a conversation!" />
        )}
      </section>
    </motion.div>
  );
};

const mapStateToProps = (state) => {
  return {
    chats: state.Chat.chats,
    User: state.Auth.user,
  };
};

export default connect(mapStateToProps)(ChatsPage);
