const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const productService = {
  // Obtener todos los productos con su categoría y marca
  async getAllProducts() {
    return await prisma.producto.findMany({
      include: {
        categoria: true,
        marca: true,
      },
    });
  },

  // Obtener un producto por ID
  async getProductById(id) {
    return await prisma.producto.findUnique({
      where: { id_producto: id },
      include: {
        categoria: true,
        marca: true,
        movimientos: true,
      },
    });
  },

  // Crear un nuevo producto
  async createProduct(data) {
    return await prisma.producto.create({
      data,
    });
  },

  // Actualizar un producto existente
  async updateProduct(id, data) {
    return await prisma.producto.update({
      where: { id_producto: id },
      data,
    });
  },

  // Eliminar un producto por ID
  async deleteProduct(id) {
  return await prisma.producto.update({
    where: { id_producto: id },
    data: { activo: false },
  });
},

  // Cambiar estado activo/inactivo
  async toggleActiveStatus(id, activo) {
    return await prisma.producto.update({
      where: { id_producto: id },
      data: { activo },
    });
  },
};

module.exports = productService;
