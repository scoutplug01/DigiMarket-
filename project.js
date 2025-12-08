// ===================================
// DigiMarket Pro - project.js (FIXED - PART 1)
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
    setupNotificationClose();
}

// === LOCAL STORAGE MANAGEMENT ===
function loadFromLocalStorage() {
    try {
        // Load user from BOTH possible keys
        let user = localStorage.getItem('digimarket_user');
        if (!user) {
            user = localStorage.getItem('currentUser');
        }
        
        const cart = localStorage.getItem('digimarket_cart');
        const wishlist = localStorage.getItem('digimarket_wishlist');
        const notifications = localStorage.getItem('digimarket_notifications');
        const products = localStorage.getItem('digimarket_products');

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
        // Save to BOTH keys for compatibility
        if (appState.user) {
            localStorage.setItem('digimarket_user', JSON.stringify(appState.user));
            localStorage.setItem('currentUser', JSON.stringify(appState.user));
        }
        localStorage.setItem('digimarket_cart', JSON.stringify(appState.cart));
        localStorage.setItem('digimarket_wishlist', JSON.stringify(appState.wishlist));
        localStorage.setItem('digimarket_notifications', JSON.stringify(appState.notifications));
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
    const publicPages = ['index.html', 'login.html', 'signup.html', '/'];
    const isPublicPage = publicPages.some(page => currentPage.includes(page));

    if (!appState.user && !isPublicPage) {
        showToast('Please login to continue', 'warning');
        setTimeout(() => {
            window.location.href = '/auth/login.html';
        }, 1200);
    }
}

function logout() {
    appState.user = null;
    appState.cart = [];
    appState.wishlist = [];
    appState.notifications = [];
    
    // Clear BOTH storage keys
    localStorage.removeItem('digimarket_user');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('digimarket_cart');
    localStorage.removeItem('digimarket_wishlist');
    localStorage.removeItem('digimarket_notifications');
    localStorage.removeItem('digimarket_current_order');
    
    saveToLocalStorage();
    showToast('Logged out successfully', 'success');

    setTimeout(() => {
        window.location.href = 'index.html';
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
    saveToLocalStorage();
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
    const cartCountElements = document.querySelectorAll('#cartCount, #cartItemsCount');
    cartCountElements.forEach(el => {
        if (el) el.textContent = appState.cart.length;
    });

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
        container.innerHTML = '';
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
    const tax = 0;
    const discount = 0;
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
        appState.wishlist = appState.wishlist.filter(item => item.id !== productId);
        showToast('Removed from wishlist', 'info');
    } else {
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

// Make functions globally available
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.addToWishlist = addToWishlist; 

// ===================================
// DigiMarket Pro - project.js (PART 2)
// ===================================

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
    const diff = Math.floor((now - date) / 1000);

    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    return `${Math.floor(diff / 86400)} days ago`;
}

// === SETUP NOTIFICATION CLOSE BUTTON ===
function setupNotificationClose() {
    const notificationIcon = document.getElementById('notificationIcon');
    const notificationDropdown = document.getElementById('notificationDropdown');
    
    if (!notificationIcon || !notificationDropdown) return;
    
    // Create close button if it doesn't exist
    let closeBtn = document.getElementById('closeNotificationBtn');
    if (!closeBtn) {
        const headerDiv = notificationDropdown.querySelector('div[style*="border-bottom"]');
        if (headerDiv) {
            closeBtn = document.createElement('button');
            closeBtn.id = 'closeNotificationBtn';
            closeBtn.innerHTML = '<i class="fas fa-times"></i>';
            closeBtn.style.cssText = 'background: transparent; border: none; color: #6b7280; cursor: pointer; font-size: 1.5rem; padding: 0; width: 30px; height: 30px; display: flex; align-items: center; justify-content: center; border-radius: 50%; transition: all 0.3s ease; position: absolute; right: 1rem; top: 1rem;';
            
            headerDiv.style.position = 'relative';
            headerDiv.appendChild(closeBtn);
            
            closeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                notificationDropdown.classList.add('hidden');
            });
            
            closeBtn.addEventListener('mouseenter', function() {
                this.style.backgroundColor = '#f3f4f6';
                this.style.color = '#ef4444';
            });
            
            closeBtn.addEventListener('mouseleave', function() {
                this.style.backgroundColor = 'transparent';
                this.style.color = '#6b7280';
            });
        }
    }
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
    const notificationIcon = document.getElementById('notificationIcon');
    if (notificationIcon) {
        notificationIcon.addEventListener('click', toggleNotificationDropdown);
    }

    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', goToCheckout);
    }

    const searchBtn = document.getElementById('searchBtn');
    const searchInput = document.getElementById('searchInput');
    if (searchBtn && searchInput) {
        searchBtn.addEventListener('click', performSearch);
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') performSearch();
        });
    }

    const becomeSellerLink = document.getElementById('becomeSellerLink');
    if (becomeSellerLink) {
        becomeSellerLink.addEventListener('click', (e) => {
            e.preventDefault();
            showToast('Seller registration coming soon!', 'info');
        });
    }

    window.addEventListener('scroll', handleNavbarScroll);
    
    // Close notification dropdown when clicking outside
    document.addEventListener('click', function(event) {
        const dropdown = document.getElementById('notificationDropdown');
        const notificationIcon = document.getElementById('notificationIcon');
        
        if (dropdown && !dropdown.classList.contains('hidden')) {
            if (!dropdown.contains(event.target) && !notificationIcon.contains(event.target)) {
                dropdown.classList.add('hidden');
            }
        }
    });
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
    window.location.href = 'checkout.html';
}

function performSearch() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;

    const query = searchInput.value.trim();
    if (!query) {
        showToast('Please enter a search term', 'warning');
        return;
    }

    window.location.href = `market.html?search=${encodeURIComponent(query)}`;
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

function initializeAnimations() {
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            once: true,
            offset: 100
        });
    }

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

// Make functions globally available
window.markNotificationAsRead = markNotificationAsRead;
window.copyToClipboard = copyToClipboard;

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

// ===================================
// DigiMarket Pro - project.js (PART 3)
// ===================================

// === UPDATE UI ON PAGE LOAD ===
function updateUI() {
    const userNameElements = document.querySelectorAll('#userName, #welcomeUserName');
    userNameElements.forEach(el => {
        if (el && appState.user) {
            el.textContent = appState.user.name || 'User';
        } else if (el) {
            el.textContent = 'User';
        }
    });

    updateCartUI();
    updateWishlistUI();
    updateNotificationUI();

    const currentPage = window.location.pathname;

    if (currentPage.includes('home.html') || currentPage === '/') {
        loadHomePage();
    } else if (currentPage.includes('market.html')) {
        loadMarketplacePage();
    } else if (currentPage.includes('cart.html')) {
        renderCartItems();
    } else if (currentPage.includes('checkout.html')) {
        loadCheckoutPage();
    }
}

function loadHomePage() {
    const featuredContainer = document.getElementById('featuredProductsContainer');
    if (featuredContainer && appState.products.length > 0) {
        const featured = appState.products.slice(0, 6);
        featuredContainer.innerHTML = featured.map(product => `
            <div class="swiper-slide">
                ${createProductCard(product).replace('<div class="col-lg-4 col-md-6 col-sm-12">', '').replace('</div>', '')}
            </div>
        `).join('');
    }

    const cartItemsCountEl = document.getElementById('cartItemsCount');
    if (cartItemsCountEl) cartItemsCountEl.textContent = appState.cart.length;
    const totalPurchasesEl = document.getElementById('totalPurchases');
    if (totalPurchasesEl) totalPurchasesEl.textContent = '0';
    const totalDownloadsEl = document.getElementById('totalDownloads');
    if (totalDownloadsEl) totalDownloadsEl.textContent = '0';
}

function loadMarketplacePage() {
    const params = new URLSearchParams(window.location.search);
    const q = params.get('search');
    if (q) {
        const searchInput = document.getElementById('searchInput');
        if (searchInput) searchInput.value = q;
    }

    renderProducts(appState.products, 'productsContainer');
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

        if (categoryFilter && categoryFilter.value !== 'all') {
            filtered = filtered.filter(p => p.category === categoryFilter.value);
        }

        if (priceFilter && priceFilter.value !== 'all') {
            const [min, max] = priceFilter.value.split('-').map(Number);
            filtered = filtered.filter(p => p.price >= min && (max ? p.price <= max : true));
        }

        if (ratingFilter && ratingFilter.value !== '0') {
            const minRating = parseFloat(ratingFilter.value);
            filtered = filtered.filter(p => parseFloat(p.rating) >= minRating);
        }

        if (searchInput && searchInput.value) {
            const query = searchInput.value.toLowerCase();
            filtered = filtered.filter(p =>
                p.name.toLowerCase().includes(query) ||
                p.description.toLowerCase().includes(query)
            );
        }

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

    applyFilters();
}

function loadCheckoutPage() {
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

    const emailInput = document.getElementById('email');
    if (emailInput && appState.user) {
        emailInput.value = appState.user.email || '';
    }

    updateOrderSummary();

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

    const orders = JSON.parse(localStorage.getItem('digimarket_orders') || '[]');
    orders.push(order);
    localStorage.setItem('digimarket_orders', JSON.stringify(orders));
    localStorage.setItem('digimarket_current_order', JSON.stringify(order));

    appState.cart = [];
    saveToLocalStorage();

    window.location.href = 'confirm-payment.html';
}

// === LOGOUT HELPER ===
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

// === LIVE CHAT ===
function ensureLiveChat() {
    if (document.getElementById('liveChatBtn')) return;

    const body = document.body;

    const chatBtn = document.createElement('button');
    chatBtn.id = 'liveChatBtn';
    chatBtn.title = 'Live chat';
    chatBtn.className = 'live-chat-btn';
    chatBtn.style.cssText = 'position: fixed; right: 20px; bottom: 20px; z-index: 9999; border-radius: 50px; padding: 12px 14px; background: #007bff; color: #fff; border: none; box-shadow: 0 6px 18px rgba(0,0,0,0.15);';
    chatBtn.innerHTML = '<i class="fas fa-comments"></i>';

    const chatWindow = document.createElement('div');
    chatWindow.id = 'chatWindow';
    chatWindow.style.cssText = 'position: fixed; right: 20px; bottom: 80px; width: 320px; max-height: 420px; display: none; flex-direction: column; background: #fff; border-radius: 8px; box-shadow: 0 8px 30px rgba(0,0,0,0.2); overflow: hidden; z-index: 9999;';

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

        setTimeout(() => {
            const agent = document.createElement('div');
            agent.style.margin = '6px 0';
            agent.style.textAlign = 'left';
            agent.innerHTML = `<div style="display:inline-block;background:#f1f1f1;padding:8px;border-radius:8px;">Support: Thanks – we'll get back shortly.</div>`;
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

// Final initialization
document.addEventListener('DOMContentLoaded', () => {
    ensureLogoutBinding();
    ensureLiveChat();
    setupNotificationClose();
});