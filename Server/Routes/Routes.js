const express = require("express");

const Router = express.Router();

const Authenticate = require("../Middlewares/Authenticate");

const { signUp, signIn, signOut } = require("../Controllers/Authentication");

const {
  myFriends,
  searchFriend,
  requestFriend,
  actionOnRequest,
  removeFriend,
} = require("../Controllers/Friends");

const {
  myChats,
  startConversation,
  deleteConversation,
  sendMessage,
} = require("../Controllers/Chats");

// Auth Routes

Router.post("/sign-in", signIn);

Router.post("/sign-up", signUp);

Router.post("/sign-out", signOut);

// Friends Routes

Router.get("/my-friends", Authenticate, myFriends);

Router.get("/search-friend", Authenticate, searchFriend);

Router.post("/request-friend", Authenticate, requestFriend);

Router.post("/action-on-request", Authenticate, actionOnRequest);

Router.delete("/remove-friend", Authenticate, removeFriend);

// Chat Routes

Router.get("/my-chats", Authenticate, myChats);

Router.post("/start-conversation", Authenticate, startConversation);

Router.delete("/delete-conversation", Authenticate, deleteConversation);

Router.post("/send-message", Authenticate, sendMessage);

module.exports = Router;
