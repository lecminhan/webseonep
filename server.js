// server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const newsRoutes = require("./routes/news.routes");
const productRoutes = require('./routes/product.routes');
const categoryRoutes = require('./routes/category.routes');
const projectsRoute = require("./routes/projects.routes");
const searchRoute = require("./routes/search.routes");
const ContactsRoute = require( "./routes/contacts.routes")
const uploadRoute = require("./routes/upload.routes")
const app = express();
const path = require("path");
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/uploads", express.static("uploads"));
// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/projects", projectsRoute);
app.use("/api/search", searchRoute)
app.use("/api/contacts",ContactsRoute)
app.use("/api/uploads",uploadRoute)
// Default route
app.get('/', (req, res) => {
  res.send('API server is running');
});

// Start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
