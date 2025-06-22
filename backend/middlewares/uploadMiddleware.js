const multer = require("multer");
const path = require("path");

// ✅ Configure local temp storage for Cloudinary
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads/"); // Ensure this exists or handle dynamically
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, ext).replace(/\s+/g, '-');
    const uniqueName = `${Date.now()}-${baseName}${ext}`;
    cb(null, uniqueName);
  },
});

// ✅ Filter only images
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("❌ Only JPEG, PNG, JPG, and WEBP image files are allowed."), false);
  }
};

// ✅ Create the upload middleware
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
});

module.exports = upload;
