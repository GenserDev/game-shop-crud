const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Categorías
  await prisma.categoria.createMany({
    data: [
      { nombre: 'Videojuegos', descripcion: 'Juegos para diferentes plataformas' },
      { nombre: 'Sillas Gaming', descripcion: 'Sillas ergonómicas para gamers' },
      { nombre: 'Teclados', descripcion: 'Teclados mecánicos y gaming' },
      { nombre: 'Mouse', descripcion: 'Ratones gaming de alta precisión' },
      { nombre: 'PC Gaming', descripcion: 'Computadoras armadas para gaming' },
      { nombre: 'Audífonos', descripcion: 'Audífonos gaming con micrófono' },
      { nombre: 'Monitores', descripcion: 'Pantallas gaming de alta frecuencia' },
      { nombre: 'Accesorios', descripcion: 'Otros accesorios gaming' },
    ]
  });

  // Marcas
  await prisma.marca.createMany({
    data: [
      { nombre: 'Razer', pais_origen: 'Singapur' },
      { nombre: 'Logitech', pais_origen: 'Suiza' },
      { nombre: 'Corsair', pais_origen: 'Estados Unidos' },
      { nombre: 'SteelSeries', pais_origen: 'Dinamarca' },
      { nombre: 'HyperX', pais_origen: 'Estados Unidos' },
      { nombre: 'ASUS', pais_origen: 'Taiwan' },
      { nombre: 'MSI', pais_origen: 'Taiwan' },
      { nombre: 'Sony', pais_origen: 'Japón' },
      { nombre: 'Microsoft', pais_origen: 'Estados Unidos' },
      { nombre: 'Nintendo', pais_origen: 'Japón' },
    ]
  });

  // Productos
  await prisma.producto.createMany({
    data: [
      {
        nombre: 'The Last of Us Part II',
        descripcion: 'Juego de aventura y supervivencia para PS4',
        id_categoria: 1,
        id_marca: 8,
        precio: 59.99,
        stock: 25,
        stock_minimo: 5,
        sku: 'TLOU2-PS4-001'
      },
      {
        nombre: 'Silla Gaming DXRacer',
        descripcion: 'Silla ergonómica con soporte lumbar',
        id_categoria: 2,
        precio: 299.99,
        stock: 8,
        stock_minimo: 2,
        sku: 'SILLA-DXR-001'
      },
      {
        nombre: 'Teclado Razer BlackWidow V3',
        descripcion: 'Teclado mecánico RGB con switches Green',
        id_categoria: 3,
        id_marca: 1,
        precio: 139.99,
        stock: 15,
        stock_minimo: 3,
        sku: 'KEYB-RZR-001'
      },
      {
        nombre: 'Mouse Logitech G502 Hero',
        descripcion: 'Mouse gaming con sensor HERO 25K',
        id_categoria: 4,
        id_marca: 2,
        precio: 79.99,
        stock: 20,
        stock_minimo: 5,
        sku: 'MOUSE-LOG-001'
      },
      {
        nombre: 'PC Gaming RTX 3070',
        descripcion: 'PC armada con RTX 3070 y Ryzen 7',
        id_categoria: 5,
        precio: 1299.99,
        stock: 3,
        stock_minimo: 1,
        sku: 'PC-RTX3070-001'
      },
      {
        nombre: 'Audífonos HyperX Cloud II',
        descripcion: 'Audífonos gaming con micrófono USB',
        id_categoria: 6,
        id_marca: 5,
        precio: 99.99,
        stock: 12,
        stock_minimo: 3,
        sku: 'AUD-HYP-001'
      },
      {
        nombre: 'Monitor ASUS TUF 144Hz',
        descripcion: 'Monitor gaming 24" 144Hz 1ms',
        id_categoria: 7,
        id_marca: 6,
        precio: 199.99,
        stock: 6,
        stock_minimo: 2,
        sku: 'MON-ASUS-001'
      },
      {
        nombre: 'Xbox Wireless Controller',
        descripcion: 'Control inalámbrico para Xbox y PC',
        id_categoria: 8,
        id_marca: 9,
        precio: 59.99,
        stock: 18,
        stock_minimo: 5,
        sku: 'CTRL-XBOX-001'
      },
    ]
  });

  // Movimientos de inventario
  await prisma.movimientoInventario.createMany({
    data: [
      { id_producto: 1, tipo_movimiento: 'ENTRADA', cantidad: 10, motivo: 'Reposición', usuario: 'admin' },
      { id_producto: 2, tipo_movimiento: 'SALIDA', cantidad: 2, motivo: 'Venta', usuario: 'vendedor1' },
      { id_producto: 3, tipo_movimiento: 'ENTRADA', cantidad: 5, motivo: 'Nuevo lote', usuario: 'admin' },
      { id_producto: 4, tipo_movimiento: 'SALIDA', cantidad: 1, motivo: 'Demostración', usuario: 'vendedor2' },
      { id_producto: 5, tipo_movimiento: 'ENTRADA', cantidad: 1, motivo: 'Reabastecimiento', usuario: 'admin' },
      { id_producto: 6, tipo_movimiento: 'SALIDA', cantidad: 3, motivo: 'Venta online', usuario: 'vendedor3' },
    ]
  });

  console.log('✅ Datos sembrados correctamente');
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error('❌ Error en el seeding:', e);
    prisma.$disconnect();
    process.exit(1);
  });