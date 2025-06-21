const express = require("express");
const router = express.Router();
const itemController = require("../controllers/itemController");
const upload = require("../middlewares/uploadMiddleware");
const Item = require('../models/Item'); // ✅ Make sure path is correct

router.post("/", upload.single("image"), itemController.createItem);
router.get("/", itemController.getItems);
router.get("/:id", itemController.getItemById);
// DELETE /api/items/:id
router.delete('/:id', async (req, res) => {
  try {
    console.log("Attempting to delete:", req.params.id);
    const item = await Item.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.status(200).json({ message: 'Item deleted successfully' });
  } catch (error) {
    console.error("Delete failed:", error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
