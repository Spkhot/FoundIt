const Item = require("../models/Item");
const cloudinary = require("../utils/cloudinary");
const fs = require("fs");

exports.createItem = async (req, res) => {
  try {
    console.log("Fields:", req.body);
    console.log("File:", req.file);

    const { email, productName, category, location, description, contact } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required for verification" });

    if (!req.file) return res.status(400).json({ message: "Image is required" });

    const uploadRes = await cloudinary.uploader.upload(req.file.path, { folder: "found-items" });
    fs.unlinkSync(req.file.path);

    const item = await new Item({
      productName,
      category,
      location,
      description,
      contact,
      email,  // Save verified email
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
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Item not found" });

    // Check if email matches
    const userEmail = req.body.email;
    if (!userEmail || userEmail !== item.email) {
      return res.status(403).json({ message: "Unauthorized. Only the person who posted this can delete it." });
    }

    await Item.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully." });
  } catch (e) {
    console.error("DeleteItem error:", e);
    res.status(500).json({ message: "Server error while deleting" });
  }
};
