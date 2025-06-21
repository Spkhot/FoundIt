const Item = require("../models/Item");

exports.createItem = async (req, res) => {
  try {
    const { productName, category, location, description, contact } = req.body;
    const image = req.file?.filename;

    // Validation
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
    res.status(201).json({ message: "Item posted successfully." });

  } catch (error) {
    console.error("Error in createItem:", error.message);
    res.status(500).json({ message: "Server error while posting item." });
  }
};


exports.getItems = async (req, res) => {
  const { category } = req.query;

  const filter = category ? { category } : {};
  const items = await Item.find(filter).sort({ createdAt: -1 });
  res.json(items);
};

exports.getItemById = async (req, res) => {
  const item = await Item.findById(req.params.id);
  if (!item) return res.status(404).json({ error: "Item not found" });
  res.json(item);
};
