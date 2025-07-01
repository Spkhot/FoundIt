const express = require("express");
const router = express.Router();
const itemController = require("../controllers/itemController");
const upload = require("../middlewares/uploadMiddleware");

router.post("/", upload.single("image"), itemController.createItem);
router.get("/", itemController.getItems);
router.get("/:id", itemController.getItemById);

// ⚠️ Updated to POST instead of DELETE for body access
router.post("/delete/:id", itemController.deleteItem);

module.exports = router;
