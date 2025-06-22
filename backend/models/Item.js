const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  productName: String,
  category: { type: String, enum: [...] },
  location: String,
  description: String,
  contact: String,
  imageUrl: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Item", schema);
