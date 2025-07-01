const express = require("express");
const router = express.Router();
const requestController = require("../controllers/requestController");
const otpController = require("../controllers/otpController");

// Send OTP to email
router.post("/otp/send", otpController.sendOTP);

// Verify OTP
router.post("/otp/verify", otpController.verifyOTP);

// POST a new lost item request (with OTP check)
router.post("/", requestController.createRequest);

// GET all lost item requests
router.get("/", requestController.getRequests);

// DELETE a request by ID (only if email matches)
router.delete("/:id", requestController.deleteRequest);

module.exports = router;

