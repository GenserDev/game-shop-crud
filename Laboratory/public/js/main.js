// Gaming Store JavaScript
const API_BASE_URL = 'http://localhost:3000/api/products';

// Global variables
let products = [];
let categories = [];
let brands = [];
let isEditing = false;
let editingProductId = null;
let deleteProductId = null;

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    loadProducts().then(() => {
        loadCategories();
        loadBrands();
    });
    setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
    // Form submission
    document.getElementById('product-form').addEventListener('submit', handleFormSubmit);
    
    // Modal close events
    window.addEventListener('click', function(event) {
        const productModal = document.getElementById('product-modal');
        const confirmModal = document.getElementById('confirm-modal');
        
        if (event.target === productModal) {
            closeProductModal();
        }
        if (event.target === confirmModal) {
            closeConfirmModal();
        }
    });
}

// API Functions
async function loadProducts() {
    try {
        showLoading(true);
        const response = await fetch(API_BASE_URL);
        if (!response.ok) throw new Error('Error al cargar productos');
        
        products = await response.json();
        renderProducts(products);
        updateStats();
        showLoading(false);
    } catch (error) {
        console.error('Error:', error);
        showToast('Error al cargar los productos', 'error');
        showLoading(false);
        showEmptyState(true);
    }
}

async function loadCategories() {
    try {
        // Extraer categorías únicas de los productos cargados
        const uniqueCategories = [...new Set(products.map(p => p.categoria?.nombre).filter(Boolean))];
        categories = uniqueCategories.map((name, index) => ({ 
            id_categoria: index + 1, 
            nombre: name 
        }));
        
        populateSelect('id_categoria', categories, 'id_categoria', 'nombre');
        populateSelect('filter-category', categories, 'nombre', 'nombre');
    } catch (error) {
        console.error('Error:', error);
        showToast('Error al cargar categorías', 'error');
    }
}

async function loadBrands() {
    try {
        // Extraer marcas únicas de los productos cargados
        const uniqueBrands = [...new Set(products.map(p => p.marca?.nombre).filter(Boolean))];
        brands = uniqueBrands.map((name, index) => ({ 
            id_marca: index + 1, 
            nombre: name 
        }));
        
        populateSelect('id_marca', brands, 'id_marca', 'nombre');
    } catch (error) {
        console.error('Error:', error);
        showToast('Error al cargar marcas', 'error');
    }
}

async function createProduct(productData) {
    try {
        const response = await fetch(API_BASE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(productData)
        });
        
        if (!response.ok) throw new Error('Error al crear producto');
        
        const newProduct = await response.json();
        showToast('Producto creado exitosamente', 'success');
        loadProducts(); // Reload products
        return newProduct;
    } catch (error) {
        console.error('Error:', error);
        showToast('Error al crear el producto', 'error');
        throw error;
    }
}

async function updateProduct(id, productData) {
    try {
        const response = await fetch(`${API_BASE_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(productData)
        });
        
        if (!response.ok) throw new Error('Error al actualizar producto');
        
        const updatedProduct = await response.json();
        showToast('Producto actualizado exitosamente', 'success');
        loadProducts(); // Reload products
        return updatedProduct;
    } catch (error) {
        console.error('Error:', error);
        showToast('Error al actualizar el producto', 'error');
        throw error;
    }
}

async function deleteProduct(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/${id}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) throw new Error('Error al eliminar producto');
        
        showToast('Producto eliminado exitosamente', 'success');
        loadProducts(); // Reload products
    } catch (error) {
        console.error('Error:', error);
        showToast('Error al eliminar el producto', 'error');
        throw error;
    }
}

async function toggleProductStatus(id, activo) {
    try {
        const response = await fetch(`${API_BASE_URL}/${id}/activo`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ activo })
        });
        
        if (!response.ok) throw new Error('Error al cambiar estado');
        
        showToast(`Producto ${activo ? 'activado' : 'desactivado'} exitosamente`, 'success');
        loadProducts(); // Reload products
    } catch (error) {
        console.error('Error:', error);
        showToast('Error al cambiar el estado del producto', 'error');
        throw error;
    }
}

// UI Functions
function renderProducts(productsToRender) {
    const tbody = document.getElementById('products-tbody');
    
    if (!productsToRender || productsToRender.length === 0) {
        showEmptyState(true);
        tbody.innerHTML = '';
        return;
    }
    
    showEmptyState(false);
    
    tbody.innerHTML = productsToRender.map(product => `
        <tr>
            <td>${product.id_producto}</td>
            <td>
                <div>
                    <strong>${product.nombre}</strong>
                    ${product.descripcion ? `<br><small>${product.descripcion}</small>` : ''}
                </div>
            </td>
            <td>${product.categoria?.nombre || 'Sin categoría'}</td>
            <td>${product.marca?.nombre || 'Sin marca'}</td>
            <td>${parseFloat(product.precio).toFixed(2)}</td>
            <td>
                <span class="${product.stock <= product.stock_minimo ? 'stock-low' : 'stock-normal'}">
                    ${product.stock}
                    ${product.stock <= product.stock_minimo ? ' ⚠️' : ''}
                </span>
            </td>
            <td>
                <span class="status-badge ${product.activo ? 'status-active' : 'status-inactive'}">
                    ${product.activo ? 'Activo' : 'Inactivo'}
                </span>
            </td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-small btn-secondary" onclick="editProduct(${product.id_producto})" title="Editar">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-small ${product.activo ? 'btn-secondary' : 'btn-primary'}" 
                            onclick="toggleStatus(${product.id_producto}, ${!product.activo})" 
                            title="${product.activo ? 'Desactivar' : 'Activar'}">
                        <i class="fas fa-${product.activo ? 'eye-slash' : 'eye'}"></i>
                    </button>
                    <button class="btn btn-small btn-danger" onclick="confirmDeleteProduct(${product.id_producto})" title="Eliminar">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

function updateStats() {
    const totalProducts = products.length;
    const totalStock = products.reduce((sum, product) => sum + parseInt(product.stock), 0);
    
    document.getElementById('total-products').textContent = totalProducts;
    document.getElementById('total-stock').textContent = totalStock;
}

function populateSelect(selectId, items, valueKey, textKey) {
    const select = document.getElementById(selectId);
    if (!select) return;
    
    // Keep existing options if it's a filter select
    const isFilter = selectId.includes('filter');
    if (!isFilter) {
        // Clear existing options except the first one
        const firstOption = select.querySelector('option');
        select.innerHTML = '';
        if (firstOption) select.appendChild(firstOption);
    }
    
    items.forEach(item => {
        const option = document.createElement('option');
        option.value = item[valueKey];
        option.textContent = item[textKey];
        select.appendChild(option);
    });
}

function showLoading(show) {
    const loading = document.getElementById('loading');
    const tableContainer = document.querySelector('.table-container');
    
    if (loading) loading.style.display = show ? 'block' : 'none';
    if (tableContainer) tableContainer.style.display = show ? 'none' : 'block';
}

function showEmptyState(show) {
    const emptyState = document.getElementById('empty-state');
    const tableContainer = document.querySelector('.table-container');
    
    if (emptyState) emptyState.style.display = show ? 'block' : 'none';
    if (tableContainer) tableContainer.style.display = show ? 'none' : 'block';
}

function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
        ${message}
    `;
    
    container.appendChild(toast);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        if (toast.parentNode) {
            toast.parentNode.removeChild(toast);
        }
    }, 3000);
}

// Modal Functions
function openProductModal(productId = null) {
    const modal = document.getElementById('product-modal');
    const title = document.getElementById('modal-title');
    const submitText = document.getElementById('submit-text');
    
    isEditing = !!productId;
    editingProductId = productId;
    
    if (isEditing) {
        title.textContent = 'Editar Producto';
        submitText.textContent = 'Actualizar';
        loadProductForEdit(productId);
    } else {
        title.textContent = 'Agregar Producto';
        submitText.textContent = 'Guardar';
        document.getElementById('product-form').reset();
        document.getElementById('activo').checked = true;
    }
    
    modal.style.display = 'block';
}

function closeProductModal() {
    const modal = document.getElementById('product-modal');
    modal.style.display = 'none';
    document.getElementById('product-form').reset();
    isEditing = false;
    editingProductId = null;
}

function loadProductForEdit(productId) {
    const product = products.find(p => p.id_producto == productId);
    if (!product) return;
    
    document.getElementById('nombre').value = product.nombre || '';
    document.getElementById('descripcion').value = product.descripcion || '';
    document.getElementById('id_categoria').value = product.id_categoria || '';
    document.getElementById('id_marca').value = product.id_marca || '';
    document.getElementById('precio').value = product.precio || '';
    document.getElementById('stock').value = product.stock || '';
    document.getElementById('stock_minimo').value = product.stock_minimo || '';
    document.getElementById('codigo_barras').value = product.codigo_barras || '';
    document.getElementById('sku').value = product.sku || '';
    document.getElementById('activo').checked = product.activo;
}

function confirmDeleteProduct(productId) {
    deleteProductId = productId;
    document.getElementById('confirm-modal').style.display = 'block';
}

function closeConfirmModal() {
    document.getElementById('confirm-modal').style.display = 'none';
    deleteProductId = null;
}

function confirmDelete() {
    if (deleteProductId) {
        deleteProduct(deleteProductId);
        closeConfirmModal();
    }
}

// Event Handlers
function editProduct(productId) {
    openProductModal(productId);
}

function toggleStatus(productId, newStatus) {
    toggleProductStatus(productId, newStatus);
}

async function handleFormSubmit(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const productData = {
        nombre: formData.get('nombre'),
        descripcion: formData.get('descripcion') || null,
        id_categoria: parseInt(formData.get('id_categoria')),
        id_marca: formData.get('id_marca') ? parseInt(formData.get('id_marca')) : null,
        precio: parseFloat(formData.get('precio')),
        stock: parseInt(formData.get('stock')),
        stock_minimo: parseInt(formData.get('stock_minimo')) || 5,
        codigo_barras: formData.get('codigo_barras') || null,
        sku: formData.get('sku') || null,
        activo: formData.has('activo')
    };
    
    try {
        if (isEditing) {
            await updateProduct(editingProductId, productData);
        } else {
            await createProduct(productData);
        }
        closeProductModal();
    } catch (error) {
    }
}

// Search and Filter Functions
function searchProducts() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const filteredProducts = products.filter(product => 
        product.nombre.toLowerCase().includes(searchTerm) ||
        (product.descripcion && product.descripcion.toLowerCase().includes(searchTerm)) ||
        (product.categoria?.nombre && product.categoria.nombre.toLowerCase().includes(searchTerm)) ||
        (product.marca?.nombre && product.marca.nombre.toLowerCase().includes(searchTerm))
    );
    renderProducts(filteredProducts);
}

function filterProducts() {
    const categoryFilter = document.getElementById('filter-category').value;
    let filteredProducts = products;
    
    if (categoryFilter) {
        filteredProducts = products.filter(product => 
            product.categoria?.nombre === categoryFilter
        );
    }
    
    renderProducts(filteredProducts);
}

// Error handling for network issues
window.addEventListener('online', function() {
    showToast('Conexión restaurada', 'success');
    loadProducts();
});

window.addEventListener('offline', function() {
    showToast('Sin conexión a internet', 'error');
});

// Initialize with sample data if API fails
function initWithSampleData() {
    const sampleCategories = [
        { id_categoria: 1, nombre: 'Teclados' },
        { id_categoria: 2, nombre: 'Ratones' },
        { id_categoria: 3, nombre: 'Monitores' },
        { id_categoria: 4, nombre: 'Sillas Gaming' },
        { id_categoria: 5, nombre: 'Videojuegos' }
    ];
    
    const sampleBrands = [
        { id_marca: 1, nombre: 'Razer' },
        { id_marca: 2, nombre: 'Logitech' },
        { id_marca: 3, nombre: 'Corsair' },
        { id_marca: 4, nombre: 'SteelSeries' },
        { id_marca: 5, nombre: 'HyperX' }
    ];
    
    categories = sampleCategories;
    brands = sampleBrands;
    
    populateSelect('id_categoria', categories, 'id_categoria', 'nombre');
    populateSelect('id_marca', brands, 'id_marca', 'nombre');
    populateSelect('filter-category', categories, 'nombre', 'nombre');
}
