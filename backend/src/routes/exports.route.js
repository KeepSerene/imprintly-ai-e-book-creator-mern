const router = require("express").Router();
const { authenticate } = require("../middlewares/auth.middleware");
const {
  exportAsDocx,
  exportAsPdf,
} = require("../controllers/exports.controller");

// All export routes require authentication
router.use(authenticate);

router.get("/:bookId/docx", exportAsDocx);
router.get("/:bookId/pdf", exportAsPdf);

module.exports = router;
