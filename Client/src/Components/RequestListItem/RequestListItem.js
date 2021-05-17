import React from "react";
import axios from "axios";

import classes from "./RequestListItem.module.css";
import { accept, decline } from "../../SVGs";

const RequestListItem = (props) => {
  const actionOnRequest = (accepted) => {
    const { accessToken, refreshToken } = JSON.parse(
      localStorage.getItem("messengerData")
    );

    axios
      .post(
        `${process.env.REACT_APP_BASE_URL}action-on-request`,
        { action: accepted, from: props.Req.from },
        {
          headers: {
            Authorization: accessToken,
            "refresh-token": refreshToken,
          },
        }
      )
      .then(({ data }) => console.log(data))
      .catch((err) => console.log(err));
  };

  return (
    <div className={classes.RequestContainer}>
      <div className={classes.Info}>
        <div>User name: {props.Req.from}</div>
        <div>Message: {props.Req.message}</div>
      </div>
      <div className={classes.CTAs}>
        <button onClick={() => actionOnRequest(true)}>{accept}</button>
        <button onClick={() => actionOnRequest(false)}>{decline}</button>
      </div>
    </div>
  );
};

export default RequestListItem;
