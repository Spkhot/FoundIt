const nodemailer = require("nodemailer");

// In-memory OTP storage: { "email@example.com": { otp: "123456", expiresAt: Date } }
const otpStore = new Map();

// Generate 6-digit OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Send OTP to user
exports.sendOTP = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email is required" });

  const otp = generateOTP();
  const expiresAt = Date.now() + 5 * 60 * 1000; // expires in 5 min

  otpStore.set(email, { otp, expiresAt });

  try {
    // Setup nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USER, // your email
        pass: process.env.MAIL_PASS, // your password or app password
      },
    });

    const mailOptions = {
      from: process.env.MAIL_USER,
      to: email,
      subject: "Your OTP for FoundIt Post Verification",
      html: `<p>Your OTP is <b>${otp}</b>. It expires in 5 minutes.</p>`,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "OTP sent successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to send OTP" });
  }
};

// Verify OTP
exports.verifyOTP = (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) return res.status(400).json({ message: "Email and OTP required" });

  const record = otpStore.get(email);
  if (!record) return res.status(400).json({ message: "No OTP found for this email" });

  if (Date.now() > record.expiresAt) {
    otpStore.delete(email);
    return res.status(400).json({ message: "OTP expired" });
  }

  if (record.otp !== otp) {
    return res.status(400).json({ message: "Invalid OTP" });
  }

  // Mark this email as verified temporarily
  otpStore.set(email, { verified: true });
  res.status(200).json({ message: "OTP verified successfully" });
};

// Helper for checking if email is verified
exports.isEmailVerified = (email) => {
  const record = otpStore.get(email);
  return record && record.verified === true;
};

// Clear OTP after some time or on demand
