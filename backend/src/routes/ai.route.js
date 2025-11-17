const router = require("express").Router();
const { authenticate } = require("../middlewares/auth.middleware");
const {
  generateBookOutline,
  generateChapterContent,
} = require("../controllers/ai.controller");

router.use(authenticate);

router.post("/generate-book-outline", generateBookOutline);
router.post("/generate-chapter-content", generateChapterContent);

module.exports = router;
