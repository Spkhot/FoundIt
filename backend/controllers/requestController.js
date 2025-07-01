const Request = require("../models/Request");
const { isEmailVerified } = require("./otpController");

// POST: Create a new lost item request
exports.createRequest = async (req, res) => {
  const { productName, location, description, contact, category, reward } = req.body;

  if (!isEmailVerified(contact)) {
    return res.status(403).json({ message: "OTP verification required for this email" });
  }

  try {
    const newRequest = new Request({ productName, location, description, contact, category, reward });
    await newRequest.save();
    res.status(201).json({ message: "Request posted successfully", data: newRequest });
  } catch (err) {
    res.status(500).json({ message: "Error saving request", error: err.message });
  }
};

// GET: All lost item requests
exports.getRequests = async (req, res) => {
  try {
    const requests = await Request.find().sort({ createdAt: -1 });
    res.status(200).json(requests);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch requests", error: err.message });
  }
};

// DELETE: Only allow user who posted to delete
exports.deleteRequest = async (req, res) => {
  const requestId = req.params.id;
  const { email } = req.body;

  try {
    const request = await Request.findById(requestId);
    if (!request) return res.status(404).json({ message: "Request not found" });

    if (request.contact !== email) {
      return res.status(403).json({ message: "Unauthorized. You can only delete your own request." });
    }

    await request.deleteOne();
    res.status(200).json({ message: "Request deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete request", error: err.message });
  }
};
