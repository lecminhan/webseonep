const multer = require("multer");
const path = require("path");

// Cấu hình multer: giữ nguyên tên ảnh gốc
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "/var/www/uploads"); // Thư mục lưu file
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // Giữ nguyên tên file
  },
});

const upload = multer({ storage });

const uploadImage = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded." });
  }

  return res.status(200).json({
    message: "Upload thành công",
    filename: req.file.originalname,
    path: `/uploads/${req.file.originalname}`,
  });
};

module.exports = {
  upload,
  uploadImage,
};
