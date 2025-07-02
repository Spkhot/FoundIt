const express = require("express");
const router = express.Router();
const requestController = require("../controllers/requestController");
const otpController = require("../controllers/otpController");

// ✅ OTP Endpoints
router.post("/otp/send", otpController.sendOTP);
router.post("/otp/verify", otpController.verifyOTP);

// ✅ Lost Item Request Endpoints
router.post("/", requestController.createRequest);     // Create a new lost item request
router.get("/", requestController.getRequests);        // Get all requests
router.delete("/:id", requestController.deleteRequest); // Delete a request (only if email matches)

module.exports = router;
