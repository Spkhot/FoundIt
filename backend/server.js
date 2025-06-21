const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const mongoose = require("mongoose");
require("dotenv").config();
const path = require("path");

app.use(express.static(path.join(__dirname, "public")));

// Optional: Fallback route to load index.html for all unknown routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

dotenv.config();
const app = express();
connectDB();
mongoose.connect(process.env.MONGO_URI)
// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("public/uploads"));

// Routes
const itemRoutes = require("./routes/itemRoutes");
app.use("/api/items", itemRoutes);

// Test Route
app.get("/", (req, res) => {
  res.send("Lost & Found API is running...");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
