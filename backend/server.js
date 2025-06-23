const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
const connectDB = require("./config/db");
dotenv.config();

// Routes
const feedbackRoutes = require('./routes/feedbackRoutes');
const requestRoutes = require("./routes/requestRoutes");
const itemRoutes = require("./routes/itemRoutes");

const app = express();

// ✅ Connect to MongoDB
connectDB();

// ✅ CORS (MUST come before routes)
const allowedOrigins = [
  "http://localhost:5500",                      // local dev (optional)
  "https://foundit-imky.onrender.com"           // your frontend Render URL
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

// ✅ Middleware
app.use(express.json());

// ✅ API routes (after middleware)
app.use('/api/feedback', feedbackRoutes);
app.use("/api/requests", requestRoutes);
app.use("/api/items", itemRoutes);

// ✅ Serve static uploads
app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));

// ✅ Serve frontend files
app.use(express.static(path.join(__dirname, "public")));

// ✅ Optional SPA fallback (uncomment if needed)
// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "public", "index.html"));
// });

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
