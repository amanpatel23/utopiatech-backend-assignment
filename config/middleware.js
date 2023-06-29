const jwt = require("jsonwebtoken");
const config = require("../config/config");

module.exports.auth = async function (request, response, next) {
  let access_token = request.header("Authorization");
  if (!access_token) {
    return response.status(401).json({
      success: false,
      message: "no token, authorization denied.",
    });
  }

  try {
    access_token = access_token.split(" ")[1];
    const decode = jwt.verify(access_token, config.jwt_secret);
    request.userId = decode.userId;
    next();
  } catch (error) {
    return response.status(401).json({
      success: false,
      message: error.message,
    });
  }
};
