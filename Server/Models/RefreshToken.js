const mongoose = require("mongoose");

const { Schema } = mongoose;

const refreshTokenSchema = new Schema(
  {
    token: {
      type: String,
      unique: true,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
  },
  { timestamps: { createdAt: "created_at" } }
);

module.exports = mongoose.model("RefreshToken", refreshTokenSchema);
