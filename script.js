// Global Variables
let cart = JSON.parse(localStorage.getItem('cart')) || [];
const products = [
    {
        id: 1,
        name: "Eternity Diamond Ring",
        price: 2199,
        image: "diamondgrillz.jpg",
        category: "rings",
        description: "Beautiful eternity ring with brilliant cut diamonds"
    },
    {
        id: 2,
        name: "Princess Cut Earrings",
        price: 2599,
        image: "diamondearrings.jpg",
        category: "earrings",
        description: "Elegant princess cut diamond earrings"
    },
    {
        id: 3,
        name: "Royal Diamond Necklace",
        price: 3499,
        image: "diamondnecklace.jpg",
        category: "necklaces",
        description: "Stunning royal diamond pendant necklace"
    },
    {
        id: 4,
        name: "Infinity Diamond Bracelet",
        price: 1999,
        image: "diamondbracelet.jpg",
        category: "bracelets",
        description: "Delicate infinity diamond bracelet"
    },
    {
        id: 5,
        name: "Classic Diamond Studs",
        price: 1799,
        image: "diamondstuds.jpg",
        category: "earrings",
        description: "Timeless classic diamond stud earrings"
    },
    {
        id: 6,
        name: "Vintage Pearl Necklace",
        price: 2899,
        image: "pearlnecklace.jpg",
        category: "necklaces",
        description: "Elegant vintage pearl necklace with diamond accents"
    }
];

// Initialize the page when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initMobileMenu();
    initCart();
    initProductPages();
    updateCartCount();
    
    // Initialize specific page functionality
    if (document.querySelector('.products-grid')) {
        renderProducts(products);
        initFilters();
    }
    
    if (window.location.pathname.includes('cart.html')) {
        renderCartItems();
        initCartControls();
    }
});

// Mobile Menu Functionality
function initMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            this.innerHTML = navLinks.classList.contains('active') ? '✕' : '☰';
        });
        
        // Close menu when clicking on a link
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                mobileMenuBtn.innerHTML = '☰';
            });
        });
    }
}

// Cart Functionality
function initCart() {
    document.addEventListener('click', function(e) {
        // Add to cart
        if (e.target.classList.contains('add-to-cart')) {
            const productId = parseInt(e.target.dataset.id);
            addToCart(productId);
        }
        
        // Remove from cart
        if (e.target.classList.contains('remove-item')) {
            const productId = parseInt(e.target.dataset.id);
            removeFromCart(productId);
        }
        
        // Update quantity
        if (e.target.classList.contains('quantity-btn')) {
            const productId = parseInt(e.target.dataset.id);
            const action = e.target.dataset.action;
            updateQuantity(productId, action);
        }
    });
}

function initCartControls() {
    document.querySelector('.checkout-btn').addEventListener('click', function() {
        if (cart.length === 0) {
            showNotification('Your cart is empty!', 'error');
            return;
        }
        showNotification('Proceeding to checkout...', 'success');
        // In a real app, you would redirect to checkout page
    });
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    saveCart();
    updateCartCount();
    showNotification(`${product.name} added to cart!`, 'success');
    
    // Update cart page if we're on it
    if (window.location.pathname.includes('cart.html')) {
        renderCartItems();
    }
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartCount();
    renderCartItems();
    showNotification('Item removed from cart', 'info');
}

function updateQuantity(productId, action) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;
    
    if (action === 'increase') {
        item.quantity += 1;
    } else if (action === 'decrease' && item.quantity > 1) {
        item.quantity -= 1;
    }
    
    saveCart();
    updateCartCount();
    renderCartItems();
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    document.querySelectorAll('#cart-count').forEach(el => {
        el.textContent = count;
    });
}

// Product Page Functionality
function initProductPages() {
    // Product modal functionality
    document.addEventListener('click', function(e) {
        if (e.target.closest('.product-card')) {
            const productId = parseInt(e.target.closest('.product-card').dataset.id);
            showProductModal(productId);
        }
        
        if (e.target.classList.contains('close-modal')) {
            closeModal();
        }
    });
}

function showProductModal(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const modal = document.createElement('div');
    modal.className = 'product-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <div class="modal-image">
                <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="modal-info">
                <h2>${product.name}</h2>
                <p class="price">bwp${product.price.toLocaleString()}</p>
                <p class="description">${product.description}</p>
                <button class="btn add-to-cart" data-id="${product.id}">Add to Cart</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const modal = document.querySelector('.product-modal');
    if (modal) {
        modal.remove();
        document.body.style.overflow = 'auto';
    }
}

// Filtering and Sorting
function initFilters() {
    const categoryFilter = document.getElementById('category-filter');
    const priceFilter = document.getElementById('price-filter');
    const sortSelect = document.getElementById('sort-products');
    
    if (categoryFilter) {
        categoryFilter.addEventListener('change', applyFilters);
    }
    
    if (priceFilter) {
        priceFilter.addEventListener('change', applyFilters);
    }
    
    if (sortSelect) {
        sortSelect.addEventListener('change', applyFilters);
    }
}

function applyFilters() {
    const category = document.getElementById('category-filter')?.value || 'all';
    const price = document.getElementById('price-filter')?.value || 'all';
    const sort = document.getElementById('sort-products')?.value || 'default';
    
    let filtered = [...products];
    
    // Apply category filter
    if (category !== 'all') {
        filtered = filtered.filter(p => p.category === category);
    }
    
    // Apply price filter
    if (price !== 'all') {
        switch(price) {
            case 'low':
                filtered = filtered.filter(p => p.price < 2000);
                break;
            case 'medium':
                filtered = filtered.filter(p => p.price >= 2000 && p.price <= 3000);
                break;
            case 'high':
                filtered = filtered.filter(p => p.price > 3000);
                break;
        }
    }
    
    // Apply sorting
    switch(sort) {
        case 'price-low':
            filtered.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            filtered.sort((a, b) => b.price - a.price);
            break;
        case 'name-asc':
            filtered.sort((a, b) => a.name.localeCompare(b.name));
            break;
    }
    
    renderProducts(filtered);
}

// Rendering Functions
function renderProducts(productsToRender) {
    const productsGrid = document.querySelector('.products-grid');
    if (!productsGrid) return;
    
    productsGrid.innerHTML = productsToRender.map(product => `
        <div class="product-card" data-id="${product.id}">
            <img src="${product.image}" alt="${product.name}" loading="lazy">
            <div class="product-info">
                <h3>${product.name}</h3>
                <span class="product-price">bwp${product.price.toLocaleString()}</span>
                <button class="btn add-to-cart" data-id="${product.id}">Add to Cart</button>
            </div>
        </div>
    `).join('');
}

function renderCartItems() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');
    
    if (!cartItemsContainer) return;
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
        cartTotalElement.textContent = 'bwp0.00';
        return;
    }
    
    cartItemsContainer.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-info">
                <div class="cart-item-title">${item.name}</div>
                <div class="cart-item-price">bwp${item.price.toLocaleString()}</div>
                <div class="quantity-controls">
                    <button class="quantity-btn" data-id="${item.id}" data-action="decrease">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-btn" data-id="${item.id}" data-action="increase">+</button>
                </div>
                <button class="remove-item" data-id="${item.id}">Remove</button>
            </div>
        </div>
    `).join('');
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotalElement.textContent = `bwp${total.toLocaleString()}`;
}

// Notification System
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <span class="notification-close">&times;</span>
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remove after 3 seconds
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
    
    // Manual close
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.remove();
    });
}