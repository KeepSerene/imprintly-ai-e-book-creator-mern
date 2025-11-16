const express = require("express");
const cors = require("cors");
const ENV = require("./configs/env");
const path = require("path");
const { connectToDB } = require("./configs/db");
const authRouter = require("./routes/auth.route");
const profileRouter = require("./routes/profile.route");
const booksRouter = require("./routes/books.route");
const aiRouter = require("./routes/ai.route");

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // for form data
app.use(
  cors({
    origin: ENV.CLIENT_URL || "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Routes
app.use("/api/auth", authRouter);
app.use("/api/profile", profileRouter);
app.use("/api/books", booksRouter);
app.use("/api/ai", aiRouter);

// Static folder for user uploads - serve from backend/uploads
app.use("/backend/uploads", express.static(path.join(__dirname, "../uploads")));

// Error handling for multer
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res
        .status(400)
        .json({ error: "File size too large! Max 2MB allowed." });
    }

    return res.status(400).json({ error: err.message });
  } else if (err) {
    return res.status(400).json({ error: err.message });
  }

  next();
});

// Start server
async function startServer() {
  await connectToDB();
  app.listen(ENV.PORT, () => {
    console.log(`Server running on port ${ENV.PORT}`);
    console.log(`Environment: ${ENV.NODE_ENV}`);
  });
}

(async () => {
  try {
    await startServer();
  } catch (error) {
    console.error("Error starting the server:", error);
  }
})();
