// ============================================
// PART 1 OF 2 - COPY THIS FIRST
// NO FIREBASE - SIMPLE localStorage SYSTEM
// ============================================

// Initialize AOS
AOS.init({ duration: 800, once: true });

// Global State
let currentUser = null;
let allUsers = JSON.parse(localStorage.getItem('allUsers')) || [];
let cart = [];
let notifications = [];
let allPayments = JSON.parse(localStorage.getItem('allPayments')) || [];

// Products Data
const products = [
    { id: 1, name: "E-Commerce Website Template", category: "websites", price: 149, image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80", description: "Professional e-commerce template", rating: 4.8, reviews: 124, featured: true, features: ["Responsive Design", "Shopping Cart", "Payment Integration"], downloadLink: "https://example.com/download/ecommerce" },
    { id: 2, name: "Mobile Banking App", category: "apps", price: 199, image: "https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?w=800&q=80", description: "Secure mobile banking", rating: 4.9, reviews: 89, featured: true, features: ["Secure Auth", "Transactions", "Budget Tracking"], downloadLink: "https://example.com/download/banking" },
    { id: 3, name: "Payment Gateway API", category: "apis", price: 129, image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80", description: "Robust payment API", rating: 4.7, reviews: 156, featured: true, features: ["Multiple Methods", "Secure", "Webhooks"], downloadLink: "https://example.com/download/payment" },
    { id: 4, name: "AI Content Generator", category: "ai-tools", price: 179, image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80", description: "AI-powered content", rating: 4.9, reviews: 203, featured: true, features: ["Multiple Types", "SEO", "Languages"], downloadLink: "https://example.com/download/ai" },
    { id: 5, name: "Web Development Course", category: "courses", price: 99, image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80", description: "Complete bootcamp", rating: 4.8, reviews: 412, featured: true, features: ["50+ Hours", "Projects", "Certificate"], downloadLink: "https://example.com/download/course" },
    { id: 6, name: "WordPress SEO Plugin", category: "plugins", price: 89, image: "https://images.unsplash.com/photo-1432888622747-4eb9a8f2c293?w=800&q=80", description: "Advanced SEO plugin", rating: 4.6, reviews: 278, featured: true, features: ["On-Page SEO", "Schema", "Sitemaps"], downloadLink: "https://example.com/download/seo" }
];

// Copy to Clipboard
window.copyToClipboard = function(text) {
    navigator.clipboard.writeText(text).then(() => alert('Copied!')).catch(() => alert('Copy: ' + text));
};

// ============================================
// AUTHENTICATION
// ============================================

function checkAuth() {
    const saved = localStorage.getItem('currentUser');
    if (saved) {
        currentUser = JSON.parse(saved);
        showMainWebsite();
        loadUserData();
    } else {
        showLoginPage();
    }
}

function loadUserData() {
    if (currentUser) {
        cart = currentUser.cart || [];
        notifications = currentUser.notifications || [];
        updateCartUI();
        updateNotificationUI();
        updateUIForUser();
    }
}

function saveCurrentUser() {
    if (currentUser) {
        currentUser.cart = cart;
        currentUser.notifications = notifications;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        const index = allUsers.findIndex(u => u.email === currentUser.email);
        if (index !== -1) {
            allUsers[index] = currentUser;
            localStorage.setItem('allUsers', JSON.stringify(allUsers));
        }
    }
}

// Register
document.getElementById('registerForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('registerName').value.trim();
    const email = document.getElementById('registerEmail').value.trim().toLowerCase();
    const password = document.getElementById('registerPassword').value;
    const accountType = document.getElementById('accountType').value;
    
    if (allUsers.find(u => u.email === email)) {
        alert('Email already registered!');
        return;
    }
    
    const newUser = {
        name, email, password, accountType,
        isAdmin: false, cart: [], notifications: [], payments: [],
        createdAt: Date.now()
    };
    
    allUsers.push(newUser);
    localStorage.setItem('allUsers', JSON.stringify(allUsers));
    alert('Account created! Please login.');
    showLoginPage();
    document.getElementById('registerForm').reset();
});

// Login
document.getElementById('loginForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value.trim().toLowerCase();
    const password = document.getElementById('loginPassword').value;
    
    const user = allUsers.find(u => u.email === email && u.password === password);
    
    if (user) {
        currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        showMainWebsite();
        loadUserData();
        document.getElementById('loginForm').reset();
        alert('Welcome, ' + user.name + '!');
    } else {
        alert('Invalid email or password!');
    }
});

// Logout
document.getElementById('logoutLink')?.addEventListener('click', (e) => {
    e.preventDefault();
    if (confirm('Logout?')) {
        saveCurrentUser();
        currentUser = null;
        cart = [];
        notifications = [];
        localStorage.removeItem('currentUser');
        showLoginPage();
        alert('Logged out!');
    }
});

// ============================================
// PAGES & NAVIGATION
// ============================================

function showLoginPage() {
    document.getElementById('loginPage')?.classList.remove('hidden');
    document.getElementById('registerPage')?.classList.add('hidden');
    document.getElementById('mainWebsite')?.classList.add('hidden');
}

function showRegisterPage() {
    document.getElementById('loginPage')?.classList.add('hidden');
    document.getElementById('registerPage')?.classList.remove('hidden');
    document.getElementById('mainWebsite')?.classList.add('hidden');
}

function showMainWebsite() {
    document.getElementById('loginPage')?.classList.add('hidden');
    document.getElementById('registerPage')?.classList.add('hidden');
    document.getElementById('mainWebsite')?.classList.remove('hidden');
    showHomePage();
    initializeSwiper();
}

function showHomePage() {
    document.getElementById('homePage')?.classList.remove('hidden');
    document.getElementById('browsePage')?.classList.add('hidden');
    document.getElementById('dashboardPage')?.classList.add('hidden');
    loadFeaturedProducts();
}

function showBrowsePage() {
    document.getElementById('homePage')?.classList.add('hidden');
    document.getElementById('browsePage')?.classList.remove('hidden');
    document.getElementById('dashboardPage')?.classList.add('hidden');
    loadBrowseProducts();
}

function showDashboardPage(section = 'overview') {
    document.getElementById('homePage')?.classList.add('hidden');
    document.getElementById('browsePage')?.classList.add('hidden');
    document.getElementById('dashboardPage')?.classList.remove('hidden');
    loadDashboardSection(section);
}

// Navigation Links
document.getElementById('showRegister')?.addEventListener('click', (e) => { e.preventDefault(); showRegisterPage(); });
document.getElementById('showLogin')?.addEventListener('click', (e) => { e.preventDefault(); showLoginPage(); });
document.getElementById('logoLink')?.addEventListener('click', (e) => { e.preventDefault(); showHomePage(); });
document.getElementById('homeLink')?.addEventListener('click', (e) => { e.preventDefault(); showHomePage(); });
document.getElementById('browseLink')?.addEventListener('click', (e) => { e.preventDefault(); showBrowsePage(); });
document.getElementById('dashboardLink')?.addEventListener('click', (e) => { e.preventDefault(); showDashboardPage('overview'); });

document.getElementById('becomeSellerLink')?.addEventListener('click', (e) => {
    e.preventDefault();
    if (currentUser && currentUser.accountType === 'buyer') {
        if (confirm('Upgrade to Seller?')) {
            currentUser.accountType = 'seller';
            saveCurrentUser();
            alert('You are now a Seller!');
            updateUIForUser();
            showDashboardPage('products');
        }
    }
});

function updateUIForUser() {
    const link = document.getElementById('becomeSellerLink');
    if (currentUser && currentUser.accountType === 'seller') {
        if (link) link.style.display = 'none';
    } else {
        if (link) link.style.display = 'block';
    }
}

// ============================================
// PRODUCTS & CART
// ============================================

function loadFeaturedProducts() {
    const container = document.getElementById('featuredProductsContainer');
    if (!container) return;
    container.innerHTML = '';
    
    products.filter(p => p.featured).forEach(product => {
        const slide = document.createElement('div');
        slide.className = 'swiper-slide';
        slide.innerHTML = `
            <div class="product-card" data-product-id="${product.id}">
                <div class="product-image-container">
                    <img src="${product.image}" alt="${product.name}" class="product-img">
                    <span class="product-badge">Featured</span>
                </div>
                <div class="product-body">
                    <h5 class="product-title">${product.name}</h5>
                    <span class="product-category">${product.category}</span>
                    <p class="product-description">${product.description}</p>
                    <div class="product-rating">
                        <span class="stars-display">${'★'.repeat(Math.floor(product.rating))}${'☆'.repeat(5-Math.floor(product.rating))}</span>
                        <span class="rating-text">${product.rating} (${product.reviews})</span>
                    </div>
                    <div class="product-price">$${product.price}</div>
                    <button class="btn btn-primary-custom w-100 add-to-cart-btn" data-product-id="${product.id}">
                        <i class="fas fa-shopping-cart"></i> Add to Cart
                    </button>
                </div>
            </div>
        `;
        container.appendChild(slide);
    });
    attachProductListeners();
}

function initializeSwiper() {
    setTimeout(() => {
        new Swiper('.productsSwiper', {
            slidesPerView: 1, spaceBetween: 30, loop: true,
            pagination: { el: '.swiper-pagination', clickable: true },
            navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
            breakpoints: { 640: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }
        });
    }, 100);
}

document.querySelectorAll('.category-card').forEach(card => {
    card.addEventListener('click', () => {
        const category = card.dataset.category;
        showBrowsePage();
        document.getElementById('categoryFilter').value = category;
        filterProducts();
    });
});

document.getElementById('searchBtn')?.addEventListener('click', () => {
    const query = document.getElementById('searchInput').value;
    showBrowsePage();
    filterProducts(query);
});

document.getElementById('searchInput')?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        showBrowsePage();
        filterProducts(e.target.value);
    }
});

function loadBrowseProducts(filter = {}) {
    const container = document.getElementById('browseProductsContainer');
    if (!container) return;
    container.innerHTML = '';
    
    let filtered = [...products];
    if (filter.category && filter.category !== 'all') filtered = filtered.filter(p => p.category === filter.category);
    if (filter.priceRange) {
        const [min, max] = filter.priceRange.split('-').map(Number);
        filtered = filtered.filter(p => p.price >= min && p.price <= max);
    }
    if (filter.search) {
        filtered = filtered.filter(p => 
            p.name.toLowerCase().includes(filter.search.toLowerCase()) ||
            p.description.toLowerCase().includes(filter.search.toLowerCase())
        );
    }
    
    if (filtered.length === 0) {
        container.innerHTML = '<div class="col-12"><div class="alert alert-info">No products found.</div></div>';
        return;
    }
    
    filtered.forEach(product => {
        const col = document.createElement('div');
        col.className = 'col-md-4 col-sm-6';
        col.innerHTML = `
            <div class="product-card" data-product-id="${product.id}">
                <div class="product-image-container">
                    <img src="${product.image}" alt="${product.name}" class="product-img">
                </div>
                <div class="product-body">
                    <h5 class="product-title">${product.name}</h5>
                    <span class="product-category">${product.category}</span>
                    <p class="product-description">${product.description}</p>
                    <div class="product-rating">
                        <span class="stars-display">${'★'.repeat(Math.floor(product.rating))}${'☆'.repeat(5-Math.floor(product.rating))}</span>
                        <span class="rating-text">${product.rating}</span>
                    </div>
                    <div class="product-price">$${product.price}</div>
                    <button class="btn btn-primary-custom w-100 add-to-cart-btn" data-product-id="${product.id}">
                        <i class="fas fa-shopping-cart"></i> Add to Cart
                    </button>
                </div>
            </div>
        `;
        container.appendChild(col);
    });
    attachProductListeners();
}

function filterProducts(search = '') {
    const category = document.getElementById('categoryFilter')?.value;
    const priceRange = document.getElementById('priceFilter')?.value;
    loadBrowseProducts({ category, priceRange: priceRange !== 'all' ? priceRange : null, search });
}

document.getElementById('categoryFilter')?.addEventListener('change', () => filterProducts());
document.getElementById('priceFilter')?.addEventListener('change', () => filterProducts());

function attachProductListeners() {
    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            addToCart(parseInt(e.target.closest('.add-to-cart-btn').dataset.productId));
        });
    });
    
    document.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('click', (e) => {
            if (!e.target.closest('.add-to-cart-btn')) {
                showProductDetail(parseInt(card.dataset.productId));
            }
        });
    });
}

function showProductDetail(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const modal = `
        <div class="modal fade show" id="productDetailModal" style="display: block;" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">${product.name}</h5>
                        <button type="button" class="btn-close" onclick="closeProductDetail()"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                            <div class="col-md-6">
                                <img src="${product.image}" alt="${product.name}" class="product-detail-img">
                            </div>
                            <div class="col-md-6">
                                <span class="product-category">${product.category}</span>
                                <h3>${product.name}</h3>
                                <p>${product.description}</p>
                                <div class="product-features">
                                    <h6>Features:</h6>
                                    <ul>${product.features.map(f => `<li><i class="fas fa-check text-success me-2"></i>${f}</li>`).join('')}</ul>
                                </div>
                                <div class="price-section">
                                    <h2 class="text-primary">$${product.price}</h2>
                                </div>
                                <button class="btn btn-primary-custom btn-lg w-100 mt-3" onclick="addToCart(${product.id}); closeProductDetail();">
                                    <i class="fas fa-shopping-cart"></i> Add to Cart
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="modal-backdrop fade show"></div>
    `;
    document.body.insertAdjacentHTML('beforeend', modal);
}

window.closeProductDetail = function() {
    document.getElementById('productDetailModal')?.remove();
    document.querySelectorAll('.modal-backdrop').forEach(b => b.remove());
};

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    if (cart.find(item => item.id === productId)) {
        alert('Already in cart!');
        return;
    }
    cart.push({...product, quantity: 1});
    updateCartUI();
    saveCurrentUser();
    addNotification(`Added "${product.name}" to cart`, 'success');
}

function updateCartUI() {
    const count = document.getElementById('cartCount');
    if (count) count.textContent = cart.length;
}

document.getElementById('cartIcon')?.addEventListener('click', () => {
    if (cart.length === 0) {
        alert('Cart is empty!');
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    const modal = `
        <div class="modal fade show" id="cartModal" style="display: block;">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header bg-primary text-white">
                        <h5><i class="fas fa-shopping-cart"></i> Your Cart</h5>
                        <button class="btn-close btn-close-white" onclick="closeCartModal()"></button>
                    </div>
                    <div class="modal-body">
                        <div class="cart-items">
                            ${cart.map(item => `
                                <div class="cart-item">
                                    <img src="${item.image}" alt="${item.name}" class="cart-item-img">
                                    <div class="cart-item-details">
                                        <h6>${item.name}</h6>
                                        <p class="text-muted">${item.category}</p>
                                    </div>
                                    <div class="cart-item-price">$${item.price}</div>
                                    <button class="btn btn-sm btn-danger" onclick="removeFromCart(${item.id})">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </div>
                            `).join('')}
                        </div>
                        <div class="cart-summary">
                            <div class="summary-row total">
                                <span>Total:</span>
                                <span>$${total}</span>
                            </div>
                        </div>
                        <button class="btn btn-primary-custom btn-lg w-100 mt-3" onclick="proceedToCheckout()">
                            <i class="fas fa-lock"></i> Checkout
                        </button>
                    </div>
                </div>
            </div>
        </div>
        <div class="modal-backdrop fade show"></div>
    `;
    document.body.insertAdjacentHTML('beforeend', modal);
});

window.closeCartModal = function() {
    document.getElementById('cartModal')?.remove();
    document.querySelectorAll('.modal-backdrop').forEach(b => b.remove());
};

window.removeFromCart = function(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartUI();
    saveCurrentUser();
    closeCartModal();
    if (cart.length > 0) document.getElementById('cartIcon').click();
};

window.proceedToCheckout = function() {
    closeCartModal();
    if (cart.length === 0) return;
    
    const product = cart[0];
    const modal = new bootstrap.Modal(document.getElementById('paymentModal'));
    document.getElementById('paymentProductImage').src = product.image;
    document.getElementById('paymentProductName').textContent = product.name;
    document.getElementById('paymentProductCategory').textContent = product.category;
    document.getElementById('paymentProductPrice').textContent = `$${product.price}`;
    document.getElementById('payerProduct').value = product.name;
    document.getElementById('payerAmount').value = product.price;
    modal.show();
};

// ============================================
// END OF PART 1
// CONTINUE WITH PART 2
// ============================================

// ============================================
// PART 2 OF 2 - COPY THIS AFTER PART 1
// PAYMENT, DASHBOARD, ADMIN & CHAT
// ============================================

// PAYMENT SUBMISSION
document.getElementById('paymentProofForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const payerName = document.getElementById('payerName').value;
    const product = document.getElementById('payerProduct').value;
    const amount = document.getElementById('payerAmount').value;
    const bank = document.getElementById('paymentBank').value;
    const screenshot = document.getElementById('paymentScreenshot').files[0];
    
    if (!screenshot) {
        alert('Please upload screenshot!');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const payment = {
            id: 'PAY' + Date.now(),
            userId: currentUser.email,
            userName: currentUser.name,
            payerName, product, amount, bank,
            screenshot: e.target.result,
            status: 'pending',
            timestamp: Date.now()
        };
        
        allPayments.push(payment);
        localStorage.setItem('allPayments', JSON.stringify(allPayments));
        
        if (!currentUser.payments) currentUser.payments = [];
        currentUser.payments.push(payment);
        saveCurrentUser();
        
        const productInCart = cart.find(p => p.name === product);
        if (productInCart) {
            cart = cart.filter(p => p.id !== productInCart.id);
            updateCartUI();
            saveCurrentUser();
        }
        
        bootstrap.Modal.getInstance(document.getElementById('paymentModal')).hide();
        alert('Payment submitted! Wait for confirmation.');
        addNotification('Payment submitted! Awaiting confirmation.', 'info');
        
        document.getElementById('paymentProofForm').reset();
        document.getElementById('screenshotPreview').innerHTML = '';
    };
    reader.readAsDataURL(screenshot);
});

document.getElementById('paymentScreenshot')?.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            document.getElementById('screenshotPreview').innerHTML = 
                `<img src="${e.target.result}" style="max-width: 100%; border-radius: 10px; margin-top: 1rem;">`;
        };
        reader.readAsDataURL(file);
    }
});

// NOTIFICATIONS
function addNotification(message, type = 'info') {
    notifications.unshift({ id: Date.now(), message, type, timestamp: Date.now(), read: false });
    updateNotificationUI();
    saveCurrentUser();
}

function updateNotificationUI() {
    const badge = document.getElementById('notificationBadge');
    if (badge) badge.textContent = notifications.filter(n => !n.read).length;
}

document.getElementById('notificationIcon')?.addEventListener('click', () => {
    document.getElementById('notificationDropdown').classList.toggle('hidden');
});

// DASHBOARD
function loadDashboardSection(section) {
    const content = document.getElementById('dashboardContent');
    if (!content) return;
    
    document.querySelectorAll('.dashboard-menu-item').forEach(item => {
        item.classList.remove('active');
        if (item.dataset.section === section) item.classList.add('active');
    });
    
    switch(section) {
        case 'overview': loadOverview(content); break;
        case 'products': loadMyProducts(content); break;
        case 'purchases': loadMyPurchases(content); break;
        case 'orders': loadOrders(content); break;
        case 'sales': loadSales(content); break;
        case 'messages': loadMessages(content); break;
        case 'settings': loadSettings(content); break;
    }
}

document.querySelectorAll('.dashboard-menu-item').forEach(item => {
    item.addEventListener('click', () => loadDashboardSection(item.dataset.section));
});

function loadOverview(content) {
    const payments = currentUser.payments || [];
    const confirmed = payments.filter(p => p.status === 'confirmed').length;
    const pending = payments.filter(p => p.status === 'pending').length;
    const spent = payments.filter(p => p.status === 'confirmed').reduce((sum, p) => sum + parseFloat(p.amount), 0);
    
    content.innerHTML = `
        <h2><i class="fas fa-chart-line"></i> Dashboard</h2>
        <div class="row mt-4">
            <div class="col-md-4 mb-3">
                <div class="stat-card">
                    <i class="fas fa-shopping-bag fa-2x mb-3"></i>
                    <div class="stat-value">${confirmed}</div>
                    <div>Purchases</div>
                </div>
            </div>
            <div class="col-md-4 mb-3">
                <div class="stat-card">
                    <i class="fas fa-clock fa-2x mb-3"></i>
                    <div class="stat-value">${pending}</div>
                    <div>Pending</div>
                </div>
            </div>
            <div class="col-md-4 mb-3">
                <div class="stat-card">
                    <i class="fas fa-dollar-sign fa-2x mb-3"></i>
                    <div class="stat-value">$${spent}</div>
                    <div>Total Spent</div>
                </div>
            </div>
        </div>
    `;
}

function loadMyProducts(content) {
    if (currentUser.accountType !== 'seller') {
        content.innerHTML = `
            <div class="dashboard-card">
                <h4>Seller Account Required</h4>
                <button class="btn btn-primary-custom" onclick="upgradeToSeller()">Become Seller</button>
            </div>
        `;
        return;
    }
    content.innerHTML = `<h2><i class="fas fa-box"></i> My Products</h2><div class="dashboard-card"><p>Add products feature coming soon!</p></div>`;
}

function loadMyPurchases(content) {
    const purchases = (currentUser.payments || []).filter(p => p.status === 'confirmed');
    content.innerHTML = `
        <h2><i class="fas fa-shopping-bag"></i> My Purchases</h2>
        ${purchases.length === 0 ? '<div class="dashboard-card"><p>No confirmed purchases yet.</p></div>' :
            `<div class="table-responsive mt-4">
                <table class="table">
                    <thead><tr><th>Date</th><th>Product</th><th>Amount</th><th>Status</th><th>Action</th></tr></thead>
                    <tbody>
                        ${purchases.map(p => `
                            <tr>
                                <td>${new Date(p.timestamp).toLocaleDateString()}</td>
                                <td>${p.product}</td>
                                <td>$${p.amount}</td>
                                <td><span class="status-confirmed">Confirmed</span></td>
                                <td><button class="btn btn-download btn-sm" onclick="downloadProduct('${p.product}')">
                                    <i class="fas fa-download"></i> Download
                                </button></td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>`
        }
    `;
}

window.downloadProduct = function(productName) {
    const product = products.find(p => p.name === productName);
    if (product && product.downloadLink) {
        window.open(product.downloadLink, '_blank');
        addNotification(`Downloading: ${productName}`, 'success');
    } else {
        alert('Download link not available.');
    }
};

function loadOrders(content) {
    const orders = currentUser.payments || [];
    content.innerHTML = `
        <h2><i class="fas fa-shopping-cart"></i> My Orders</h2>
        ${orders.length === 0 ? '<div class="dashboard-card"><p>No orders yet.</p></div>' :
            `<div class="table-responsive mt-4">
                <table class="table">
                    <thead><tr><th>Order ID</th><th>Date</th><th>Product</th><th>Amount</th><th>Status</th><th>Action</th></tr></thead>
                    <tbody>
                        ${orders.map(order => `
                            <tr>
                                <td>#${order.id}</td>
                                <td>${new Date(order.timestamp).toLocaleDateString()}</td>
                                <td>${order.product}</td>
                                <td>$${order.amount}</td>
                                <td><span class="status-${order.status}">${order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span></td>
                                <td>
                                    ${order.status === 'confirmed' ? `<button class="btn btn-sm btn-download" onclick="downloadProduct('${order.product}')"><i class="fas fa-download"></i> Download</button>` :
                                      order.status === 'pending' ? '<span class="text-muted">Awaiting confirmation</span>' :
                                      '<span class="text-danger">Rejected</span>'}
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>`
        }
    `;
}

function loadSales(content) {
    if (currentUser.accountType !== 'seller') {
        content.innerHTML = `<div class="dashboard-card"><h4>Seller Account Required</h4></div>`;
        return;
    }
    content.innerHTML = `<h2><i class="fas fa-dollar-sign"></i> Sales</h2><div class="dashboard-card"><p>No sales data yet.</p></div>`;
}

function loadMessages(content) {
    content.innerHTML = `
        <h2><i class="fas fa-envelope"></i> Messages</h2>
        <div class="dashboard-card">
            <p>Messages feature coming soon!</p>
            <button class="btn btn-primary-custom" onclick="openLiveChat()">
                <i class="fas fa-comments"></i> Start Chat
            </button>
        </div>
    `;
}

function loadSettings(content) {
    content.innerHTML = `
        <h2><i class="fas fa-cog"></i> Settings</h2>
        <div class="dashboard-card">
            <h4>Account Information</h4>
            <form id="settingsForm">
                <div class="mb-3">
                    <label class="form-label">Name</label>
                    <input type="text" class="form-control" id="settingsName" value="${currentUser.name}" required>
                </div>
                <div class="mb-3">
                    <label class="form-label">Email</label>
                    <input type="email" class="form-control" value="${currentUser.email}" disabled>
                </div>
                <div class="mb-3">
                    <label class="form-label">Account Type</label>
                    <input type="text" class="form-control" value="${currentUser.accountType}" disabled>
                </div>
                <button type="submit" class="btn btn-primary-custom">
                    <i class="fas fa-save"></i> Save Changes
                </button>
            </form>
        </div>
        
        <div class="dashboard-card mt-4">
            <h4>Account Actions</h4>
            ${currentUser.accountType === 'buyer' ? `
                <button class="btn btn-primary-custom" onclick="upgradeToSeller()">
                    <i class="fas fa-user-tie"></i> Upgrade to Seller
                </button>
            ` : '<p class="text-muted">You are a seller.</p>'}
            
            ${currentUser.isAdmin ? '' : `
                <button class="btn btn-warning mt-2" onclick="makeAdmin()">
                    <i class="fas fa-user-shield"></i> Make Me Admin
                </button>
            `}
        </div>
    `;
    
    setTimeout(() => {
        document.getElementById('settingsForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            currentUser.name = document.getElementById('settingsName').value;
            saveCurrentUser();
            alert('Settings saved!');
        });
    }, 100);
}

window.upgradeToSeller = function() {
    if (confirm('Upgrade to Seller?')) {
        currentUser.accountType = 'seller';
        saveCurrentUser();
        alert('You are now a Seller!');
        updateUIForUser();
        loadDashboardSection('products');
    }
};

window.makeAdmin = function() {
    if (confirm('Make yourself an Admin?')) {
        currentUser.isAdmin = true;
        saveCurrentUser();
        alert('You are now an Admin! Refresh to see admin features.');
        location.reload();
    }
};

// ADMIN PANEL
window.viewAllPayments = function() {
    if (!currentUser.isAdmin) {
        alert('Admin access required!');
        return;
    }
    
    const content = document.getElementById('dashboardContent');
    content.innerHTML = `
        <h2><i class="fas fa-credit-card"></i> All Payments (Admin)</h2>
        <div class="alert alert-info">
            <i class="fas fa-shield-alt"></i> Admin View - All User Payments
        </div>
        ${allPayments.length === 0 ? '<div class="dashboard-card"><p>No payments yet.</p></div>' :
            `<div class="table-responsive mt-4">
                <table class="table">
                    <thead><tr><th>Date</th><th>User</th><th>Product</th><th>Amount</th><th>Bank</th><th>Status</th><th>Screenshot</th><th>Actions</th></tr></thead>
                    <tbody>
                        ${allPayments.map(payment => `
                            <tr>
                                <td>${new Date(payment.timestamp).toLocaleDateString()}</td>
                                <td>${payment.userName}<br><small>${payment.userId}</small></td>
                                <td>${payment.product}</td>
                                <td>$${payment.amount}</td>
                                <td>${payment.bank}</td>
                                <td><span class="status-${payment.status}">${payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}</span></td>
                                <td><button class="btn btn-sm btn-info" onclick="viewScreenshot('${payment.screenshot}')"><i class="fas fa-image"></i> View</button></td>
                                <td>
                                    ${payment.status === 'pending' ? `
                                        <button class="btn btn-sm btn-success" onclick="confirmPayment('${payment.id}')"><i class="fas fa-check"></i></button>
                                        <button class="btn btn-sm btn-danger" onclick="rejectPayment('${payment.id}')"><i class="fas fa-times"></i></button>
                                    ` : '<span class="text-muted">Processed</span>'}
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>`
        }
    `;
};

window.viewScreenshot = function(screenshot) {
    const modal = `
        <div class="modal fade show" id="screenshotModal" style="display: block;">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5>Payment Screenshot</h5>
                        <button class="btn-close" onclick="closeScreenshotModal()"></button>
                    </div>
                    <div class="modal-body text-center">
                        <img src="${screenshot}" class="screenshot-modal-img" alt="Payment Screenshot">
                    </div>
                </div>
            </div>
        </div>
        <div class="modal-backdrop fade show"></div>
    `;
    document.body.insertAdjacentHTML('beforeend', modal);
};

window.closeScreenshotModal = function() {
    document.getElementById('screenshotModal')?.remove();
    document.querySelectorAll('.modal-backdrop').forEach(b => b.remove());
};

window.confirmPayment = function(paymentId) {
    if (!confirm('Confirm this payment?')) return;
    
    const payment = allPayments.find(p => p.id === paymentId);
    if (payment) {
        payment.status = 'confirmed';
        localStorage.setItem('allPayments', JSON.stringify(allPayments));
        
        const user = allUsers.find(u => u.email === payment.userId);
        if (user) {
            const userPayment = user.payments.find(p => p.id === paymentId);
            if (userPayment) {
                userPayment.status = 'confirmed';
                localStorage.setItem('allUsers', JSON.stringify(allUsers));
            }
        }
        
        alert('Payment confirmed!');
        viewAllPayments();
    }
};

window.rejectPayment = function(paymentId) {
    const reason = prompt('Rejection reason:');
    if (!reason) return;
    
    const payment = allPayments.find(p => p.id === paymentId);
    if (payment) {
        payment.status = 'rejected';
        localStorage.setItem('allPayments', JSON.stringify(allPayments));
        
        const user = allUsers.find(u => u.email === payment.userId);
        if (user) {
            const userPayment = user.payments.find(p => p.id === paymentId);
            if (userPayment) {
                userPayment.status = 'rejected';
                localStorage.setItem('allUsers', JSON.stringify(allUsers));
            }
        }
        
        alert('Payment rejected!');
        viewAllPayments();
    }
};

// LIVE CHAT
let chatOpen = false;

document.getElementById('liveChatBtn')?.addEventListener('click', () => {
    if (chatOpen) {
        closeLiveChat();
    } else {
        openLiveChat();
    }
});

function openLiveChat() {
    chatOpen = true;
    
    const chatModal = `
        <div class="chat-modal" id="chatModal">
            <div class="chat-header">
                <h5><i class="fas fa-comments"></i> Live Chat</h5>
                <button class="chat-close-btn" onclick="closeLiveChat()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="chat-messages" id="chatMessagesContainer">
                <div class="chat-empty-state">
                    <i class="fas fa-comments"></i>
                    <p>Chat with support!</p>
                </div>
            </div>
            <div class="chat-input-area">
                <input type="text" class="chat-input" id="chatInput" placeholder="Type message...">
                <button class="chat-send-btn" onclick="sendChatMessage()">
                    <i class="fas fa-paper-plane"></i>
                </button>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', chatModal);
    
    document.getElementById('chatInput')?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendChatMessage();
    });
}

window.closeLiveChat = function() {
    chatOpen = false;
    document.getElementById('chatModal')?.remove();
};

window.sendChatMessage = function() {
    const input = document.getElementById('chatInput');
    if (!input) return;
    
    const message = input.value.trim();
    if (!message) return;
    
    const container = document.getElementById('chatMessagesContainer');
    
    const userMsg = `
        <div class="chat-message user">
            <div class="message-sender">You</div>
            <div class="message-bubble" style="background: linear-gradient(135deg, var(--primary-color), var(--secondary-color)); color: white;">${message}</div>
            <div class="message-time">${new Date().toLocaleTimeString()}</div>
        </div>
    `;
    
    container.innerHTML = userMsg;
    input.value = '';
    
    setTimeout(() => {
        const adminMsg = `
            <div class="chat-message admin">
                <div class="message-sender">Support</div>
                <div class="message-bubble" style="background: white; color: #1e293b;">Thank you! Our team will respond shortly.</div>
                <div class="message-time">${new Date().toLocaleTimeString()}</div>
            </div>
        `;
        container.innerHTML += adminMsg;
        container.scrollTop = container.scrollHeight;
    }, 1000);
};

// INITIALIZE
document.addEventListener('DOMContentLoaded', () => {
    console.log('✅ DigiMarket Pro Loaded!');
    console.log('📧 Create account to get started');
    checkAuth();
    
    if (currentUser && currentUser.isAdmin) {
        const sidebar = document.querySelector('.dashboard-sidebar');
        if (sidebar) {
            const adminMenu = document.createElement('div');
            adminMenu.className = 'dashboard-menu-item';
            adminMenu.innerHTML = '<i class="fas fa-shield-alt me-2"></i> Admin: Payments';
            adminMenu.onclick = viewAllPayments;
            sidebar.appendChild(adminMenu);
        }
    }
});

console.log('✅ System Ready!');
console.log('🔑 Login or Register to start!');

// ============================================
// END OF PART 2 - ALL DONE!
// ============================================