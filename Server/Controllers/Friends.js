const User = require("../Models/User");
const IO = require("../Sockets");

const myFriends = (req, res, next) => {
  User.find({ _id: req.query.friends })
    .then((result) => {
      friends = result.map((friend) => {
        return {
          _id: friend._id,
          userName: friend.userName,
          status: friend.status,
        };
      });

      res.json(friends);
    })
    .catch((err) => console.log(err));
};

const searchFriend = async (req, res, next) => {
  const { userId } = req;
  const { userName } = req.query;

  const sender = await User.findById(userId);

  User.findOne({ userName: userName })
    .then((user) => {
      if (!user) {
        const error = {
          statusCode: 404,
          message: "No user with the entered user name",
        };
        throw error;
      }

      if (sender.userName === user.userName) {
        const error = {
          statusCode: 406,
          message: "You cannot send request to yourself",
        };
        throw error;
      }

      res.json(
        req.newAccessToken
          ? {
              userName: user.userName,
              status: user.status,
              newAccessToken: req.newAccessToken,
            }
          : {
              userName: user.userName,
              status: user.status,
            }
      );
    })
    .catch((err) => {
      res.status(err.statusCode).json({ error: err.message });
    });
};

const requestFriend = async (req, res, next) => {
  const { userId } = req;
  const { to, message } = req.body;

  const sender = await User.findById(userId);

  const request = {
    from: sender.userName,
    message: message.trim() ? message : "Hey there!",
  };

  User.findOne({ userName: to })
    .then((user) => {
      if (!user) {
        const error = { statusCode: 404, message: "No user found" };
        throw error;
      }

      if (sender.userName === to) {
        const error = {
          statusCode: 406,
          message: "You cannot send request to yourself",
        };
        throw error;
      }

      if (user.friends.filter((friend) => sender._id === friend).length) {
        const error = {
          statusCode: 406,
          message: "Already a friend",
        };
        throw error;
      }

      if (
        user.requests.filter((request) => sender.userName === request.from)
          .length
      ) {
        const error = {
          statusCode: 406,
          message: "Already sent request",
        };
        throw error;
      }

      const updatedRequest = [...user.requests, request];

      user.requests = updatedRequest;
      return user.save();
    })
    .then((user) => {
      IO.getIO().emit("request", {
        action: "requested",
        to: user.userName,
        user: {
          userName: user.userName,
          email: user.email,
          status: user.status,
          friends: user.friends,
          requests: user.requests,
        },
      });
      res.json({ message: "Request sent successfully" });
    })
    .catch((err) => res.json({ message: err.message }));
};

const actionOnRequest = (req, res, next) => {
  const { action, from } = req.body;

  let friendsUpdatedInfo;

  User.findOne({ _id: req.userId })
    .then(async (user) => {
      const updatedRequests = user.requests.filter(
        (request) => request.from !== from
      );

      user.requests = [...updatedRequests];

      if (action) {
        const friend = await User.findOne({ userName: from });

        friend.friends.push(req.userId);

        friendsUpdatedInfo = await friend.save();

        const updatedFriends = [...user.friends, friend._id];

        user.friends = updatedFriends;
      }

      return user.save();
    })
    .then((user) => {
      IO.getIO().emit("newFriend", {
        action: "addedFriend",
        to: [
          {
            userName: user.userName,
            email: user.email,
            status: user.status,
            friends: user.friends,
            requests: user.requests,
          },
          {
            userName: friendsUpdatedInfo.userName,
            email: friendsUpdatedInfo.email,
            status: friendsUpdatedInfo.status,
            friends: friendsUpdatedInfo.friends,
            requests: friendsUpdatedInfo.requests,
          },
        ],
      });
      res.json("successfull");
    })
    .catch((err) => res.json(err.message));
};

const removeFriend = async (req, res, next) => {
  const { id } = req.query;

  let userInfo;
  let friend;

  User.findById(req.userId)
    .then((user) => {
      user.friends = user.friends.filter(
        (frnd) => frnd.toString() !== id.toString()
      );

      userInfo = user;

      user.save();

      return User.findById(id);
    })
    .then((user) => {
      user.friends = user.friends.filter(
        (frnd) => frnd.toString() !== req.userId.toString()
      );

      friend = user;

      return user.save();
    })
    .then(() =>
      IO.getIO().emit("newFriend", {
        action: "addedFriend",
        to: [
          {
            userName: userInfo.userName,
            email: userInfo.email,
            status: userInfo.status,
            friends: userInfo.friends,
            requests: userInfo.requests,
          },
          {
            userName: friend.userName,
            email: friend.email,
            status: friend.status,
            friends: friend.friends,
            requests: friend.requests,
          },
        ],
      })
    )
    .catch((err) => console.log(err));
};

module.exports = {
  myFriends: myFriends,
  searchFriend: searchFriend,
  requestFriend: requestFriend,
  actionOnRequest: actionOnRequest,
  removeFriend: removeFriend,
};
