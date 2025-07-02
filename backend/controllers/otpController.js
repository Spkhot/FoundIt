const nodemailer = require("nodemailer");

// In-memory OTP store: Map<email, { otp, expiresAt, verified }>
const otpStore = new Map();

// 🔢 Generate a 6-digit numeric OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// 📩 Send OTP to email
exports.sendOtp = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email is required" });

  const otp = generateOTP();
  const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes from now
  otpStore.set(email, { otp, expiresAt, verified: false });
  const otpCooldown = 30 * 1000;
const recentRequest = otpStore.get(email);
if (recentRequest && Date.now() - (recentRequest.lastSent || 0) < otpCooldown) {
  return res.status(429).json({ message: "Please wait before requesting another OTP." });
}
otpStore.set(email, { otp, expiresAt, verified: false, lastSent: Date.now() });

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER, // Gmail address
        pass: process.env.MAIL_PASS, // Gmail app password
      },
    });

    const mailOptions = {
      from: process.env.MAIL_USER,
      to: email,
      subject: "🔐 Your OTP for FoundIt Verification",
      html: `<div style="font-family: sans-serif; font-size: 16px;">
        <p>Hi there,</p>
        <p>Your One-Time Password (OTP) is:</p>
        <h2 style="color: #3B82F6;">${otp}</h2>
        <p>This OTP is valid for <strong>5 minutes</strong>.</p>
        <p>– FoundIt Team</p>
      </div>`,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "OTP sent successfully" });
  } catch (err) {
    console.error("❌ OTP send error:", err);
    res.status(500).json({ message: "Failed to send OTP" });
  }
};

// ✅ Verify submitted OTP
exports.verifyOtp = (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    return res.status(400).json({ message: "Email and OTP are required" });
  }

  const record = otpStore.get(email);
  if (!record) {
    return res.status(400).json({ message: "No OTP found for this email" });
  }

  if (Date.now() > record.expiresAt) {
    otpStore.delete(email);
    return res.status(400).json({ message: "OTP has expired" });
  }

  if (record.otp !== otp) {
    return res.status(400).json({ message: "Invalid OTP" });
  }

  // ✅ OTP matched
  otpStore.set(email, { ...record, verified: true });
  res.status(200).json({ message: "OTP verified successfully" });
};

// 🔎 Reusable function for checking if email is verified (used in controllers)
exports.isEmailVerified = (email) => {
  const record = otpStore.get(email);
  return record && record.verified === true;
};
