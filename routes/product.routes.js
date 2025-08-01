const express = require('express');
const router = express.Router();
const { getAllProducts ,getProductsByCategorySlug,getProductBySlug, createProduct,getLongDescriptionsByProductId } = require('../controller/product.controller');

router.get('/', getAllProducts);
router.get('/category/:slug',getProductsByCategorySlug )
router.get('/product/:slug',getProductBySlug)
router.post('/', createProduct);
router.get("/:productId/long-description", getLongDescriptionsByProductId);
module.exports = router;
