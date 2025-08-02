// routes/search.js
const express = require('express');
const router = express.Router();
const { searchProducts } = require('../controller/search.controller');

router.get('/', searchProducts);

module.exports = router;
