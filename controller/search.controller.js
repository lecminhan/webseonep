const pool = require("../db");

const searchProducts = async (req, res) => {
  const query = req.query.q;

  if (!query) {
    return res.status(400).json({ message: "Thiếu từ khóa tìm kiếm" });
  }

  console.log("Tìm kiếm với từ khóa:", query);

  try {
    const sql = `
      SELECT 
        p.id, p.name, p.description, p.image_url, 
        c.name AS category, 
        pc.name AS parent_category
      FROM products p
      JOIN categories c ON p.category_id = c.id
      LEFT JOIN categories pc ON c.parent_id = pc.id
      WHERE p.name ILIKE $1 OR p.description ILIKE $1
    `;

    const values = [`%${query}%`];
    const result = await pool.query(sql, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy sản phẩm phù hợp." });
    }

    res.json(result.rows);
  } catch (error) {
    console.error("Lỗi tìm kiếm:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

module.exports = { searchProducts };
