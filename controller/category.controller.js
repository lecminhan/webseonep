const db = require('../db');
const getParentCategories = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM categories WHERE parent_id IS NULL ORDER BY id ASC; ');
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Lỗi lấy danh mục cha:', err);
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
};
// GET /api/categories/child/:parent_id → lấy danh mục con theo parent_id
const getChildCategories = async (req, res) => {
  const { parent_id } = req.params;

  try {
    const result = await db.query(
      `
     SELECT
  child.id,
  child.name,
  child.slug,
  child.parent_id,
  child.image_url,
  child.description,
  parent.slug AS parent_slug
FROM categories AS child
JOIN categories AS parent ON child.parent_id = parent.id
WHERE child.parent_id = $1
ORDER BY child.id ASC;

      `,
      [parent_id]
    );

    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Lỗi lấy danh mục con:', err);
    res.status(500).json({ message: 'Lỗi server', error: err.message });
  }
};

const getChildCategoriesOnly = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        c.id, 
        c.name, 
        c.slug, 
        c.parent_id, 
        c.image_url, 
        c.description 
      FROM categories c
      WHERE c.parent_id IS NOT NULL
    `);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Lỗi lấy danh mục con:", err);
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};
const getCategoryTreeWithProducts = async (req, res) => {
  try {
    // 1. Lấy danh mục cha, sắp xếp theo id
    const parentCategoriesRes = await db.query(
      `SELECT id, name, slug, image_url, description 
       FROM categories 
       WHERE parent_id IS NULL
       ORDER BY id ASC`
    );
    const parentCategories = parentCategoriesRes.rows;

    // 2. Duyệt từng danh mục cha
    for (const parent of parentCategories) {
      // 2.1 Lấy danh mục con theo id
      const childRes = await db.query(
        `SELECT id, name, slug, image_url, description 
         FROM categories 
         WHERE parent_id = $1
         ORDER BY id ASC`,
        [parent.id]
      );
      const childCategories = childRes.rows;

      // 2.2 Lấy sản phẩm của từng danh mục con theo id
      for (const child of childCategories) {
        const productRes = await db.query(
          `SELECT id, name, slug, image_url, description 
           FROM products 
           WHERE category_id = $1
           ORDER BY id ASC`,
          [child.id]
        );
        child.products = productRes.rows;
      }

      // 2.3 Gắn danh mục con vào danh mục cha
      parent.children = childCategories;
    }

    res.status(200).json(parentCategories);
  } catch (err) {
    console.error("Lỗi lấy cây danh mục và sản phẩm:", err);
    res.status(500).json({ message: "Lỗi server", error: err.message });
  }
};


module.exports = {
  getParentCategories,
getChildCategories ,
getChildCategoriesOnly,
getCategoryTreeWithProducts
};