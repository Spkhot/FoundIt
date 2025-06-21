const mongoose = require("mongoose");

const ItemSchema = new mongoose.Schema({
  productName: String,
  category: {
    type: String,
    enum: ["wallet", "id", "key", "documents", "shoes", "other"],
  },
  location: String,
  description: String,
  contact: String,
  image: String, // Filename or URL
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Item", ItemSchema);
