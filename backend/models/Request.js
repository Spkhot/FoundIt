const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema({
  productName: { type: String, required: true, trim: true },
  location: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  contact: { type: String, required: true, trim: true },
  category: {
    type: String,
    required: true,
    enum: ["wallet", "id", "key", "documents", "shoes", "electronics", "other"]
  },
  reward: { type: String, trim: true },
  email: { type: String, required: true, lowercase: true, trim: true }
}, {
  timestamps: true
});

module.exports = mongoose.model("Request", requestSchema);
