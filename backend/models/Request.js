const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  description: String,
  contact: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  reward: String,
}, {
  timestamps: true
});

module.exports = mongoose.model("Request", requestSchema);
