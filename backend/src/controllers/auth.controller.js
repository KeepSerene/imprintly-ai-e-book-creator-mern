const User = require("../models/User");

async function registerUser(req, res) {
  try {
    const { name, email, password } = req.body;
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).send({ message: "Internal Server Error!" });
  }
}

async function signInUser(req, res) {
  try {
    const { email, password } = req.body;
  } catch (error) {
    console.error("Error signing in user:", error);
    res.status(500).send({ message: "Internal Server Error!" });
  }
}

module.exports = { registerUser, signInUser };
