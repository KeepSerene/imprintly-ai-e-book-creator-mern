const router = require("express").Router();
const { authenticate } = require("../middlewares/auth.middleware");
const {
  getBooks,
  getBookById,
  createBook,
  updateBookContent,
  updateBookCover,
  deleteBook,
} = require("../controllers/books.controller");
const { uploadBookCoverImage } = require("../middlewares/upload.middleware");

// All routes require authentication
router.use(authenticate);

// GET /api/books - Get all user's books
// POST /api/books - Create a new book
router.route("/").get(getBooks).post(createBook);

// GET /api/books/:bookId - Get a specific book
// PUT /api/books/:bookId - Update book content/metadata
// DELETE /api/books/:bookId - Delete a book
router
  .route("/:bookId")
  .get(getBookById)
  .put(updateBookContent)
  .delete(deleteBook);

// PUT /api/books/:bookId/cover - Upload/update book cover image
router.route("/:bookId/cover").put(uploadBookCoverImage, updateBookCover);

module.exports = router;
