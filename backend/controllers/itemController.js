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

exports.getItems = async (req, res) => { /* unchanged */ };
exports.getItemById = async (req, res) => { /* unchanged */ };
exports.deleteItem = async (req, res) => {
  try {
    const item = await Item.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Deleted" });
  } catch {
    res.status(500).json({ message: "Server error while deleting" });
  }
};
