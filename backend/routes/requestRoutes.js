const express = require("express");
const router = express.Router();
const requestController = require("../controllers/requestController");

// POST a new lost item request
router.post("/", requestController.createRequest);

// GET all lost item requests
router.get("/", requestController.getRequests);

// DELETE a request by ID
router.delete("/:id", requestController.deleteRequest);

module.exports = router;
