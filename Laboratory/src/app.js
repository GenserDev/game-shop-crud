const express = require('express');
const app = express();

app.use(express.json());

// Cargar rutas
const productRoutes = require('./routes/products');
app.use('/api/productos', productRoutes);

module.exports = app;
