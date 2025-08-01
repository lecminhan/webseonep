const express = require("express");
const router = express.Router();
const newsController = require("../controller/news.controller");

router.get("/", newsController.getAllNews);
router.get("/slug/:slug", newsController.getNewsContentBySlug);
router.get("/random", newsController.getRandomNews);
module.exports = router;
