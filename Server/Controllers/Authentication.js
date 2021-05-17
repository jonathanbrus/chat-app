const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const User = require("../Models/User");
const RefreshToken = require("../Models/RefreshToken");

const signUp = (req, res, next) => {
  const { userName, email, password } = req.body.User;

  User.findOne({ email: email })
    .then(async (user) => {
      if (user) {
        const error = { message: "user already exists", statusCode: 401 };
        throw error;
      }

      const result = await User.findOne({ userName: userName });

      if (result) {
        const error = {
          message: "user name already exists, choose a different user name",
          statusCode: 406,
        };
        throw error;
      }

      const hashesPassword = await bcrypt.hash(password, 12);

      const newUser = new User({
        userName: userName,
        email: email,
        password: hashesPassword,
      });

      return newUser.save();
    })
    .then((user) => {
      const accessToken = jwt.sign(
        { userId: user._id, email: user.email, userName: user.userName },
        `${process.env.JWT_SECRET_KEY}`,
        { expiresIn: "15m" }
      );

      const refreshToken = jwt.sign(
        { userId: user._id, email: user.email, userName: user.userName },
        `${process.env.JWT_REFRESH_SECRET_KEY}`
      );

      const newRefreshToken = new RefreshToken({
        token: refreshToken,
        userId: user._id,
      });

      newRefreshToken.save();

      res.status(201).json({
        user: {
          userName: user.userName,
          email: user.email,
          status: user.status,
          friends: user.friends,
          requests: user.requests,
        },
        accessToken: accessToken,
        refreshToken: refreshToken,
        message: "Created user and sign in successful",
      });
    })
    .catch((err) => {
      res.status(err.statusCode).json({ Error: err.message });
    });
};

const signIn = (req, res, next) => {
  const { email, password } = req.body.User;

  User.findOne({ email: email })
    .then(async (user) => {
      if (!user) {
        const error = {
          message:
            "User not found with the entered email id, create a new account",
          statusCode: 401,
        };
        throw error;
      }

      const isValid = await bcrypt.compare(password, user.password);

      if (!isValid) {
        const error = {
          message: "Password does not match try again.",
          statusCode: 401,
        };
        throw error;
      }

      const accessToken = jwt.sign(
        { userId: user._id, email: user.email, userName: user.userName },
        `${process.env.JWT_SECRET_KEY}`,
        { expiresIn: "15m" }
      );

      const refreshToken = jwt.sign(
        { userId: user._id, email: user.email, userName: user.userName },
        `${process.env.JWT_REFRESH_SECRET_KEY}`
      );

      const newRefreshToken = new RefreshToken({
        token: refreshToken,
        userId: user._id,
      });

      newRefreshToken.save();

      res.status(200).json({
        user: {
          userName: user.userName,
          email: user.email,
          status: user.status,
          friends: user.friends,
          requests: user.requests,
        },
        accessToken: accessToken,
        refreshToken: refreshToken,
        message: "User Sign in successful",
      });
    })
    .catch((err) => res.status(err.statusCode).json({ Error: err.message }));
};

const signOut = (req, res, next) => {
  const refreshToken = req.body.refreshToken;

  RefreshToken.findOneAndDelete({ token: refreshToken })
    .then(() => {
      res.json({ message: "Signed Out" });
    })
    .catch((err) => res.status(500).json({ error: err.message }));
};

module.exports = { signUp: signUp, signIn: signIn, signOut: signOut };
