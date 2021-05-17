import React, { useState } from "react";
import axios from "axios";

import classes from "./SearchModal.module.css";

const SearchModal = (props) => {
  const [userName, setUserName] = useState("");
  const [message, setMessage] = useState("");
  const [fetchedUser, setFetchedUser] = useState(null);

  const searchUser = () => {
    const { accessToken, refreshToken } = JSON.parse(
      localStorage.getItem("messengerData")
    );

    axios
      .get(`${process.env.REACT_APP_BASE_URL}search-friend`, {
        params: {
          userName: userName,
        },
        headers: {
          Authorization: accessToken,
          "refresh-token": refreshToken,
        },
      })
      .then(({ data }) =>
        setFetchedUser({ userName: data.userName, status: data.status })
      )
      .catch((err) => console.log(err));
  };

  const requestFriend = () => {
    const { accessToken, refreshToken } = JSON.parse(
      localStorage.getItem("messengerData")
    );

    axios
      .post(
        `${process.env.REACT_APP_BASE_URL}request-friend`,
        { to: fetchedUser.userName, message: message },
        {
          headers: {
            Authorization: accessToken,
            "refresh-token": refreshToken,
          },
        }
      )
      .then((res) => {
        console.log(res);
        props.setToggle();
      })
      .catch((err) => console.log(err.response));
  };

  return (
    <div className={classes.Backdrop} onClick={props.setToggle}>
      <div
        className={classes.ModalContainer}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={classes.Header}>Add Friend</div>
        <div className={classes.Form}>
          <div className={classes.Field}>
            <label htmlFor="email">User name</label>
            <input
              type="text"
              onKeyPress={(e) => e.key === "Enter" && userName && searchUser()}
              onChange={(e) => setUserName(e.target.value)}
              value={userName}
              placeholder="Search by User name"
            />
            <div className={classes.Error}></div>
          </div>
          {fetchedUser && (
            <>
              <div className={classes.Field}>
                <label htmlFor="password">Request message</label>
                <input
                  type="text"
                  onChange={(e) => setMessage(e.target.value)}
                  value={message}
                  placeholder="Enter some request message"
                />
              </div>
              <div className={classes.Field}>
                <div style={{ fontWeight: "bold" }}>
                  User: {fetchedUser.userName}
                </div>
                <div style={{ fontSize: "0.8rem", fontWeight: "lighter" }}>
                  {fetchedUser.status}
                </div>
              </div>
            </>
          )}
        </div>
        <div className={classes.Footer}>
          <button onClick={props.setToggle}>Cancel</button>
          <button disabled={fetchedUser ? false : true} onClick={requestFriend}>
            Request
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
