const Item = require("../models/Item");
const cloudinary = require("../utils/cloudinary");
const fs = require("fs");

// Create new item
exports.createItem = async (req, res) => {
  try {
    console.log("🛬 POST /api/items body:", req.body);

    // 🛑 Prevent crash if no image is uploaded
    if (!req.file) {
      return res.status(400).json({ message: "No image file uploaded" });
    }

    // ✅ Upload to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "found-items",
    });

    const newItem = new Item({
      productName: req.body.productName,
      category: req.body.category,
      location: req.body.location,
      description: req.body.description,
      contact: req.body.contact,
      image: result.secure_url,
    });

    await newItem.save();

    // ✅ Remove temp image from server
    fs.unlinkSync(req.file.path);

    res.status(201).json({ message: "Item posted successfully", item: newItem });
  } catch (error) {
    console.error("❌ Error creating item:", error.message);
    res.status(500).json({ message: "Server error while creating item" });
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
