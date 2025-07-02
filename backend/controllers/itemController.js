const Item = require("../models/Item");
const cloudinary = require("../utils/cloudinary");
const fs = require("fs");
const { isEmailVerified } = require("./otpController");

// ✅ POST /api/items - Create new found item
exports.createItem = async (req, res) => {
  try {
    const { email, productName, category, location, description, contact } = req.body;

    if (!email) return res.status(400).json({ message: "Email is required." });
    if (!isEmailVerified(email)) {
      return res.status(403).json({ message: "Please verify your email before posting." });
    }

    if (!req.file) return res.status(400).json({ message: "Image file is required." });

    // 🔼 Upload to Cloudinary
    const uploadRes = await cloudinary.uploader.upload(req.file.path, {
      folder: "found-items",
    });

    // ✅ Remove local file after upload
    fs.unlinkSync(req.file.path);

    const item = new Item({
      productName,
      category,
      location,
      description,
      contact,
      email,
      imageUrl: uploadRes.secure_url,
    });

    await item.save();

    res.status(201).json({ message: "✅ Item posted successfully", item });
  } catch (e) {
    console.error("❌ createItem error:", e);
    res.status(500).json({ message: "Server error while posting item." });
  }
};

// ✅ GET /api/items - Get all items
exports.getItems = async (req, res) => {
  try {
    const items = await Item.find().sort({ createdAt: -1 });
    res.status(200).json(items);
  } catch (e) {
    console.error("❌ getItems error:", e);
    res.status(500).json({ message: "Server error while fetching items." });
  }
};

// ✅ GET /api/items/:id - Get item by ID
exports.getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found." });
    res.status(200).json(item);
  } catch (e) {
    console.error("❌ getItemById error:", e);
    res.status(500).json({ message: "Server error while fetching item." });
  }
};

// ✅ DELETE /api/items/:id - Delete item by owner
exports.deleteItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found." });

    const userEmail = req.body.email;
    if (!userEmail || userEmail !== item.email) {
      return res.status(403).json({
        message: "❌ Unauthorized. Only the person who posted this item can delete it.",
      });
    }

    await Item.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "✅ Item deleted successfully." });
  } catch (e) {
    console.error("❌ deleteItem error:", e);
    res.status(500).json({ message: "Server error while deleting item." });
  }
};
