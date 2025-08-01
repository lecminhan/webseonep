const { Pool } = require('pg');
require('dotenv').config();

// Tạo pool kết nối - sẽ tự đọc PGHOST, PGUSER, PGPASSWORD, PGDATABASE, PGPORT từ .env
const pool = new Pool();

// Kiểm tra kết nối khi app khởi động
pool.query('SELECT NOW()')
  .then(() => console.log("✅ Kết nối PostgreSQL thành công"))
  .catch(err => console.error("❌ Kết nối thất bại:", err.message));

module.exports = pool;
