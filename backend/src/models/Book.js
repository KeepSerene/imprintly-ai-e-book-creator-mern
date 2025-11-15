const mongoose = require("mongoose");

const chapterSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Chapter title is required"],
      trim: true,
      maxLength: [200, "Chapter title cannot exceed 200 characters"],
    },
    description: {
      type: String,
      default: "",
      maxLength: [500, "Chapter description cannot exceed 500 characters"],
    },
    content: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const bookSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
      index: true, // speed up queries by userId
    },
    title: {
      type: String,
      required: [true, "Book title is required"],
      trim: true,
      minLength: [1, "Book title cannot be empty"],
      maxLength: [200, "Book title cannot exceed 200 characters"],
    },
    subtitle: {
      type: String,
      default: "",
      maxLength: [300, "Subtitle cannot exceed 300 characters"],
    },
    author: {
      type: String,
      required: [true, "Author name is required"],
      trim: true,
      maxLength: [100, "Author name cannot exceed 100 characters"],
    },
    coverImage: {
      type: String,
      default: "",
    },
    chapters: [chapterSchema],
    status: {
      type: String,
      enum: {
        values: ["draft", "published"],
        message: "Status must be either 'draft' or 'published'",
      },
      default: "draft",
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
bookSchema.index({ userId: 1, status: 1 });
bookSchema.index({ title: "text" }); // Enable text search on title

const Book = mongoose.model("Book", bookSchema);

module.exports = Book;
