const Request = require("../models/Request");
const { isEmailVerified } = require("./otpController");

// ✅ POST /api/requests - Create a new lost item request
exports.createRequest = async (req, res) => {
  const {
    productName,
    location,
    description,
    contact,
    category,
    reward,
    email, // 👈 now explicitly used for OTP check
  } = req.body;

  if (!email || !isEmailVerified(email)) {
    return res.status(403).json({ message: "OTP verification required for this email." });
  }

  if (!productName || !location || !contact || !category || !email) {
    return res.status(400).json({ message: "Missing required fields." });
  }

  try {
    const newRequest = new Request({
      productName,
      location,
      description,
      contact,
      category,
      reward,
      email, // 👈 store in DB for verification when deleting
    });

    await newRequest.save();
    res.status(201).json({
      message: "✅ Lost item request posted successfully.",
      data: newRequest,
    });
  } catch (err) {
    console.error("❌ Error saving request:", err);
    res.status(500).json({
      message: "Server error while saving request.",
      error: err.message,
    });
  }
};

// ✅ GET /api/requests - Get all lost item requests
exports.getRequests = async (req, res) => {
  try {
    const requests = await Request.find().sort({ createdAt: -1 });
    res.status(200).json(requests);
  } catch (err) {
    console.error("❌ Failed to fetch requests:", err);
    res.status(500).json({
      message: "Server error while fetching requests.",
      error: err.message,
    });
  }
};

// ✅ DELETE /api/requests/:id - Delete a request (only by original poster)
exports.deleteRequest = async (req, res) => {
  const requestId = req.params.id;
  const { email } = req.body;

  if (!email) return res.status(400).json({ message: "Email is required to delete." });

  try {
    const request = await Request.findById(requestId);
    if (!request) return res.status(404).json({ message: "Request not found." });

    if (request.email !== email) {
      return res.status(403).json({
        message: "❌ Unauthorized. You can only delete your own request.",
      });
    }

    await request.deleteOne();
    res.status(200).json({ message: "✅ Request deleted successfully." });
  } catch (err) {
    console.error("❌ Delete error:", err);
    res.status(500).json({
      message: "Server error while deleting request.",
      error: err.message,
    });
  }
};
