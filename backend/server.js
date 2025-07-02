// server.js
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");

const connectDB = require("./config/db");
const itemRoutes = require("./routes/itemRoutes");
const requestRoutes = require("./routes/requestRoutes");
const otpRoutes = require("./routes/otpRoutes");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// 🔗 Connect to MongoDB
connectDB();

// 🛡 Middleware
app.use(cors());
app.use(express.json()); // Parse application/json
app.use(express.urlencoded({ extended: true })); // Parse form data

// 🛣 API Routes
app.use("/api/items", itemRoutes);     // Found items
app.use("/api/requests", requestRoutes); // Lost item requests
app.use("/api/otp", otpRoutes);         // OTP for verification

// 📸 Serve uploaded images (Cloudinary may not use this, but keep for fallback)
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

// 🚀 Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
