import * as actionTypes from "./ActionTypes";

import axios from "axios";

// Authentication

export const signIn = (historyProp, userData) => (dispatch) => {
  axios
    .post(`${process.env.REACT_APP_BASE_URL}sign-in`, { User: userData })
    .then(({ data }) => {
      dispatch({ type: actionTypes.SIGNIN, payLoad: data });
      historyProp.push("/chat");
    })
    .catch(({ response }) => console.log(response));
};

export const signUp = (historyProp, userData) => (dispatch) => {
  axios
    .post(`${process.env.REACT_APP_BASE_URL}sign-up`, { User: userData })
    .then(({ data }) => {
      dispatch({ type: actionTypes.SIGNIN, payLoad: data });
      historyProp.push("/");
    })
    .catch(({ response }) => console.log(response));
};

export const signOut = (historyProp) => (dispatch) => {
  const { refreshToken } = JSON.parse(localStorage.getItem("messengerData"));

  axios
    .post(`${process.env.REACT_APP_BASE_URL}sign-out`, {
      refreshToken: refreshToken,
    })
    .then(() => {
      dispatch({ type: actionTypes.SIGNOUT, payLoad: null });
      historyProp.push("/authentication");
    })
    .catch(({ response }) => console.log(response));
};

// Chats

export const fetchConvos = (friends) => (dispatch) => {
  const { accessToken, refreshToken } = JSON.parse(
    localStorage.getItem("messengerData")
  );

  axios
    .get(`${process.env.REACT_APP_BASE_URL}my-chats`, {
      headers: {
        Authorization: accessToken,
        "refresh-token": refreshToken,
      },
    })
    .then(({ data }) => {
      if (data.length) {
        dispatch({
          type: actionTypes.SETCHATS,
          payLoad: data,
        });
      }
    })
    .catch((err) => console.log(err));
};

export const startConvo = (historyProp, friend) => (dispatch) => {
  const { accessToken, refreshToken } = JSON.parse(
    localStorage.getItem("messengerData")
  );

  axios
    .post(
      `${process.env.REACT_APP_BASE_URL}start-conversation`,
      { friendName: friend.userName },
      {
        headers: {
          Authorization: accessToken,
          "refresh-token": refreshToken,
        },
      }
    )
    .then(({ data }) => {
      dispatch({
        type: actionTypes.SETCHATS,
        payLoad: data,
      });
      dispatch({ type: actionTypes.SETCURCHAT, payLoad: data });
      historyProp.push(`/chat/${data._id}`);
    })
    .catch((err) => console.log(err));
};

// Friends

export const fetchFrnds = (friends) => (dispatch) => {
  const { accessToken, refreshToken } = JSON.parse(
    localStorage.getItem("messengerData")
  );

  axios
    .get(`${process.env.REACT_APP_BASE_URL}my-friends`, {
      params: { friends: friends },
      headers: {
        Authorization: accessToken,
        "refresh-token": refreshToken,
      },
    })
    .then(({ data }) =>
      dispatch({ type: actionTypes.FETCHFRNDS, payLoad: data })
    )
    .catch((err) => console.log(err.response));
};

// Messages

export const sendMsg = (msgData) => (dispatch) => {
  const { accessToken, refreshToken } = JSON.parse(
    localStorage.getItem("messengerData")
  );

  axios
    .post(`${process.env.REACT_APP_BASE_URL}send-message`, msgData, {
      headers: {
        Authorization: accessToken,
        "refresh-token": refreshToken,
      },
    })
    .then(({ data }) => {
      dispatch({ type: actionTypes.SENDMSG, payLoad: data });
    })
    .catch((err) => console.log(err));
};
