const Item = require("../models/Item");
const cloudinary = require("../utils/cloudinary");
const fs = require("fs"); // ✅ Needed to delete local file

// ✅ POST /api/items
exports.createItem = async (req, res) => {
  try {
    const { productName, category, location, description, contact } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "Image is required." });
    }

    console.log("📸 Uploading image to Cloudinary:", req.file.path);

    const cloudResult = await cloudinary.uploader.upload(req.file.path, {
      folder: "foundit_items",
    });

    const imageUrl = cloudResult.secure_url;

    const newItem = new Item({
      productName,
      category,
      location,
      description,
      contact,
      image: imageUrl, // ✅ make sure you’re using correct field here
    });

    await newItem.save();
    res.status(201).json({ message: "Item posted successfully.", item: newItem });

  } catch (error) {
    console.error("❌ FULL ERROR STACK:", error);
    res.status(500).json({ message: "Server error while posting item." });
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
