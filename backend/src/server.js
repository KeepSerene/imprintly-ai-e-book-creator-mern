const express = require("express");
const cors = require("cors");
const ENV = require("./configs/env");
const path = require("path");
const { connectToDB } = require("./configs/db");
const authRouter = require("./routes/auth.route");
const profileRouter = require("./routes/profile.route");

const app = express();

// Middlewares
app.use(express.json());
app.use(
  cors({
    origin: ENV.CLIENT_URL || "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Routes
app.use("/api/auth", authRouter);
app.use("/profile", profileRouter);

// Static folder for user uploads
app.use("/backend/uploads", express.static(path.join(__dirname, "../uploads")));

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
