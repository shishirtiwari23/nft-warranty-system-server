const { collections, messages } = require("../utils/constants");
const { getResponse } = require("../utils/functions");

async function auth(req, res, next) {
  const token = req.headers["authorization"];
  if (token) {
    const decoded = await jwt.verify(token, config.jwtSecret);
    if (!decoded) {
      return getResponse(
        res,
        401,
        messages.error.auth.token,
        collections.USERS
      );
    }
    req.user = decoded;
  }
  next();
}

module.exports = { auth };
