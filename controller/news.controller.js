const pool = require("../db");

// Lấy tất cả tin tức, sắp xếp theo thời gian mới nhất
const getAllNews = async (req, res) => {
  try {
    const { rows: news } = await pool.query(`
      SELECT id, title, slug, description, image_url, published_at 
      FROM news 
      ORDER BY published_at DESC
    `);

    res.status(200).json(news);
  } catch (error) {
    console.error("[GET /api/news] Error:", error.message);
    res.status(500).json({ message: "Failed to fetch news." });
  }
};
const getNewsContentBySlug = async (req, res) => {
  const { slug } = req.params;

  try {
    const query = `
      SELECT 
        n.id AS news_id,
        n.slug,
        n.title,
        nc.id AS content_id,
        nc.paragraph_title,
        nc.paragraph_text,
        nc.image_url,
        nc.position
      FROM news n
      LEFT JOIN news_content nc ON n.id = nc.news_id
      WHERE n.slug = $1
      ORDER BY nc.position ASC;
    `;

    const { rows } = await pool.query(query, [slug]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Không tìm thấy bài viết với slug này." });
    }

    const { news_id, title } = rows[0];

    const content = rows.map((row) => ({
      content_id: row.content_id,
      paragraph_title: row.paragraph_title,
      paragraph_text: row.paragraph_text,
      image_url: row.image_url,
      position: row.position,
    }));

    res.json({
      news_id,
      slug,
      title,
      content,
    });
  } catch (error) {
    console.error("Lỗi khi lấy nội dung bài viết theo slug:", error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

const getRandomNews = async (req, res) => {
  try {
    const query = `
      SELECT * FROM news
      ORDER BY RANDOM()
      LIMIT 4;
    `;
    const { rows } = await pool.query(query);
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching random news:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getAllNews,
  getNewsContentBySlug,
  getRandomNews
};
