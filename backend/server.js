const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
const connectDB = require("./config/db");

// Load environment variables
dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static uploads (image access via http://localhost:5000/uploads/...)
app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));

// Serve frontend files (e.g., index.html)
app.use(express.static(path.join(__dirname, "public")));

// API Routes
const itemRoutes = require("./routes/itemRoutes");
app.use("/api/items", itemRoutes);

// Optional fallback for SPA routing (e.g., React, Vue)
// Uncomment only if you're using a frontend build
// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "public", "index.html"));
// });

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
