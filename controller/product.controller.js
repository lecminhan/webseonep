const db = require('../db');

const getAllProducts = async (req, res) => {
  try {
    const query = `
      SELECT 
        p.*,
        c.name AS category_name,
        c.slug AS category_slug
      FROM products p 
      LEFT JOIN categories c ON p.category_id = c.id
      ORDER BY p.created_at DESC
    `;
    
    const result = await db.query(query);
    
    res.status(200).json({
      success: true,
      total: result.rowCount,
      data: result.rows
    });
  } catch (error) {
    console.error("Lỗi:", error);
    res.status(500).json({
      success: false,
      message: "Lỗi server",
      error: error.message
    });
  }
};
const getProductsByCategorySlug = async (req, res) => {
  const { slug } = req.params;
  try {
    // 1. Lấy thông tin danh mục gốc theo slug
    const categoryResult = await db.query(
      `SELECT id, name, parent_id FROM categories WHERE slug = $1`,
      [slug]
    );

    if (categoryResult.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Không tìm thấy danh mục" });
    }

    const category = categoryResult.rows[0];

    // 2. Truy vấn cây danh mục con (sản phẩm)
    const productQuery = `
      WITH RECURSIVE category_tree AS (
        SELECT id FROM categories WHERE slug = $1
        UNION
        SELECT c.id
        FROM categories c
        INNER JOIN category_tree ct ON c.parent_id = ct.id
      )
      SELECT p.*
      FROM products p
      WHERE p.category_id IN (SELECT id FROM category_tree)
      ORDER BY p.created_at DESC
    `;

    const productResult = await db.query(productQuery, [slug]);

    // 3. Truy vấn cây danh mục cha (breadcrumb)
    const breadcrumbQuery = `
      WITH RECURSIVE breadcrumb AS (
        SELECT id, name, slug, parent_id
        FROM categories
        WHERE slug = $1
        UNION ALL
        SELECT c.id, c.name, c.slug, c.parent_id
        FROM categories c
        INNER JOIN breadcrumb b ON c.id = b.parent_id
      )
      SELECT * FROM breadcrumb;
    `;

    const breadcrumbResult = await db.query(breadcrumbQuery, [slug]);
    const breadcrumb = breadcrumbResult.rows.reverse(); // từ gốc → đến danh mục hiện tại

    // 4. Trả về kết quả
    res.json({
      success: true,
      products: productResult.rows,
      category_breadcrumb: breadcrumb
    });

  } catch (error) {
    console.error('Lỗi:', error);
    res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
  }
};

const getProductBySlug = async (req, res) => {
  const { slug } = req.params;

  try {
    const result = await db.query(
      `SELECT p.*, c.name AS category_name
       FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       WHERE p.slug = $1`,
      [slug]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
    }

    res.json({
      success: true,
      product: result.rows[0]
    });
  } catch (error) {
    console.error('Lỗi:', error);
    res.status(500).json({ success: false, message: 'Lỗi server', error: error.message });
  }
};
const createProduct = async (req, res) => {
  const { name, slug, description, image_url, category_id, created_at } = req.body;

  // Validate input
  if (!name || !slug || !category_id) {
    return res.status(400).json({ message: "Vui lòng nhập đủ name, slug và category_id" });
  }

  try {
    const query = `
      INSERT INTO products (name, slug, description, image_url, category_id, created_at)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;

    const values = [
      name,
      slug,
      description || null,
      image_url || null,
      category_id,
      created_at || new Date()
    ];

    const result = await db.query(query, values);

    res.status(201).json({
      message: "Thêm sản phẩm thành công",
      product: result.rows[0]
    });
  } catch (err) {
    console.error("Lỗi thêm sản phẩm:", err);
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};
const getLongDescriptionsByProductId = async (req, res) => {
  const { productId } = req.params;

  try {
    const result = await db.query(
      `SELECT id, paragraph_title, paragraph_text, image_url
       FROM product_long_descriptions
       WHERE product_id = $1
       ORDER BY id ASC`,
      [productId]
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Lỗi khi lấy mô tả dài:", error);
    res.status(500).json({ error: "Đã xảy ra lỗi khi truy vấn dữ liệu." });
  }
};
module.exports = {
  getAllProducts,
  getProductsByCategorySlug, 
  getProductBySlug,
  createProduct,
  getLongDescriptionsByProductId
};
