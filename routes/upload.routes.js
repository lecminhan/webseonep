const express = require("express");
const router = express.Router();
const { upload, uploadImage } = require("../controller/upload.controller");

router.post("/", upload.single("image"), uploadImage);

module.exports = router;
