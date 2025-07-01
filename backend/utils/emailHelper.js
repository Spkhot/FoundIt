const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail", // or use your SMTP provider
  auth: {
    user: process.env.EMAIL_USER,   // your Gmail or SMTP email
    pass: process.env.EMAIL_PASS    // your app password (not Gmail password)
  }
});

exports.sendVerificationEmail = async (email, itemId, token) => {
  const verificationLink = `https://foundit-imky.onrender.com/${itemId}/${token}`;

  const mailOptions = {
    from: `"FoundIt Hub" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Verify Your Item Submission - FoundIt Hub",
    html: `
      <div style="font-family:Arial, sans-serif; padding:20px;">
        <h2 style="color:#4f46e5;">🔐 Verify Your Email</h2>
        <p>Thanks for posting an item on FoundIt Hub.</p>
        <p>To confirm your post, please click the button below:</p>
        <a href="${verificationLink}" style="display:inline-block; background:#4f46e5; color:#fff; padding:10px 20px; text-decoration:none; border-radius:6px;">Verify Now</a>
        <p style="margin-top:20px; font-size:14px; color:gray;">If you didn’t make this request, please ignore this email.</p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("✅ Verification email sent to:", email);
  } catch (error) {
    console.error("❌ Email send failed:", error);
    throw new Error("Email could not be sent.");
  }
};
