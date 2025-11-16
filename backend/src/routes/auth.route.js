const router = require("express").Router();
const { registerUser, signInUser } = require("../controllers/auth.controller");

router.post("/register", registerUser);
router.post("/login", signInUser);

module.exports = router;
