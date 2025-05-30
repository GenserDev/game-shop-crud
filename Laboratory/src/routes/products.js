const express = require('express');
const router = express.Router();

const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  toggleActiveStatus,
  deleteProduct
} = require('../controllers/productController');

// Obtener todos los productos
router.get('/', getAllProducts);

// Obtener un producto por ID
router.get('/:id', getProductById);

// Crear un nuevo producto
router.post('/', createProduct);

// Actualizar un producto existente
router.put('/:id', updateProduct);

// Cambiar el estado activo/inactivo de un producto
router.patch('/:id/activo', toggleActiveStatus);

// Eliminar (marcar como inactivo) un producto por ID
router.delete('/:id', deleteProduct);

module.exports = router;
