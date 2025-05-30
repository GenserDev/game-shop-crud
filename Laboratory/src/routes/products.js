const express = require('express');
const router = express.Router();
const {
  getAllProducts,
  deleteProduct
} = require('../controllers/productController');

// Obtener todos los productos
router.get('/', getAllProducts);

// Eliminar un producto por ID
router.delete('/:id', deleteProduct);

module.exports = router;
