const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const ENV = require("./configs/env");
const { connectToDB } = require("./configs/db");
const authRouter = require("./routes/auth.route");
const profileRouter = require("./routes/profile.route");
const booksRouter = require("./routes/books.route");
const aiRouter = require("./routes/ai.route");
const exportsRouter = require("./routes/exports.route");

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // for form data
app.use(
  cors({
    origin: ENV.NODE_ENV === "production" ? ENV.CLIENT_URL : "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Routes
app.use("/api/auth", authRouter);
app.use("/api/profile", profileRouter);
app.use("/api/books", booksRouter);
app.use("/api/ai", aiRouter);
app.use("/api/exports", exportsRouter);

// Static folder for user uploads - serve from backend/uploads
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// PRODUCTION: serve React frontend
if (ENV.NODE_ENV === "production") {
  // serve static files from the React build
  app.use(express.static(path.join(__dirname, "../../frontend/dist")));

  // catch-all route: for any route not matched above, serve index.html
  // this allows React Router to handle routing on the client side
  app.get("/{*any}", (_, res) => {
    res.sendFile(path.join(__dirname, "../../frontend/dist/index.html"));
  });
}

// ERROR HANDLING - Multer specific errors
app.use((err, _, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res
        .status(400)
        .json({ error: "File size too large! Max 2MB allowed." });
    }

    return res.status(400).json({ error: err.message });
  }

  // delegate non-multer errors to the general error handler
  return next(err);
});

// GENERAL ERROR HANDLER
app.use((err, _, res, next) => {
  console.error("Unhandled error:", err);

  // don't send another response if headers already sent
  if (res.headersSent) {
    return next(err);
  }

  res.status(500).json({
    error: "Something went wrong!",
    ...(ENV.NODE_ENV === "development" && { details: err.message }),
  });
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
