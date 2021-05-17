const mongoose = require("mongoose");

const { Schema } = mongoose;

const userSchema = new Schema({
  userName: {
    type: String,
    unique: true,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: "Hey there!, I am using JoeyMessenger.",
  },
  friends: {
    type: Array,
  },
  requests: {
    type: Array,
  },
});

module.exports = mongoose.model("User", userSchema);
