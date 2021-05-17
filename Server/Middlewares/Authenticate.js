const jwt = require("jsonwebtoken");

const User = require("../Models/User");
const RefreshToken = require("../Models/RefreshToken");

const generateNewAccessToken = async (refreshToken) => {
  const fetchedToken = await RefreshToken.findOne({ token: refreshToken });

  if (!fetchedToken) {
    const error = { message: "Not Authenticated", statusCode: 401 };

    return { error: error };
  }

  const user = jwt.decode(
    fetchedToken.token,
    `${process.env.JWT_REFRESH_SECRET_KEY}`
  );

  const newToken = jwt.sign(
    { userId: user._id, email: user.email, userName: user.userName },
    `${process.env.JWT_SECRET_KEY}`
  );

  return { user: user, newToken: newToken };
};

module.exports = async (req, res, next) => {
  const accessToken = req.header("Authorization");
  const refreshToken = req.header("refresh-token");

  let userDetail;

  let newAccessToken;

  try {
    if (!accessToken) {
      const error = { message: "Not Authenticated", statusCode: 401 };
      throw error;
    } else {
      accessToken.split(" ")[1];
    }

    userDetail = jwt.verify(accessToken, `${process.env.JWT_SECRET_KEY}`);
  } catch (err) {
    const result = await generateNewAccessToken(refreshToken);

    if (result.error) {
      res
        .status(result.error.statusCode)
        .json({ message: result.error.message });
    }

    userDetail = result.user;
    newAccessToken = result.newToken;
  }

  if (userDetail) {
    User.findOne({ email: userDetail.email })
      .then((user) => {
        if (user) {
          req.userId = user._id;
          req.newAccessToken = newAccessToken;

          return next();
        }

        if (!user) {
          throw { message: "No user found", statusCode: 404 };
        }
      })
      .catch((err) =>
        res.status(err.statusCode).json({ message: err.message })
      );
  }
};
