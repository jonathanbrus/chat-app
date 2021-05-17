const User = require("../Models/User");
const Conversation = require("../Models/Conversation");

const IO = require("../Sockets");

const myChats = async (req, res, next) => {
  const { userName } = await User.findById(req.userId);

  Conversation.find({ members: userName })
    .sort({ updatedAt: -1 })
    .then((result) => res.json(result))
    .catch((err) => res.json(err));
};

const startConversation = async (req, res, next) => {
  const { friendName } = req.body;

  const { userName } = await User.findById(req.userId);

  const newConversation = new Conversation({ members: [userName, friendName] });

  newConversation
    .save()
    .then((data) => res.json(data))
    .catch((err) => res.json(err));
};

const deleteConversation = (req, res, next) => {
  const { convoId } = req.query;

  Conversation.findByIdAndDelete(convoId)
    .then((data) => res.json(data))
    .catch((err) => res.json(err));
};

const sendMessage = (req, res, next) => {
  const { convoId, message } = req.body;

  Conversation.findById(convoId)
    .then((chat) => {
      chat.messages.push(message);
      return chat.save();
    })
    .then(() => {
      res.json(message);

      IO.getIO().emit("sendMessage", {
        action: "sent",
        to: message.to,
        message: message,
      });
    })
    .catch((err) => console.log(err));
};

module.exports = {
  myChats: myChats,
  startConversation: startConversation,
  deleteConversation: deleteConversation,
  sendMessage: sendMessage,
};
