const Item = require("../models/Item");
const cloudinary = require("../utils/cloudinary");
const fs = require("fs");

exports.createItem = async (req, res) => {
  try {
    console.log("Fields:", req.body);
    console.log("File:", req.file);

    if (!req.file) return res.status(400).json({ message: "Image is required" });

    const uploadRes = await cloudinary.uploader.upload(req.file.path, { folder: "found-items" });
    fs.unlinkSync(req.file.path);

    const item = await new Item({
      productName: req.body.productName,
      category: req.body.category,
      location: req.body.location,
      description: req.body.description,
      contact: req.body.contact,
      imageUrl: uploadRes.secure_url,
    }).save();

    res.status(201).json({ message: "Item posted successfully", item });
  } catch (e) {
    console.error("CreateItem error:", e);
    res.status(500).json({ message: "Server error while creating item" });
  }
};

exports.getItems = async (req, res) => {
  try {
    const items = await Item.find().sort({ createdAt: -1 });
    res.status(200).json(items);
  } catch (e) {
    console.error("GetItems error:", e);
    res.status(500).json({ message: "Server error while fetching items" });
  }
};

exports.getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }
    res.status(200).json(item);
  } catch (e) {
    console.error("GetItemById error:", e);
    res.status(500).json({ message: "Server error while fetching item" });
  }
};

exports.deleteItem = async (req, res) => {
  try {
    const item = await Item.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Deleted" });
  } catch {
    res.status(500).json({ message: "Server error while deleting" });
  }
};
