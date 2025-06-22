// models/Item.js
const mongoose = require("mongoose");

const ItemSchema = new mongoose.Schema({
  productName: { type: String, required: true, trim: true },
  category: {
    type: String,
    enum: ["wallet", "id", "key", "documents", "shoes", "electronics", "other"],
    required: true
  },
  location: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  contact: { type: String, required: true, trim: true },
  image: { type: String, required: true },  // ⚠️ Store Cloudinary URL here
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Item", ItemSchema);
