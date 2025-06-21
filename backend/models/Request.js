const mongoose = require("mongoose");

const RequestSchema = new mongoose.Schema({
  requesterName: String,
  itemName: String,
  location: String,
  description: String,
  contact: String,
  reward: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Request", RequestSchema);
