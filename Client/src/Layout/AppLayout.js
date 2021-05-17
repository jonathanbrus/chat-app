import React, { useEffect } from "react";
import { io } from "socket.io-client";
import { Switch, Route, Redirect, withRouter } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { connect } from "react-redux";

import * as ActionTypes from "../Redux/Actions/ActionTypes";
import { fetchFrnds, fetchConvos } from "../Redux/Actions/ActionCreators";
import NavBar from "../Components/NavBar/NavBar";
import ChatsPage from "../Pages/ChatsPage/ChatsPage";
import FriendsPage from "../Pages/FriendsPage/FriendsPage";
import ProfilePage from "../Pages/ProfilePage/ProfilePage";
import ChatBox from "../Pages/ChatBox/ChatBox";

import classes from "./AppLayout.module.css";

const AppLayout = (props) => {
  const { FetchFriends, FetchConvos } = props;

  useEffect(() => {
    if (props.User.friends.length !== props.Friends.length) {
      FetchFriends(props.User.friends);
    }

    if (props.Friends.length) {
      FetchConvos(props.Friends);
    }
  }, [FetchConvos, FetchFriends, props.Friends, props.User.friends]);

  useEffect(() => {
    const socket = io("http://localhost:8080/");

    console.log(socket);

    const onRequest = socket.on("request", (data) => {
      if (data.action === "requested") {
        if (data.to === props.User.userName) {
          props.UpdateUser(data.user);
        }
      }
    });

    const newFriend = socket.on("newFriend", (data) => {
      if (data.action === "addedFriend") {
        const userInfo = data.to.filter(
          (data) => data.userName === props.User.userName
        );
        if (userInfo.length > 0) {
          props.UpdateUser(userInfo[0]);
        }
      }
    });

    const removedFriend = socket.on("removedFriend", (data) => {
      if (data.action === "removedFriend") {
        const userInfo = data.to.filter(
          (data) => data.userName === props.User.userName
        );
        console.log(userInfo);
        if (userInfo.length > 0) {
          props.UpdateUser(userInfo[0]);
        }
      }
    });

    const setMessage = socket.on("sendMessage", (data) => {
      if (data.action === "sent") {
        if (data.to === props.User.userName) {
          props.SetMessage(data.message);
        }
      }
    });

    return () => {
      onRequest.close();
      newFriend.close();
      removedFriend.close();
      setMessage.close();

      socket.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className={classes.NavBarContainer}>
        <NavBar />
      </div>
      <div className={classes.PageContainer}>
        <AnimatePresence>
          <Switch location={props.location} key={props.location.pathname}>
            <Route path="/chat" render={() => <ChatsPage />} exact />
            <Route path="/friends" render={() => <FriendsPage />} exact />
            <Route path="/profile" render={() => <ProfilePage />} exact />
            <Route path="/chat/:chatID" render={() => <ChatBox />} />
            <Redirect from="/" to="/chat" />
          </Switch>
        </AnimatePresence>
      </div>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    User: state.Auth.user,
    Friends: state.Friends.friends,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    UpdateUser: (userInfo) =>
      dispatch({ type: ActionTypes.UPDATEUSERINFO, payLoad: userInfo }),
    FetchFriends: (friends) => dispatch(fetchFrnds(friends)),
    FetchConvos: (friends) => dispatch(fetchConvos(friends)),
    SetMessage: (message) =>
      dispatch({ type: ActionTypes.SETMESSAGE, payLoad: message }),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(AppLayout)
);
