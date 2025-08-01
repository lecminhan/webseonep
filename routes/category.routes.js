// routes/product.routes.js
const express = require('express');
const router = express.Router();
const {
  getParentCategories,
  getChildCategories,
  getCategoryTreeWithProducts
} = require('../controller/category.controller');

router.get('/parent', getParentCategories);
router.get('/child/:parent_id', getChildCategories); 
router.get("/tree-with-products", getCategoryTreeWithProducts);
// 👈 thêm dòng này
module.exports = router;
