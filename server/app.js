const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const donghuaRoutes = require("./routes/donghuaRoutes");
const profileRoutes = require("./routes/profileRoutes");
const errorHandler = require("./middlewares/errorHandler");
const path = require("path");
const cors = require("cors");

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Static file serving for uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/donghua", donghuaRoutes);
app.use("/api/profile", profileRoutes);

// Error handler
app.use(errorHandler);

module.exports = app;
