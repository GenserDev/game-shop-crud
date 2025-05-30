const productService = require('../services/productService');

const productController = {
  getAllProducts: async (req, res) => {
    try {
      const productos = await productService.getAllProducts();
      res.json(productos);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  getProductById: async (req, res) => {
    try {
      const producto = await productService.getProductById(parseInt(req.params.id));
      if (!producto) return res.status(404).json({ message: 'Producto no encontrado' });
      res.json(producto);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  createProduct: async (req, res) => {
    try {
      const nuevoProducto = await productService.createProduct(req.body);
      res.status(201).json(nuevoProducto);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  updateProduct: async (req, res) => {
    try {
      const actualizado = await productService.updateProduct(parseInt(req.params.id), req.body);
      if (!actualizado) return res.status(404).json({ message: 'Producto no encontrado para actualizar' });
      res.json(actualizado);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  toggleActiveStatus: async (req, res) => {
    try {
      const { activo } = req.body;
      const toggle = await productService.toggleActiveStatus(parseInt(req.params.id), activo);
      if (!toggle) return res.status(404).json({ message: 'Producto no encontrado para cambiar estado' });
      res.json(toggle);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  deleteProduct: async (req, res) => {
    try {
      const eliminado = await productService.deleteProduct(parseInt(req.params.id));
      if (!eliminado) return res.status(404).json({ message: 'Producto no encontrado para eliminar' });
      res.json({ message: 'Producto eliminado' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
};

module.exports = productController;
