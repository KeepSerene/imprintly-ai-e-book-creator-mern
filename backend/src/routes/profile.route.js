const router = require("express").Router();
const {
  getProfile,
  updateProfile,
} = require("../controllers/profile.controller");
const { authenticate } = require("../middlewares/auth.middleware");

router.get("/", authenticate, getProfile);
router.put("/", authenticate, updateProfile);

module.exports = router;
