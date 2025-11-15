const jwt = require("jsonwebtoken");
const ENV = require("../configs/env");

function generateToken(id) {
  return jwt.sign({ id }, ENV.JWT_SECRET_KEY, {
    expiresIn: "7d",
  });
}

module.exports = { generateToken };
