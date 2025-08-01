const pool = require("../db");

// Lấy danh sách tất cả dự án
const getAllProjects = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM projects ORDER BY id DESC");
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching projects:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Lấy chi tiết dự án theo slug
const getProjectBySlug = async (req, res) => {
  const { slug } = req.params;
  try {
    const result = await pool.query("SELECT * FROM projects WHERE slug = $1", [slug]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Project not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error fetching project:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  getAllProjects,
  getProjectBySlug,
};
