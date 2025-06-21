const Request = require("../models/Request");

exports.createRequest = async (req, res) => {
  try {
    const { name, item, location, description, contact, reward } = req.body;

    if (!name || !item || !location || !description || !contact) {
      return res.status(400).json({ message: "All required fields must be filled." });
    }

    const newRequest = new Request({ name, item, location, description, contact, reward });
    await newRequest.save();
    res.status(201).json({ message: "Request submitted successfully." });
  } catch (error) {
    console.error("Create request error:", error.message);
    res.status(500).json({ message: "Server error." });
  }
};

exports.getRequests = async (req, res) => {
  const requests = await Request.find().sort({ createdAt: -1 });
  res.json(requests);
};

exports.deleteRequest = async (req, res) => {
  try {
    const request = await Request.findByIdAndDelete(req.params.id);
    if (!request) return res.status(404).json({ message: "Request not found." });
    res.json({ message: "Request deleted successfully." });
  } catch (err) {
    console.error("Delete error:", err.message);
    res.status(500).json({ message: "Server error." });
  }
};
