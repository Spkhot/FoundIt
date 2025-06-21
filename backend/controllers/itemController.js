const Item = require("../models/Item");

// ✅ POST /api/items
exports.createItem = async (req, res) => {
  try {
    const { productName, category, location, description, contact } = req.body;
    const image = req.file?.filename;

    // Basic Validation
    if (!productName || !category || !location || !description || !contact || !image) {
      return res.status(400).json({ message: "All fields including image are required." });
    }

    const newItem = new Item({
      productName,
      category,
      location,
      description,
      contact,
      image
    });

    await newItem.save();
    res.status(201).json({ message: "Item posted successfully.", item: newItem });

  } catch (error) {
    console.error("❌ Error in createItem:", error.message);
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
