const express = require("express");
const dotenv = require("dotenv");
const app = express();
const cors = require("cors");
const { UserRouter } = require("./routes/user.routes"); // Import user routes

dotenv.config();
app.use(express.urlencoded({ extended: true, limit: "40kb" }));
app.use(express.json({ limit: "40kb" }));
app.use(cors());

// Root endpoint
app.get("/", (req, res) => {
  res.send("Welcome to MeshMeet backend");
});

// User-related API routes
app.use("/api/v1/user", UserRouter);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(err.status || 500)
    .json({ success: false, message: err.message || "Internal Server Error" });
});

module.exports = { app };
