const mongoose = require("mongoose"); 

const schema = new mongoose.Schema({
  productName: { type: String, required: true, trim: true },
  category: { 
    type: String, 
    enum: ["wallet", "id", "key", "documents", "shoes", "electronics", "other"],
    required: true
  },
  location: { type: String, required: true, trim: true },
  description: { type: String, trim: true },
  contact: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  imageUrl: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});


module.exports = mongoose.model("Item", schema);
