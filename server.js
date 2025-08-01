// server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const newsRoutes = require("./routes/news.routes");
const productRoutes = require('./routes/product.routes');
const categoryRoutes = require('./routes/category.routes');
const projectsRoute = require("./routes/projects.routes");
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/projects", projectsRoute);
// Default route
app.get('/', (req, res) => {
  res.send('API server is running');
});

// Start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
