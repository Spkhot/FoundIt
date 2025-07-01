const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  productName: String,
  category: { type: String, enum: ["wallet", "id", "key", "documents", "shoes", "electronics", "other"] },
  location: String,
  description: String,
  contact: String,
  email: { type: String, required: true },  // 🔐 Email of the verified user
  imageUrl: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Item", schema);
