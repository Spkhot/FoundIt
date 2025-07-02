const express = require("express");
const router = express.Router();
const itemController = require("../controllers/itemController");
const upload = require("../middlewares/uploadMiddleware");

// 📤 POST: Upload a new found item (with image)
router.post("/", upload.single("image"), itemController.createItem);

// 📥 GET: All items
router.get("/", itemController.getItems);

// 📄 GET: Single item by ID
router.get("/:id", itemController.getItemById);

// 🗑️ POST: Delete an item (email check in controller)
router.post("/delete/:id", itemController.deleteItem);

module.exports = router;
