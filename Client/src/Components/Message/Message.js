import React from "react";
import { motion } from "framer-motion";
import { connect } from "react-redux";

import classes from "./Message.module.css";

const Message = (props) => {
  return (
    <motion.div
      initial={
        props.from === props.User.userName
          ? { opacity: 0, x: -150 }
          : { opacity: 0, x: 150 }
      }
      animate={{ opacity: 1, x: 0 }}
      ref={props.forwardRef}
      style={
        props.from === props.User.userName
          ? { alignSelf: "flex-end", backgroundColor: "#36404a" }
          : { alignSelf: "flex-start", backgroundColor: "#7269EF" }
      }
      className={classes.MessageConatiner}
    >
      <div className={classes.Message}>{props.message}</div>
    </motion.div>
  );
};

const mapStateToProps = (state) => {
  return {
    User: state.Auth.user,
  };
};

export default connect(mapStateToProps)(Message);
