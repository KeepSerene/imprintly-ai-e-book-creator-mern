const jwt = require("jsonwebtoken");
const ENV = require("../configs/env");
const User = require("../models/User");

function generateToken(userId) {
  return jwt.sign({ id: userId }, ENV.JWT_SECRET_KEY, { expiresIn: "7d" });
}

async function registerUser(req, res) {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "Required fields are missing!" });
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      console.error("Email already registered!");

      return res.status(400).json({ error: "Registration failed!" });
    }

    const user = await User.create({ name, email, password });

    return res.status(201).json({
      message: "User registered successfully!",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error("Error registering user:", error);

    return res.status(500).json({ error: "Internal Server Error!" });
  }
}

async function signInUser(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Required fields are missing!" });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.passwordsMatch(password))) {
      return res.status(401).json({ error: "Invalid credentials!" });
    }

    return res.status(200).json({
      message: "User signed in successfully!",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      },
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error("Error signing in user:", error);

    return res.status(500).json({ error: "Internal Server Error!" });
  }
}

module.exports = { registerUser, signInUser };
