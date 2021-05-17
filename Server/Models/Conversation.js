const mongoose = require("mongoose");

const { Schema } = mongoose;

const conversationSchema = new Schema(
  {
    members: [],
    messages: [],
  },
  { timestamps: true }
);

module.exports = mongoose.model("conversation", conversationSchema);
