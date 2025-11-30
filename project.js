// ===================================
// DigiMarket Pro - project.js (FULL, corrected)
// ===================================

// === GLOBAL STATE ===
const appState = {
    user: null,
    cart: [],
    wishlist: [],
    notifications: [],
    products: []
};

// === INITIALIZE APP ===
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    loadFromLocalStorage();
    setupEventListeners();
    checkAuthStatus();
    loadProducts();
    updateUI();
    initializeAnimations();
    ensureLogoutBinding();
    ensureLiveChat();
}

// === LOCAL STORAGE MANAGEMENT ===
function loadFromLocalStorage() {
    try {
        const user = localStorage.getItem('digimarket_user');
        const cart = localStorage.getItem('digimarket_cart');
        const wishlist = localStorage.getItem('digimarket_wishlist');
        const notifications = localStorage.getItem('digimarket_notifications');
        const products = localStorage.getItem('digimarket_products'); // optional persisted products

        if (user) appState.user = JSON.parse(user);
        if (cart) appState.cart = JSON.parse(cart);
        if (wishlist) appState.wishlist = JSON.parse(wishlist);
        if (notifications) appState.notifications = JSON.parse(notifications);
        if (products) appState.products = JSON.parse(products);
    } catch (error) {
        console.error('Error loading from localStorage:', error);
    }
}

function saveToLocalStorage() {
    try {
        localStorage.setItem('digimarket_user', JSON.stringify(appState.user));
        localStorage.setItem('digimarket_cart', JSON.stringify(appState.cart));
        localStorage.setItem('digimarket_wishlist', JSON.stringify(appState.wishlist));
        localStorage.setItem('digimarket_notifications', JSON.stringify(appState.notifications));
        // products not always persisted, but keep if present
        if (appState.products && appState.products.length) {
            localStorage.setItem('digimarket_products', JSON.stringify(appState.products));
        }
    } catch (error) {
        console.error('Error saving to localStorage:', error);
    }
}

// === AUTHENTICATION ===
function checkAuthStatus() {
    const currentPage = window.location.pathname;
    // pages that should be publicly accessible
    const publicPages = ['/project-root/index.html', '/auth/login.html', '/auth/signup.html', '/project-root/', '/project-root/auth/login.html', '/project-root/auth/signup.html'];
    const isPublicPage = publicPages.some(page => currentPage.includes(page) || currentPage === '/');

    if (!appState.user && !isPublicPage) {
        showToast('Please login to continue', 'warning');
        setTimeout(() => {
            // redirect to auth login (relative)
            // if already under /auth/ then go to login.html directly
            const path = window.location.pathname;
            if (path.includes('/auth/')) {
                window.location.href = '/auth/login.html';
            } else {
                // go to auth folder login page
                const base = path.split('/').slice(0, -1).join('/') || '';
                window.location.href = `${base}/auth/login.html`.replace('//', '/');
            }
        }, 1200);
    }
}

function logout() {
    // Clear only app-related keys (safer than wiping all localStorage)
    appState.user = null;
    appState.cart = [];
    appState.wishlist = [];
    appState.notifications = [];
    saveToLocalStorage();

    // Remove session-like keys also used elsewhere
    localStorage.removeItem('digimarket_current_order');
    // keep stored users list (digimarket_users) intact so accounts persist
    showToast('Logged out successfully', 'success');

    setTimeout(() => {
        // redirect to index (relative)
        window.location.href = '/project-root/index.html';
    }, 800);
}

// === SAMPLE PRODUCTS DATA ===
function generateSampleProducts() {
    const categories = ['websites', 'apps', 'apis', 'ai-tools', 'courses', 'plugins'];
    const products = [];

    for (let i = 1; i <= 30; i++) {
        const category = categories[Math.floor(Math.random() * categories.length)];
        products.push({
            id: i,
            name: `Premium ${category.charAt(0).toUpperCase() + category.slice(1)} Product ${i}`,
            description: `High-quality ${category} solution with advanced features and lifetime support.`,
            price: Math.floor(Math.random() * 500) + 50,
            category: category,
            rating: (Math.random() * 2 + 3).toFixed(1),
            reviews: Math.floor(Math.random() * 1000) + 50,
            image: `https://picsum.photos/seed/${category + i}/400/300`,

            badge: ['new', 'featured', 'hot', null][Math.floor(Math.random() * 4)],
            features: [
                'Lifetime updates included',
                'Premium support 24/7',
                'Easy customization',
                'Well documented',
                'Mobile responsive'
            ],
            seller: {
                name: `Seller ${Math.floor(Math.random() * 100) + 1}`,
                rating: (Math.random() * 2 + 3).toFixed(1)
            }
        });
    }

    appState.products = products;
    saveToLocalStorage(); // optional: persist so subsequent loads show same products
}

function loadProducts() {
    if (!appState.products || appState.products.length === 0) {
        generateSampleProducts();
    }
}

// === CART MANAGEMENT ===
function addToCart(productId) {
    const product = appState.products.find(p => p.id === productId);
    if (!product) {
        showToast('Product not found', 'error');
        return;
    }

    const existingItem = appState.cart.find(item => item.id === productId);
    if (existingItem) {
        showToast('Product already in cart', 'info');
        return;
    }

    appState.cart.push(product);
    saveToLocalStorage();
    updateCartUI();
    showToast('Added to cart successfully', 'success');
}

function removeFromCart(productId) {
    appState.cart = appState.cart.filter(item => item.id !== productId);
    saveToLocalStorage();
    updateCartUI();
    showToast('Removed from cart', 'success');
}

function clearCart() {
    appState.cart = [];
    saveToLocalStorage();
    updateCartUI();
    showToast('Cart cleared', 'success');
}

function getCartTotal() {
    return appState.cart.reduce((total, item) => total + item.price, 0);
}

function updateCartUI() {
    // Update cart count badges
    const cartCountElements = document.querySelectorAll('#cartCount, #cartItemsCount');
    cartCountElements.forEach(el => {
        if (el) el.textContent = appState.cart.length;
    });

    // Update cart page if on cart page
    if (window.location.pathname.includes('cart.html')) {
        renderCartItems();
    }
}

function renderCartItems() {
    const container = document.getElementById('cartItemsContainer');
    const emptyState = document.getElementById('emptyCartState');
    const cartContent = document.getElementById('cartContent');

    if (!container) return;

    if (appState.cart.length === 0) {
        if (emptyState) emptyState.classList.remove('hidden');
        if (cartContent) cartContent.classList.add('hidden');
        container.innerHTML = ''; // clear
        return;
    }

    if (emptyState) emptyState.classList.add('hidden');
    if (cartContent) cartContent.classList.remove('hidden');

    container.innerHTML = appState.cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-image">
                <img src="${item.image}" alt="${item.name}">
            </div>
            <div class="cart-item-details">
                <h5 class="cart-item-title">${item.name}</h5>
                <p class="cart-item-category">
                    <i class="fas fa-tag"></i> ${item.category}
                </p>
                <p class="cart-item-price">$${item.price.toFixed(2)}</p>
            </div>
            <div class="cart-item-actions">
                <button class="btn-remove-cart" onclick="removeFromCart(${item.id})">
                    <i class="fas fa-trash fa-2x"></i>
                </button>
            </div>
        </div>
    `).join('');

    updateOrderSummary();
}

function updateOrderSummary() {
    const subtotal = getCartTotal();
    const tax = 0; // No tax
    const discount = 0; // No discount for now
    const total = subtotal - discount + tax;

    const elements = {
        subtotalAmount: document.getElementById('subtotalAmount'),
        taxAmount: document.getElementById('taxAmount'),
        discountAmount: document.getElementById('discountAmount'),
        totalAmount: document.getElementById('totalAmount')
    };

    if (elements.subtotalAmount) elements.subtotalAmount.textContent = `$${subtotal.toFixed(2)}`;
    if (elements.taxAmount) elements.taxAmount.textContent = `$${tax.toFixed(2)}`;
    if (elements.discountAmount) elements.discountAmount.textContent = `-$${discount.toFixed(2)}`;
    if (elements.totalAmount) elements.totalAmount.textContent = `$${total.toFixed(2)}`;
}

// === WISHLIST MANAGEMENT ===
function addToWishlist(productId) {
    const product = appState.products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = appState.wishlist.find(item => item.id === productId);
    if (existingItem) {
        // Remove from wishlist
        appState.wishlist = appState.wishlist.filter(item => item.id !== productId);
        showToast('Removed from wishlist', 'info');
    } else {
        // Add to wishlist
        appState.wishlist.push(product);
        showToast('Added to wishlist', 'success');
    }

    saveToLocalStorage();
    updateWishlistUI();
}

function updateWishlistUI() {
    const wishlistCountEl = document.getElementById('wishlistCount');
    if (wishlistCountEl) {
        wishlistCountEl.textContent = appState.wishlist.length;
    }
}

// === NOTIFICATIONS ===
function addNotification(message, type = 'info') {
    const notification = {
        id: Date.now(),
        message,
        type,
        read: false,
        timestamp: new Date().toISOString()
    };

    appState.notifications.unshift(notification);
    saveToLocalStorage();
    updateNotificationUI();
}

function updateNotificationUI() {
    const badge = document.getElementById('notificationBadge');
    if (badge) {
        const unreadCount = appState.notifications.filter(n => !n.read).length;
        badge.textContent = unreadCount;
    }
}

function renderNotifications() {
    const container = document.getElementById('notificationsList');
    if (!container) return;

    if (appState.notifications.length === 0) {
        container.innerHTML = `
            <div style="padding: 2rem; text-align: center; color: #6b7280;">
                <i class="fas fa-bell-slash fa-2x" style="margin-bottom: 1rem;"></i>
                <p>No notifications yet</p>
            </div>
        `;
        return;
    }

    container.innerHTML = appState.notifications.map(notif => `
        <div class="notification-item ${notif.read ? '' : 'unread'}" 
             onclick="markNotificationAsRead(${notif.id})">
            <div style="display: flex; gap: 1rem;">
                <i class="fas fa-${notif.type === 'success' ? 'check-circle' : 'info-circle'}" 
                   style="color: ${notif.type === 'success' ? '#10b981' : '#6366f1'}; font-size: 1.5rem;"></i>
                <div style="flex: 1;">
                    <p style="margin: 0; font-weight: 600;">${notif.message}</p>
                    <small style="color: #6b7280;">${formatTimestamp(notif.timestamp)}</small>
                </div>
            </div>
        </div>
    `).join('');
}

function markNotificationAsRead(notifId) {
    const notif = appState.notifications.find(n => n.id === notifId);
    if (notif) {
        notif.read = true;
        saveToLocalStorage();
        updateNotificationUI();
        renderNotifications();
    }
}

function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000); // seconds

    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    return `${Math.floor(diff / 86400)} days ago`;
}

// === PRODUCT RENDERING ===
function renderProducts(products, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    if (!products || products.length === 0) {
        container.innerHTML = `
            <div class="col-12">
                <div id="noResults" class="text-center py-5">
                    <i class="fas fa-search fa-3x text-muted mb-3"></i>
                    <h4>No Products Found</h4>
                    <p class="text-muted">Try adjusting your filters or search terms</p>
                </div>
            </div>
        `;
        return;
    }

    container.innerHTML = products.map(product => createProductCard(product)).join('');
}

function createProductCard(product) {
    const isInWishlist = appState.wishlist.some(item => item.id === product.id);
    const badgeHTML = product.badge ? `<span class="product-badge ${product.badge}">${product.badge}</span>` : '';

    return `
        <div class="col-lg-4 col-md-6 col-sm-12">
            <div class="product-card">
                <div class="product-card-image">
                    <img src="${product.image}" alt="${product.name}">
                    ${badgeHTML}
                    <div class="product-card-wishlist ${isInWishlist ? 'active' : ''}" 
                         onclick="addToWishlist(${product.id})">
                        <i class="fas fa-heart"></i>
                    </div>
                </div>
                <div class="product-card-body">
                    <span class="product-category">${product.category}</span>
                    <h5 class="product-title">${product.name}</h5>
                    <p class="product-description">${product.description}</p>
                    <div class="product-rating">
                        <span class="stars">
                            ${generateStars(product.rating)}
                        </span>
                        <span class="text-muted">(${product.reviews})</span>
                    </div>
                </div>
                <div class="product-card-footer">
                    <span class="product-price">$${product.price}</span>
                    <button class="btn-add-cart" onclick="addToCart(${product.id})">
                        <i class="fas fa-cart-plus"></i> Add to Cart
                    </button>
                </div>
            </div>
        </div>
    `;
}

function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = (rating % 1) >= 0.5;
    let stars = '';

    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }
    if (hasHalfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star"></i>';
    }

    return stars;
}

// === TOAST NOTIFICATIONS ===
function showToast(message, type = 'info') {
    // Remove existing toast container if any
    let container = document.querySelector('.toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'toast-container';
        document.body.appendChild(container);
    }

    const icons = {
        success: 'check-circle',
        error: 'times-circle',
        warning: 'exclamation-triangle',
        info: 'info-circle'
    };

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <i class="fas fa-${icons[type]} fa-lg"></i>
        <span>${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'slideInRight 0.3s ease reverse';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// === EVENT LISTENERS SETUP ===
function setupEventListeners() {
    // Notification icon
    const notificationIcon = document.getElementById('notificationIcon');
    if (notificationIcon) {
        notificationIcon.addEventListener('click', toggleNotificationDropdown);
    }

    // Checkout button
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', goToCheckout);
    }

    // Search functionality
    const searchBtn = document.getElementById('searchBtn');
    const searchInput = document.getElementById('searchInput');
    if (searchBtn && searchInput) {
        searchBtn.addEventListener('click', performSearch);
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') performSearch();
        });
    }

    // Become seller link
    const becomeSellerLink = document.getElementById('becomeSellerLink');
    if (becomeSellerLink) {
        becomeSellerLink.addEventListener('click', (e) => {
            e.preventDefault();
            showToast('Seller registration coming soon!', 'info');
        });
    }

    // Navbar scroll effect
    window.addEventListener('scroll', handleNavbarScroll);
}

// === UTILITY FUNCTIONS ===
function toggleNotificationDropdown() {
    const dropdown = document.getElementById('notificationDropdown');
    if (!dropdown) return;

    if (dropdown.classList.contains('hidden')) {
        dropdown.classList.remove('hidden');
        renderNotifications();
    } else {
        dropdown.classList.add('hidden');
    }
}

function goToCheckout() {
    if (appState.cart.length === 0) {
        showToast('Your cart is empty', 'warning');
        return;
    }
    window.location.href = '/project-root/checkout.html';
}

function performSearch() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;

    const query = searchInput.value.trim();
    if (!query) {
        showToast('Please enter a search term', 'warning');
        return;
    }

    // Redirect to market.html with query param
    window.location.href = `/project-root/market.html?search=${encodeURIComponent(query)}`;
}

function openLiveChat() {
    // If using the DOM live chat created below, toggle its visibility
    const chatWindow = document.getElementById('chatWindow');
    if (chatWindow) {
        chatWindow.style.display = chatWindow.style.display === 'none' ? 'flex' : 'none';
    } else {
        showToast('Live chat feature coming soon!', 'info');
    }
}

function handleNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
}

function copyToClipboard(text, button) {
    navigator.clipboard.writeText(text).then(() => {
        const originalHTML = button.innerHTML;
        button.innerHTML = '<i class="fas fa-check"></i> Copied!';
        button.classList.add('btn-success');
        button.classList.remove('btn-outline-primary');

        setTimeout(() => {
            button.innerHTML = originalHTML;
            button.classList.remove('btn-success');
            button.classList.add('btn-outline-primary');
        }, 2000);
    }).catch(err => {
        showToast('Failed to copy', 'error');
    });
}

function initializeAnimations() {
    // Initialize AOS if available
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            once: true,
            offset: 100
        });
    }

    // Initialize Swiper if available
    if (typeof Swiper !== 'undefined') {
        new Swiper('.productsSwiper', {
            slidesPerView: 1,
            spaceBetween: 30,
            loop: true,
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            breakpoints: {
                640: {
                    slidesPerView: 2,
                },
                1024: {
                    slidesPerView: 3,
                },
            },
        });
    }
}

// === UPDATE UI ON PAGE LOAD ===
function updateUI() {
    // Update user name displays
    const userNameElements = document.querySelectorAll('#userName, #welcomeUserName');
    userNameElements.forEach(el => {
        if (el && appState.user) {
            el.textContent = appState.user.name || 'User';
        } else if (el) {
            el.textContent = 'User';
        }
    });

    // Update cart count
    updateCartUI();

    // Update wishlist count
    updateWishlistUI();

    // Update notifications
    updateNotificationUI();

    // Page-specific updates
    const currentPage = window.location.pathname;

    if (currentPage.includes('/project-root/home.html') || currentPage === '/') {
        loadHomePage();
    } else if (currentPage.includes('/project-root/market.html')) {
        loadMarketplacePage();
    } else if (currentPage.includes('/project-root/cart.html')) {
        renderCartItems();
    } else if (currentPage.includes('/project-root/checkout.html')) {
        loadCheckoutPage();
    }
}

function loadHomePage() {
    // Load featured products
    const featuredContainer = document.getElementById('featuredProductsContainer');
    if (featuredContainer && appState.products.length > 0) {
        const featured = appState.products.slice(0, 6);
        featuredContainer.innerHTML = featured.map(product => `
            <div class="swiper-slide">
                ${createProductCard(product).replace('<div class="col-lg-4 col-md-6 col-sm-12">', '').replace('</div>', '')}
            </div>
        `).join('');
    }

    // Update stats
    const cartItemsCountEl = document.getElementById('cartItemsCount');
    if (cartItemsCountEl) cartItemsCountEl.textContent = appState.cart.length;
    const totalPurchasesEl = document.getElementById('totalPurchases');
    if (totalPurchasesEl) totalPurchasesEl.textContent = '0';
    const totalDownloadsEl = document.getElementById('totalDownloads');
    if (totalDownloadsEl) totalDownloadsEl.textContent = '0';
}

function loadMarketplacePage() {
    // If url contains search param, prefill search input
    const params = new URLSearchParams(window.location.search);
    const q = params.get('search');
    if (q) {
        const searchInput = document.getElementById('searchInput');
        if (searchInput) searchInput.value = q;
    }

    renderProducts(appState.products, 'productsContainer');

    // Setup filters and handlers
    setupMarketplaceFilters();
}

function setupMarketplaceFilters() {
    const categoryFilter = document.getElementById('categoryFilter');
    const priceFilter = document.getElementById('priceFilter');
    const ratingFilter = document.getElementById('ratingFilter');
    const sortFilter = document.getElementById('sortFilter');
    const searchInput = document.getElementById('searchInput');
    const clearFiltersBtn = document.getElementById('clearFiltersBtn');

    const applyFilters = () => {
        let filtered = [...appState.products];

        // Category filter
        if (categoryFilter && categoryFilter.value !== 'all') {
            filtered = filtered.filter(p => p.category === categoryFilter.value);
        }

        // Price filter
        if (priceFilter && priceFilter.value !== 'all') {
            const [min, max] = priceFilter.value.split('-').map(Number);
            filtered = filtered.filter(p => p.price >= min && (max ? p.price <= max : true));
        }

        // Rating filter
        if (ratingFilter && ratingFilter.value !== '0') {
            const minRating = parseFloat(ratingFilter.value);
            filtered = filtered.filter(p => parseFloat(p.rating) >= minRating);
        }

        // Search filter
        if (searchInput && searchInput.value) {
            const query = searchInput.value.toLowerCase();
            filtered = filtered.filter(p =>
                p.name.toLowerCase().includes(query) ||
                p.description.toLowerCase().includes(query)
            );
        }

        // Sort
        if (sortFilter) {
            switch (sortFilter.value) {
                case 'price-low':
                    filtered.sort((a, b) => a.price - b.price);
                    break;
                case 'price-high':
                    filtered.sort((a, b) => b.price - a.price);
                    break;
                case 'rating':
                    filtered.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating));
                    break;
            }
        }

        renderProducts(filtered, 'productsContainer');

        const resultsCount = document.getElementById('resultsCount');
        if (resultsCount) resultsCount.textContent = filtered.length;
    };

    if (categoryFilter) categoryFilter.addEventListener('change', applyFilters);
    if (priceFilter) priceFilter.addEventListener('change', applyFilters);
    if (ratingFilter) ratingFilter.addEventListener('change', applyFilters);
    if (sortFilter) sortFilter.addEventListener('change', applyFilters);
    if (searchInput) searchInput.addEventListener('input', applyFilters);
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', () => {
            if (categoryFilter) categoryFilter.value = 'all';
            if (priceFilter) priceFilter.value = 'all';
            if (ratingFilter) ratingFilter.value = '0';
            if (sortFilter) sortFilter.value = 'featured';
            if (searchInput) searchInput.value = '';
            applyFilters();
        });
    }

    // Initial render
    applyFilters();
}

function loadCheckoutPage() {
    // Pre-fill order items
    const itemsCount = document.getElementById('itemsCount');
    if (itemsCount) itemsCount.textContent = appState.cart.length;

    const orderItemsContainer = document.getElementById('orderItemsContainer');
    if (orderItemsContainer) {
        orderItemsContainer.innerHTML = appState.cart.map(item => `
            <div style="padding: 0.75rem 0; border-bottom: 1px solid #e5e7eb;">
                <div style="display: flex; justify-content: space-between;">
                    <span style="font-weight: 600;">${item.name}</span>
                    <span style="color: #6366f1;">$${item.price}</span>
                </div>
            </div>
        `).join('');
    }

    // Pre-fill user email if logged in
    const emailInput = document.getElementById('email');
    if (emailInput && appState.user) {
        emailInput.value = appState.user.email || '';
    }

    updateOrderSummary();

    // Setup place order button
    const placeOrderBtn = document.getElementById('placeOrderBtn');
    if (placeOrderBtn) {
        placeOrderBtn.addEventListener('click', handlePlaceOrder);
    }
}

function handlePlaceOrder() {
    const form = document.getElementById('checkoutForm');
    if (!form || !form.checkValidity()) {
        showToast('Please fill in all required fields', 'warning');
        if (form) form.reportValidity();
        return;
    }

    // Create order
    const order = {
        id: 'ORD' + Date.now(),
        items: appState.cart,
        total: getCartTotal(),
        customerInfo: {
            name: document.getElementById('fullName').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            country: document.getElementById('country').value
        },
        date: new Date().toISOString(),
        status: 'pending'
    };

    // Save order to localStorage
    const orders = JSON.parse(localStorage.getItem('digimarket_orders') || '[]');
    orders.push(order);
    localStorage.setItem('digimarket_orders', JSON.stringify(orders));
    localStorage.setItem('digimarket_current_order', JSON.stringify(order));

    // Clear cart (optional)
    appState.cart = [];
    saveToLocalStorage();

    // Go to payment confirmation
    window.location.href = '/project-root/confirm-payment.html';
}

// Make functions globally available
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.addToWishlist = addToWishlist;
window.copyToClipboard = copyToClipboard;
window.markNotificationAsRead = markNotificationAsRead;

// ===================================
// Payment & Authentication Scripts
// ===================================

// === PAYMENT CONFIRMATION PAGE ===
if (window.location.pathname.includes('confirm-payment.html')) {
    document.addEventListener('DOMContentLoaded', initializePaymentPage);
}

function initializePaymentPage() {
    const currentOrder = JSON.parse(localStorage.getItem('digimarket_current_order') || 'null');

    if (!currentOrder) {
        showToast('No order found', 'error');
        setTimeout(() => window.location.href = '/project-root/cart.html', 1500);
        return;
    }

    // Display order info
    const orderIdEl = document.getElementById('orderId');
    if (orderIdEl) orderIdEl.textContent = currentOrder.id;
    const paymentTotalAmountEl = document.getElementById('paymentTotalAmount');
    if (paymentTotalAmountEl) paymentTotalAmountEl.textContent = `$${currentOrder.total.toFixed(2)}`;
    const payerEmailEl = document.getElementById('payerEmail');
    if (payerEmailEl) payerEmailEl.value = currentOrder.customerInfo.email;
    const amountPaidEl = document.getElementById('amountPaid');
    if (amountPaidEl) amountPaidEl.value = currentOrder.total.toFixed(2);
    const payerNameEl = document.getElementById('payerName');
    if (payerNameEl) payerNameEl.value = currentOrder.customerInfo.name;

    // Setup payment proof form
    const form = document.getElementById('paymentProofForm');
    if (form) {
        form.addEventListener('submit', handlePaymentProofSubmit);
    }

    // Setup file preview
    const screenshotInput = document.getElementById('paymentScreenshot');
    if (screenshotInput) {
        screenshotInput.addEventListener('change', handleScreenshotPreview);
    }
}

function handleScreenshotPreview(e) {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
        showToast('Please upload an image file', 'error');
        e.target.value = '';
        return;
    }

    const reader = new FileReader();
    reader.onload = function(event) {
        const preview = document.getElementById('screenshotPreview');
        if (preview) {
            preview.innerHTML = `
                <div style="position: relative; display: inline-block;">
                    <img src="${event.target.result}" 
                         style="max-width: 100%; max-height: 300px; border-radius: 0.75rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                    <button type="button" class="btn btn-sm btn-danger" 
                            style="position: absolute; top: 10px; right: 10px;"
                            onclick="clearScreenshot()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `;
        }
    };
    reader.readAsDataURL(file);
}

function clearScreenshot() {
    const input = document.getElementById('paymentScreenshot');
    if (input) input.value = '';
    const preview = document.getElementById('screenshotPreview');
    if (preview) preview.innerHTML = '';
}

function handlePaymentProofSubmit(e) {
    e.preventDefault();

    const form = e.target;
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    const formData = {
        orderId: document.getElementById('orderId') ? document.getElementById('orderId').textContent : '',
        payerName: document.getElementById('payerName') ? document.getElementById('payerName').value : '',
        payerEmail: document.getElementById('payerEmail') ? document.getElementById('payerEmail').value : '',
        amountPaid: document.getElementById('amountPaid') ? document.getElementById('amountPaid').value : '',
        paymentBank: document.getElementById('paymentBank') ? document.getElementById('paymentBank').value : '',
        paymentNotes: document.getElementById('paymentNotes') ? document.getElementById('paymentNotes').value : '',
        timestamp: new Date().toISOString()
    };

    // Save payment proof to localStorage
    const paymentProofs = JSON.parse(localStorage.getItem('digimarket_payment_proofs') || '[]');
    paymentProofs.push(formData);
    localStorage.setItem('digimarket_payment_proofs', JSON.stringify(paymentProofs));

    // Update order status
    const orders = JSON.parse(localStorage.getItem('digimarket_orders') || '[]');
    const orderIndex = orders.findIndex(o => o.id === formData.orderId);
    if (orderIndex !== -1) {
        orders[orderIndex].status = 'pending_confirmation';
        orders[orderIndex].paymentProofSubmitted = true;
        localStorage.setItem('digimarket_orders', JSON.stringify(orders));
    }

    // Clear cart
    appState.cart = [];
    saveToLocalStorage();

    // Add notification
    addNotification('Payment proof submitted successfully! We will review it within 24 hours.', 'success');

    // Show success message
    showToast('Payment proof submitted successfully!', 'success');

    // Redirect to success page
    setTimeout(() => {
        window.location.href = '/project-root/payment-success.html';
    }, 1200);
}

// === PAYMENT SUCCESS PAGE ===
if (window.location.pathname.includes('/project-root/payment-success.html')) {
    document.addEventListener('DOMContentLoaded', initializeSuccessPage);
}

function initializeSuccessPage() {
    const currentOrder = JSON.parse(localStorage.getItem('digimarket_current_order') || 'null');

    if (currentOrder) {
        const orderIdDisplay = document.getElementById('orderIdDisplay');
        if (orderIdDisplay) orderIdDisplay.textContent = `#${currentOrder.id}`;
        const totalAmountDisplay = document.getElementById('totalAmountDisplay');
        if (totalAmountDisplay) totalAmountDisplay.textContent = `$${currentOrder.total.toFixed(2)}`;
        const userEmail = document.getElementById('userEmail');
        if (userEmail) userEmail.textContent = currentOrder.customerInfo.email;
    }

    const now = new Date();
    const orderDateEl = document.getElementById('orderDate');
    if (orderDateEl) orderDateEl.textContent = now.toLocaleDateString() + ' ' + now.toLocaleTimeString();

    // Contact support button
    const contactBtn = document.getElementById('contactSupportBtn');
    if (contactBtn) {
        contactBtn.addEventListener('click', () => {
            window.location.href = 'mailto:scottplug001@gmail.com';
        });
    }
}

// === AUTHENTICATION PAGES ===
if (window.location.pathname.includes('login.html')) {
    document.addEventListener('DOMContentLoaded', initializeLoginPage);
}

if (window.location.pathname.includes('signup.html')) {
    document.addEventListener('DOMContentLoaded', initializeSignupPage);
}

function initializeLoginPage() {
    const form = document.getElementById('loginForm');
    if (form) {
        form.addEventListener('submit', handleLogin);
    }
}

function initializeSignupPage() {
    const form = document.getElementById('signupForm');
    if (form) {
        form.addEventListener('submit', handleSignup);
    }
}

function handleLogin(e) {
    e.preventDefault();

    const email = document.getElementById('loginEmail')?.value;
    const password = document.getElementById('loginPassword')?.value;

    if (!email || !password) {
        showToast('Please fill in all fields', 'warning');
        return;
    }

    // Check if user exists
    const users = JSON.parse(localStorage.getItem('digimarket_users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
        showToast('Invalid email or password', 'error');
        return;
    }

    // Save user session (app level)
    const userSession = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role || 'buyer'
    };
    appState.user = userSession;
    saveToLocalStorage();

    showToast('Login successful!', 'success');

    setTimeout(() => {
        // Redirect to home (adjust relative path)
        const originPath = window.location.pathname;
        if (originPath.includes('/auth/')) {
            window.location.href = '/project-root/home.html';
        } else {
            window.location.href = '/project-root/home.html';
        }
    }, 900);
}

function handleSignup(e) {
    e.preventDefault();

    const name = document.getElementById('signupName')?.value;
    const email = document.getElementById('signupEmail')?.value;
    const password = document.getElementById('signupPassword')?.value;
    const confirmPassword = document.getElementById('signupConfirmPassword')?.value;

    if (!name || !email || !password || !confirmPassword) {
        showToast('Please fill in all fields', 'warning');
        return;
    }

    if (password !== confirmPassword) {
        showToast('Passwords do not match', 'error');
        return;
    }

    if (password.length < 6) {
        showToast('Password must be at least 6 characters', 'error');
        return;
    }

    // Check if user already exists
    const users = JSON.parse(localStorage.getItem('digimarket_users') || '[]');
    const existingUser = users.find(u => u.email === email);

    if (existingUser) {
        showToast('User with this email already exists', 'error');
        return;
    }

    // Create new user
    const newUser = {
        id: Date.now(),
        name,
        email,
        password, // In production, this should be hashed!
        role: 'buyer',
        createdAt: new Date().toISOString()
    };

    users.push(newUser);
    localStorage.setItem('digimarket_users', JSON.stringify(users));

    // Auto login app-level
    const userSession = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
    };
    appState.user = userSession;
    saveToLocalStorage();

    showToast('Account created successfully!', 'success');

    setTimeout(() => {
        // redirect to home
        window.location.href = '/project-root/home.html';
    }, 900);
}

// === CHECKOUT PAGE FUNCTIONALITY ===
if (window.location.pathname.includes('checkout.html')) {
    document.addEventListener('DOMContentLoaded', initializeCheckoutPage);
}

function initializeCheckoutPage() {
    // Additional checkout-specific functionality can go here
}

// === INVOICE PAGE ===
if (window.location.pathname.includes('/project-root/invoice.html')) {
    document.addEventListener('DOMContentLoaded', initializeInvoicePage);
}

function initializeInvoicePage() {
    // Get order ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const orderId = urlParams.get('order');

    if (!orderId) {
        showToast('Order not found', 'error');
        return;
    }

    // Load order
    const orders = JSON.parse(localStorage.getItem('digimarket_orders') || '[]');
    const order = orders.find(o => o.id === orderId);

    if (!order) {
        showToast('Order not found', 'error');
        return;
    }

    // Populate invoice
    const invoiceNumberEl = document.getElementById('invoiceNumber');
    if (invoiceNumberEl) invoiceNumberEl.textContent = order.id;
    const invoiceDateEl = document.getElementById('invoiceDate');
    if (invoiceDateEl) invoiceDateEl.textContent = new Date(order.date).toLocaleDateString();

    const statusBadge = document.getElementById('invoiceStatus');
    if (statusBadge) {
        const statusConfig = {
            'pending': { text: 'Pending Payment', class: 'bg-warning text-dark' },
            'pending_confirmation': { text: 'Awaiting Confirmation', class: 'bg-info' },
            'paid': { text: 'Paid', class: 'bg-success' },
            'completed': { text: 'Completed', class: 'bg-success' }
        };

        const config = statusConfig[order.status] || statusConfig.pending;
        statusBadge.textContent = config.text;
        statusBadge.className = `status-badge ${config.class}`;
    }

    // Customer info
    const customerNameEl = document.getElementById('customerName');
    if (customerNameEl) customerNameEl.textContent = order.customerInfo.name;
    const customerEmailEl = document.getElementById('customerEmail');
    if (customerEmailEl) customerEmailEl.textContent = order.customerInfo.email;
    const customerPhoneEl = document.getElementById('customerPhone');
    if (customerPhoneEl) customerPhoneEl.textContent = order.customerInfo.phone;

    // Items
    const tbody = document.getElementById('invoiceItemsBody');
    if (tbody) {
        tbody.innerHTML = order.items.map((item, index) => `
            <tr>
                <td>${index + 1}</td>
                <td>${item.name}</td>
                <td>${item.category}</td>
                <td class="text-center">1</td>
                <td class="text-end">$${item.price.toFixed(2)}</td>
            </tr>
        `).join('');
    }

    // Totals
    const subtotal = order.total;
    const invoiceSubtotal = document.getElementById('invoiceSubtotal');
    if (invoiceSubtotal) invoiceSubtotal.textContent = `$${subtotal.toFixed(2)}`;
    const invoiceTax = document.getElementById('invoiceTax');
    if (invoiceTax) invoiceTax.textContent = '$0.00';
    const invoiceDiscount = document.getElementById('invoiceDiscount');
    if (invoiceDiscount) invoiceDiscount.textContent = '-$0.00';
    const invoiceTotal = document.getElementById('invoiceTotal');
    if (invoiceTotal) invoiceTotal.textContent = `$${subtotal.toFixed(2)}`;

    // Show download section if paid
    if (order.status === 'paid' || order.status === 'completed') {
        const downloadSection = document.getElementById('downloadSection');
        if (downloadSection) {
            downloadSection.style.display = 'block';
            const downloadLinks = document.getElementById('downloadLinks');
            if (downloadLinks) {
                downloadLinks.innerHTML = order.items.map(item => `
                    <div style="padding: 0.75rem 0; border-bottom: 1px solid rgba(255,255,255,0.2);">
                        <a href="#" class="text-white" onclick="downloadProduct('${item.id}'); return false;">
                            <i class="fas fa-download"></i> Download ${item.name}
                        </a>
                    </div>
                `).join('');
            }
        }
    }
}

function downloadProduct(productId) {
    showToast('Download started!', 'success');
    // In a real application, this would trigger an actual download
    console.log('Downloading product:', productId);
}

function downloadPDF() {
    showToast('PDF download feature coming soon!', 'info');
    // In production, use jsPDF library to generate PDF
}

// === PRODUCT DETAILS PAGE ===
if (window.location.pathname.includes('/project-root/product-details.html')) {
    document.addEventListener('DOMContentLoaded', initializeProductDetailsPage);
}

function initializeProductDetailsPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id'));

    if (!productId) {
        showToast('Product not found', 'error');
        setTimeout(() => window.location.href = '/project-root/market.html', 1500);
        return;
    }

    // Load products if not loaded
    if (!appState.products || appState.products.length === 0) {
        generateSampleProducts();
    }

    const product = appState.products.find(p => p.id === productId);

    if (!product) {
        showToast('Product not found', 'error');
        setTimeout(() => window.location.href = 'market.html', 1500);
        return;
    }

    // Populate product details (guard elements as they may not exist)
    const productMainImage = document.getElementById('productMainImage');
    if (productMainImage) {
        productMainImage.src = product.image;
        productMainImage.alt = product.name;
    }
    const productCategory = document.getElementById('productCategory');
    if (productCategory) {
        productCategory.textContent = product.category;
        productCategory.className = 'product-category';
    }
    const productName = document.getElementById('productName');
    if (productName) productName.textContent = product.name;
    const productDescription = document.getElementById('productDescription');
    if (productDescription) productDescription.textContent = product.description;
    const productPrice = document.getElementById('productPrice');
    if (productPrice) productPrice.textContent = `$${product.price}`;

    // Rating
    const ratingEl = document.getElementById('productRating');
    if (ratingEl) {
        ratingEl.innerHTML = `
            <span class="stars">${generateStars(product.rating)}</span>
            <span class="text-muted">${product.rating} (${product.reviews} reviews)</span>
        `;
    }

    // Badge
    const badgesEl = document.getElementById('productBadges');
    if (badgesEl && product.badge) {
        badgesEl.innerHTML = `<span class="product-badge ${product.badge}">${product.badge}</span>`;
    }

    // Features
    const featuresEl = document.getElementById('productFeaturesList');
    if (featuresEl) {
        featuresEl.innerHTML = product.features.map(f => `<li><i class="fas fa-check text-success"></i> ${f}</li>`).join('');
    }

    // Full description
    const fullDesc = document.getElementById('productFullDescription');
    if (fullDesc) fullDesc.innerHTML = `<p>${product.description}</p>`;

    // Seller info
    const sellerEl = document.getElementById('sellerInfo');
    if (sellerEl) {
        sellerEl.innerHTML = `
            <div class="seller-avatar">${product.seller.name.charAt(0)}</div>
            <div>
                <strong>${product.seller.name}</strong>
                <div class="stars">${generateStars(product.seller.rating)}</div>
            </div>
        `;
    }

    // Breadcrumb
    const breadcrumbCategory = document.getElementById('breadcrumbCategory');
    if (breadcrumbCategory) breadcrumbCategory.textContent = product.category;

    // Setup buttons (guard)
    const addToCartBtn = document.getElementById('addToCartBtn');
    if (addToCartBtn) addToCartBtn.addEventListener('click', () => addToCart(productId));
    const addToWishlistBtn = document.getElementById('addToWishlistBtn');
    if (addToWishlistBtn) addToWishlistBtn.addEventListener('click', () => addToWishlist(productId));

    // Load related products
    const related = appState.products
        .filter(p => p.category === product.category && p.id !== productId)
        .slice(0, 3);

    const relatedContainer = document.getElementById('relatedProductsContainer');
    if (relatedContainer) {
        relatedContainer.innerHTML = related.map(p => createProductCard(p)).join('');
    }
}

// Helper function for notifications (duplicate safe)
function addNotification(message, type) {
    const notifications = JSON.parse(localStorage.getItem('digimarket_notifications') || '[]');
    notifications.unshift({
        id: Date.now(),
        message,
        type,
        read: false,
        timestamp: new Date().toISOString()
    });
    localStorage.setItem('digimarket_notifications', JSON.stringify(notifications));
}

// Helper function for toast (duplicate-safe name)
function showToast(message, type) {
    // Delegates to main showToast above (already defined) - avoid double-def
    try {
        // main showToast exists; call it
        const fn = window.showToast || null;
        if (typeof fn === 'function' && fn !== showToast) {
            fn(message, type);
            return;
        }
    } catch (e) {
        // ignore
    }
    // fallback: basic alert
    alert(message);
}

// === LIVE CHAT & LOGOUT HELPERS ===
function ensureLogoutBinding() {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn && !logoutBtn._bound) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            logout();
        });
        logoutBtn._bound = true;
    }
}

function ensureLiveChat() {
    // Create simple live chat UI only once
    if (document.getElementById('liveChatBtn')) return;

    const body = document.body;

    // Chat Button
    const chatBtn = document.createElement('button');
    chatBtn.id = 'liveChatBtn';
    chatBtn.title = 'Live chat';
    chatBtn.className = 'live-chat-btn';
    chatBtn.style.position = 'fixed';
    chatBtn.style.right = '20px';
    chatBtn.style.bottom = '20px';
    chatBtn.style.zIndex = '9999';
    chatBtn.style.borderRadius = '50px';
    chatBtn.style.padding = '12px 14px';
    chatBtn.style.background = '#007bff';
    chatBtn.style.color = '#fff';
    chatBtn.style.border = 'none';
    chatBtn.style.boxShadow = '0 6px 18px rgba(0,0,0,0.15)';
    chatBtn.innerHTML = '<i class="fas fa-comments"></i>';

    // Chat Window
    const chatWindow = document.createElement('div');
    chatWindow.id = 'chatWindow';
    chatWindow.style.position = 'fixed';
    chatWindow.style.right = '20px';
    chatWindow.style.bottom = '80px';
    chatWindow.style.width = '320px';
    chatWindow.style.maxHeight = '420px';
    chatWindow.style.display = 'none';
    chatWindow.style.flexDirection = 'column';
    chatWindow.style.background = '#fff';
    chatWindow.style.borderRadius = '8px';
    chatWindow.style.boxShadow = '0 8px 30px rgba(0,0,0,0.2)';
    chatWindow.style.overflow = 'hidden';
    chatWindow.style.zIndex = '9999';

    chatWindow.innerHTML = `
        <div style="background:#007bff;color:#fff;padding:12px;font-weight:600;">
            Live Support
            <button id="chatClose" style="float:right;background:transparent;border:none;color:#fff;font-size:16px;cursor:pointer">×</button>
        </div>
        <div id="chatMessages" style="padding:10px;flex:1;overflow:auto;color:#333;">
            <p style="color:#666;margin:0">Welcome! How can we help you today?</p>
        </div>
        <div style="display:flex;border-top:1px solid #eee;padding:8px;">
            <input id="chatInput" placeholder="Type a message..." style="flex:1;padding:8px;border-radius:6px;border:1px solid #ddd;outline:none;">
            <button id="chatSend" style="margin-left:8px;padding:8px 12px;border-radius:6px;border:none;background:#007bff;color:#fff;cursor:pointer;">Send</button>
        </div>
    `;

    body.appendChild(chatBtn);
    body.appendChild(chatWindow);

    chatBtn.addEventListener('click', () => {
        chatWindow.style.display = chatWindow.style.display === 'flex' ? 'none' : 'flex';
    });
    document.getElementById('chatClose').addEventListener('click', () => {
        chatWindow.style.display = 'none';
    });

    document.getElementById('chatSend').addEventListener('click', () => {
        const input = document.getElementById('chatInput');
        const text = input.value.trim();
        if (!text) return;
        const box = document.getElementById('chatMessages');
        const you = document.createElement('div');
        you.style.margin = '6px 0';
        you.style.textAlign = 'right';
        you.innerHTML = `<div style="display:inline-block;background:#e6f0ff;padding:8px;border-radius:8px;">You: ${escapeHtml(text)}</div>`;
        box.appendChild(you);
        input.value = '';
        box.scrollTop = box.scrollHeight;

        // Simulated agent response
        setTimeout(() => {
            const agent = document.createElement('div');
            agent.style.margin = '6px 0';
            agent.style.textAlign = 'left';
            agent.innerHTML = `<div style="display:inline-block;background:#f1f1f1;padding:8px;border-radius:8px;">Support: Thanks — we'll get back shortly.</div>`;
            box.appendChild(agent);
            box.scrollTop = box.scrollHeight;
        }, 700);
    });
}

function escapeHtml(unsafe) {
    return unsafe.replace(/[&<"'>]/g, function(m) {
        return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' })[m];
    });
}

// === PAGE ROUTER HELPERS ===
function ensurePageRoutingFixes() {
    // Nothing extra required; updateUI uses market.html check
}

// === PRODUCT-RELATED HELPERS (download etc.) ===
// already implemented above (downloadProduct, downloadPDF)

// === PRODUCT DETAILS / MARKETPLACE already implemented above ===

// Final safety: bind logout once DOM ready
document.addEventListener('DOMContentLoaded', () => {
    ensureLogoutBinding();
    ensureLiveChat();
});

// expose some helper functions globally (again)
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.addToWishlist = addToWishlist;
window.markNotificationAsRead = markNotificationAsRead;
window.downloadProduct = downloadProduct;
window.downloadPDF = downloadPDF;
