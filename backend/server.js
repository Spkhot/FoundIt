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

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/items", itemRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/otp", otpRoutes);

// Serve image uploads (if any)
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
