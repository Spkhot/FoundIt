const Request = require("../models/Request");

exports.createRequest = async (req, res) => {
  try {
    const { productName, location, description, contact, category, reward } = req.body;

    // Validate required fields
    if (!productName || !location || !contact || !category) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const request = new Request({
      productName,
      location,
      description,
      contact,
      category,
      reward
    });

    await request.save();
    res.status(201).json({ message: "Request submitted successfully", request });

  } catch (error) {
    console.error("Create request error:", error.message);
    res.status(500).json({ message: "Server error." });
  }
};

exports.getRequests = async (req, res) => {
  try {
    const requests = await Request.find().sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    console.error("Get requests error:", error.message);
    res.status(500).json({ message: "Server error." });
  }
};

exports.deleteRequest = async (req, res) => {
  try {
    const request = await Request.findByIdAndDelete(req.params.id);
    if (!request) {
      return res.status(404).json({ message: "Request not found." });
    }
    res.json({ message: "Request deleted successfully." });
  } catch (err) {
    console.error("Delete error:", err.message);
    res.status(500).json({ message: "Server error." });
  }
};
