const router = require("express").Router();
const {
  getProfile,
  updateProfile,
} = require("../controllers/profile.controller");

router.get("/", getProfile);
router.put("/update", updateProfile);

module.exports = router;
