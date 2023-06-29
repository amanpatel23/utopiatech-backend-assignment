const User = require("../models/user");
const jwt = require("jsonwebtoken");
const config = require("../config/config");

module.exports.signUp = async function (request, response) {
  try {
    const { email, username, password, confirm_password } = request.body;

    // check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return response.status(400).json({
        success: false,
        message: "email already exists.",
      });
    }

    // check if passwords match
    if (password !== confirm_password) {
      return response.status(400).json({
        success: false,
        message: "passwords do not match.",
      });
    }

    // create the user
    const newUser = new User({ email, username, password });
    await newUser.save();

    return response.status(200).json({
      success: true,
      message: "user created successfully.",
      user: newUser,
    });
  } catch (error) {
    return response.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports.signIn = async function (request, response) {
  try {
    const { email, password } = request.body;

    const user = await User.findOne({ email });
    if (!user) {
      return response.status(404).json({
        success: false,
        message: "user not found",
      });
    }

    if (password !== user.password) {
      return response.status(401).json({
        success: false,
        message: "invalid credentials",
      });
    }

    const access_token = jwt.sign({ userId: user._id }, config.jwt_secret, {
      expiresIn: config.config.access_token_expiry,
    });
    const refresh_token = jwt.sign({ userId: user._id }, config.jwt_secret, {
      expiresIn: config.config.refresh_token_expiry,
    });

    user.refresh_token = refresh_token;
    await user.save();

    return response.status(200).json({
      success: true,
      access_token: access_token,
      refresh_token: refresh_token,
      message: "login successfull.",
      user_id: user._id,
    });
  } catch (error) {
    return response.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports.userInfo = async function (request, response) {
  try {
    const userId = request.userId;
    const user = await User.findById(userId);
    if (!user) {
      return response.status(404).json({
        success: false,
        message: "user does not exist.",
      });
    }

    return response.status(200).json({
      success: true,
      userInfo: user,
    });
  } catch (error) {
    return response.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports.refreshToken = async function (request, response) {
  try {
    const { refresh_token } = request.body;

    jwt.verify(refresh_token, config.jwt_secret, async (error, decode) => {
      if (error) {
        return response.status(401).json({
          success: false,
          message: "invalid refresh token.",
        });
      }

      const userId = decode.userId;

      const user = await User.findById(userId);
      if (!user) {
        return response.status(401).json({
          success: false,
          message: "user not found.",
        });
      }

      if (!user.refresh_token || refresh_token !== user.refresh_token) {
        return response.status(401).json({
          success: false,
          message: "invalid refresh token",
        });
      }

      request.userId = userId;
      const access_token = jwt.sign({ userId: user._id }, config.jwt_secret, {
        expiresIn: config.config.access_token_expiry,
      });

      return response.status(200).json({
        success: true,
        message: "token refreshed successfully.",
        access_token: access_token,
      });
    });
  } catch (error) {
    return response.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports.deleteUser = async function (request, response) {
  try {
    // get the userId from string param and delete the user from the database
    const userId = request.params.userId;

    const user = await User.findById(userId);
    if (!user) {
      return response.status(404).json({
        success: false,
        message: "user does not exist",
      });
    }

    await User.deleteOne({ _id: userId });

    return response.status(200).json({
      success: true,
      message: "user deleted successfully.",
    });
  } catch (error) {
    return response.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
