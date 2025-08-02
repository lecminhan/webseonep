const db = require('../db'); // file db.js đã thiết lập pool kết nối PostgreSQL


const createContact = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Vui lòng nhập đầy đủ họ tên, email và nội dung.' });
    }

    const query = `
      INSERT INTO contacts (name, email, phone, message)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;

    const values = [name, email, phone || '', message];

    const result = await db.query(query, values);

    res.status(201).json({
      message: 'Gửi liên hệ thành công!',
      contact: result.rows[0],
    });
  } catch (err) {
    console.error('Lỗi khi thêm liên hệ:', err);
    res.status(500).json({ error: 'Đã xảy ra lỗi phía máy chủ.' });
  }
};

module.exports = {
  createContact,
};
