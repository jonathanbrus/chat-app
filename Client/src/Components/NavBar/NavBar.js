import React from "react";
import { withRouter } from "react-router-dom";

import { LOGO, profile, chats, freinds } from "../../SVGs";
import classes from "./NavBar.module.css";

const NavBar = (props) => {
  const navigate = (path) => {
    if (props.location.pathname !== path) {
      props.history.push(path);
    }
  };

  return (
    <div className={classes.NavBar}>
      <div>{LOGO}</div>
      <div className={classes.BTNsContainer}>
        <button
          style={
            props.location.pathname.split("/")[1] === "chat"
              ? {
                  backgroundColor: "#3e4a56",
                }
              : {}
          }
          onClick={() => navigate("/chat")}
        >
          {chats}
        </button>
        <button
          style={
            props.location.pathname === "/friends"
              ? {
                  backgroundColor: "#3e4a56",
                }
              : {}
          }
          onClick={() => navigate("/friends")}
        >
          {freinds}
        </button>
        <button
          style={
            props.location.pathname === "/profile"
              ? {
                  backgroundColor: "#3e4a56",
                }
              : {}
          }
          onClick={() => navigate("/profile")}
        >
          {profile}
        </button>
      </div>
    </div>
  );
};

export default withRouter(NavBar);
