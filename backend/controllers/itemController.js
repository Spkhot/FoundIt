// controllers/itemController.js
const Item = require("../models/Item");
const cloudinary = require("../utils/cloudinary");
const fs = require("fs");

exports.createItem = async (req, res) => {
  try {
    console.log("🛬 Received POST /api/items", "file:", req.file, "body:", req.body);

    if (!req.file) {
      return res.status(400).json({ message: "Image file is required." });
    }

    const cloudResult = await cloudinary.uploader.upload(req.file.path, {
      folder: "foundit_items",
    });
    console.log("✅ Cloudinary uploaded:", cloudResult.secure_url);

    fs.unlinkSync(req.file.path);

    const newItem = new Item({
      productName: req.body.productName,
      category: req.body.category,
      location: req.body.location,
      description: req.body.description,
      contact: req.body.contact,
      image: cloudResult.secure_url
    });

    await newItem.save();
    return res.status(201).json({ message: "Item posted successfully", item: newItem });

  } catch (error) {
    console.error("🔥 FULL ERROR in createItem():", error);
    return res.status(500).json({ message: "Server error while posting item." });
  }
};



// ✅ GET /api/items?category=
exports.getItems = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category ? { category } : {};
    const items = await Item.find(filter).sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    console.error("❌ Error in getItems:", err.message);
    res.status(500).json({ message: "Server error fetching items." });
  }
};

// ✅ GET /api/items/:id
exports.getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ error: "Item not found" });
    res.json(item);
  } catch (err) {
    console.error("❌ Error in getItemById:", err.message);
    res.status(500).json({ message: "Server error fetching item." });
  }
};
