const Book = require("../models/Book");
const path = require("path");
const fs = require("fs");

async function getBooks(req, res) {
  try {
    const books = await Book.find({ userId: req.user.id }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      message: "User's books retrieved successfully!",
      count: books.length,
      books,
    });
  } catch (error) {
    console.error("Error getting books:", error);

    return res.status(500).json({ error: "Internal Server Error!" });
  }
}

async function getBookById(req, res) {
  try {
    const { bookId } = req.params;

    const book = await Book.findById(bookId);

    if (!book) {
      return res.status(404).json({ error: "Book not found!" });
    }

    // Check authorization
    if (book.userId.toString() !== req.user.id.toString()) {
      return res
        .status(403)
        .json({ error: "Forbidden: You don't have access to this book!" });
    }

    return res.status(200).json({
      message: "Book retrieved successfully!",
      book,
    });
  } catch (error) {
    console.error("Error getting book:", error);

    // Handle invalid ObjectId
    if (error.name === "CastError") {
      return res.status(400).json({ error: "Invalid book ID format!" });
    }

    return res.status(500).json({ error: "Internal Server Error!" });
  }
}

async function createBook(req, res) {
  try {
    const { title, subtitle, author, chapters } = req.body;

    // Validate required fields
    if (!title || !author) {
      return res.status(400).json({ error: "Title and author are required!" });
    }

    const book = await Book.create({
      userId: req.user.id,
      title,
      subtitle,
      author,
      chapters: chapters || [],
    });

    return res.status(201).json({
      message: "Book created successfully!",
      book,
    });
  } catch (error) {
    console.error("Error creating book:", error);

    return res.status(500).json({ error: "Internal Server Error!" });
  }
}

async function updateBookContent(req, res) {
  try {
    const { bookId } = req.params;

    const book = await Book.findById(bookId);

    if (!book) {
      return res.status(404).json({ error: "Book not found!" });
    }

    // Check authorization
    if (book.userId.toString() !== req.user.id.toString()) {
      return res
        .status(403)
        .json({ error: "Forbidden: You cannot update this book!" });
    }

    // Validate that we're not allowing userId to be changed
    if (req.body.userId) {
      return res.status(400).json({ error: "Cannot change book owner!" });
    }

    // Update book with validation
    const updatedBook = await Book.findByIdAndUpdate(bookId, req.body, {
      new: true, // Return updated document
      runValidators: true, // Run Mongoose validators
    });

    return res.status(200).json({
      message: "Book updated successfully!",
      book: updatedBook,
    });
  } catch (error) {
    console.error("Error updating book content:", error);

    // Handle invalid ObjectId
    if (error.name === "CastError") {
      return res.status(400).json({ error: "Invalid book ID format!" });
    }

    return res.status(500).json({ error: "Internal Server Error!" });
  }
}

async function updateBookCover(req, res) {
  try {
    const { bookId } = req.params;

    if (!req.file) {
      return res.status(400).json({ error: "No image file provided!" });
    }

    const book = await Book.findById(bookId);

    if (!book) {
      // Delete uploaded file if book not found
      fs.unlinkSync(req.file.path);

      return res.status(404).json({ error: "Book not found!" });
    }

    // Check authorization
    if (book.userId.toString() !== req.user.id.toString()) {
      // Delete uploaded file if unauthorized
      fs.unlinkSync(req.file.path);

      return res
        .status(403)
        .json({ error: "Forbidden: You cannot update this book cover!" });
    }

    // Delete old cover image if it exists
    if (book.coverImage) {
      const oldImagePath = path.join(__dirname, "../../", book.coverImage);

      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    // Save relative path from backend root
    book.coverImage = `/uploads/${req.file.filename}`;
    const updatedBook = await book.save();

    return res.status(200).json({
      message: "Book cover updated successfully!",
      book: updatedBook,
    });
  } catch (error) {
    console.error("Error updating book cover image:", error);

    // Clean up uploaded file on error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    // Handle invalid ObjectId
    if (error.name === "CastError") {
      return res.status(400).json({ error: "Invalid book ID format!" });
    }

    return res.status(500).json({ error: "Internal Server Error!" });
  }
}

async function deleteBook(req, res) {
  try {
    const { bookId } = req.params;

    const book = await Book.findById(bookId);

    if (!book) {
      return res.status(404).json({ error: "Book not found!" });
    }

    // Check authorization
    if (book.userId.toString() !== req.user.id.toString()) {
      return res
        .status(403)
        .json({ error: "Forbidden: You cannot delete this book!" });
    }

    // Delete cover image if it exists
    if (book.coverImage) {
      const imagePath = path.join(__dirname, "../../", book.coverImage);

      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await book.deleteOne();

    return res.status(200).json({
      message: "Book deleted successfully!",
      deletedBookId: bookId,
    });
  } catch (error) {
    console.error("Error deleting book:", error);

    // Handle invalid ObjectId
    if (error.name === "CastError") {
      return res.status(400).json({ error: "Invalid book ID format!" });
    }

    return res.status(500).json({ error: "Internal Server Error!" });
  }
}

module.exports = {
  getBooks,
  getBookById,
  createBook,
  updateBookContent,
  updateBookCover,
  deleteBook,
};
