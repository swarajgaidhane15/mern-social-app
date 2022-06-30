const User = require("../models/user");
const jwt = require("jsonwebtoken");
const { jwt_secret } = require('../config/keys');

function auth(req, res, next) {
  const token = req.header("x-auth-token");

  if (!token) {
    return res.status(401).json({ msg: "No token, Authorization denied" });
  }

  try {
    //   Verify token
    const decoded = jwt.verify(token, jwt_secret);

    // Add user from payload
    User.findById(decoded.id)
      .select("-password")
      .then((user) => {
        req.user = user;
        next();
      });
  } catch (err) {
    res.status(400).json({ error: true, msg: "Token is invalid" });
  }
}

module.exports = auth;
