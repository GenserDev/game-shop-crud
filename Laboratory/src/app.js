const express = require('express');
const cors = require('cors'); 
const app = express();

app.use(cors()); 
app.use(express.json());

// Cargar rutas
const productRoutes = require('./routes/products');
app.use('/api/products', productRoutes); 

module.exports = app;
