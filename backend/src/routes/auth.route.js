const router = require("express").Router();
const { registerUser, signInUser } = require("../controllers/auth.controller");

router.post("/register", registerUser);
router.post("/sign-in", signInUser);

module.exports = router;
