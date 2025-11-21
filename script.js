// Initialize AOS Animation
AOS.init({
    duration: 1000,
    once: true,
    offset: 100
});

// Enhanced Sample Products Data with Real Images and Videos
const sampleProducts = [
    {
        id: 1,
        name: "Social Media Automation API",
        category: "apis",
        price: 149,
        description: "Powerful API for automating social media posts, scheduling, and analytics. Supports all major platforms including Facebook, Twitter, Instagram, and LinkedIn.",
        icon: "fa-share-nodes",
        hasDemo: true,
        image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80&fit=crop",
        videoUrl: "https://www.youtube.com/embed/GhQdlIFylQ8",
        rating: 4.8,
        reviews: 124
    },
    {
        id: 2,
        name: "AI Content Generation Tool",
        category: "ai-tools",
        price: 199,
        description: "Advanced AI-powered tool that generates high-quality content for blogs, social media, and marketing materials. Uses GPT-4 technology.",
        icon: "fa-wand-magic-sparkles",
        hasDemo: true,
        image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80&fit=crop",
        videoUrl: "https://www.youtube.com/embed/aircAruvnKk",
        rating: 4.9,
        reviews: 342
    },
    {
        id: 3,
        name: "Ultimate React Masterclass",
        category: "courses",
        price: 129,
        description: "Complete React course from beginner to advanced. Includes hooks, Redux, Next.js, and real-world projects. 40+ hours of content.",
        icon: "fa-graduation-cap",
        hasDemo: false,
        image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80&fit=crop",
        videoUrl: null,
        rating: 4.7,
        reviews: 856
    },
    {
        id: 4,
        name: "E-Commerce Website Template",
        category: "websites",
        price: 99,
        description: "Modern, responsive e-commerce template with shopping cart, payment integration, and admin dashboard. Built with HTML, CSS, and JavaScript.",
        icon: "fa-store",
        hasDemo: true,
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80&fit=crop",
        videoUrl: "https://www.youtube.com/embed/UB1O30fR-EE",
        rating: 4.6,
        reviews: 203
    },
    {
        id: 5,
        name: "Task Management App",
        category: "apps",
        price: 179,
        description: "Full-featured task management application with team collaboration, deadlines, and progress tracking. Works on web and mobile.",
        icon: "fa-tasks",
        hasDemo: true,
        image: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&q=80&fit=crop",
        videoUrl: "https://www.youtube.com/embed/fis26HvvDII",
        rating: 4.8,
        reviews: 167
    },
    {
        id: 6,
        name: "Email Marketing API",
        category: "apis",
        price: 139,
        description: "Robust email marketing API with templates, automation, analytics, and subscriber management. Easy integration.",
        icon: "fa-envelope",
        hasDemo: true,
        image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&q=80&fit=crop",
        videoUrl: "https://www.youtube.com/embed/94gHaHKmD4Q",
        rating: 4.7,
        reviews: 289
    },
    {
        id: 7,
        name: "AI Image Generator",
        category: "ai-tools",
        price: 189,
        description: "Create stunning images from text descriptions using advanced AI. Perfect for designers, marketers, and content creators.",
        icon: "fa-image",
        hasDemo: true,
        image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&q=80",
        videoUrl: "https://www.youtube.com/embed/GhQdlIFylQ8",
        rating: 4.9,
        reviews: 512
    },
    {
        id: 8,
        name: "JavaScript Full Stack Course",
        category: "courses",
        price: 159,
        description: "Master full-stack development with Node.js, Express, MongoDB, and React. Build 10 complete projects.",
        icon: "fa-code",
        hasDemo: false,
        image: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800&q=80&fit=crop",
        videoUrl: null,
        rating: 4.8,
        reviews: 673
    }
];
 

// Store products in localStorage if not exists
if (!localStorage.getItem('products')) {
    localStorage.setItem('products', JSON.stringify(sampleProducts));
}

// Initialize cart, orders, and search tracking
if (!localStorage.getItem('cart')) {
    localStorage.setItem('cart', JSON.stringify([]));
}
if (!localStorage.getItem('orders')) {
    localStorage.setItem('orders', JSON.stringify([]));
}
if (!localStorage.getItem('searchTerms')) {
    localStorage.setItem('searchTerms', JSON.stringify({}));
}

// Lazy loading for images
document.addEventListener('DOMContentLoaded', function() {
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => imageObserver.observe(img));
    }
});

// Check authentication status
function checkAuth() {
    const user = localStorage.getItem('currentUser');
    if (!user) {
        $('#loginPage').removeClass('hidden');
        $('#registerPage').addClass('hidden');
        $('#mainWebsite').addClass('hidden');
    } else {
        $('#loginPage').addClass('hidden');
        $('#registerPage').addClass('hidden');
        $('#mainWebsite').removeClass('hidden');
        showPage('home');
        updateCartCount();
        updateDashboardStats();
    }
}

// Login Form Handler
$('#loginForm').on('submit', function(e) {
    e.preventDefault();
    const email = $('#loginEmail').val().trim();
    const password = $('#loginPassword').val();
    
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        localStorage.setItem('currentUser', JSON.stringify(user));
        alert('Login successful! Welcome back, ' + user.name);
        checkAuth();
    } else {
        alert('Invalid email or password. Please try again.');
    }
});

// Register Form Handler
$('#registerForm').on('submit', function(e) {
    e.preventDefault();
    const name = $('#registerName').val().trim();
    const email = $('#registerEmail').val().trim();
    const password = $('#registerPassword').val();
    const accountType = $('#accountType').val();
    
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    if (users.find(u => u.email === email)) {
        alert('Email already registered. Please use a different email or login.');
        return;
    }
    
    const isAdmin = users.length === 0;
    
    const newUser = { 
        name, 
        email, 
        password, 
        accountType: isAdmin ? 'admin' : accountType, 
        id: Date.now(),
        isAdmin: isAdmin
    };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    if (isAdmin) {
        alert('Registration successful! You are now the ADMIN/OWNER of this site. 🎉');
    } else {
        alert('Registration successful! Please login to continue.');
    }
    $('#showLogin').click();
});

// Show Login/Register Pages
$('#showRegister').on('click', function(e) {
    e.preventDefault();
    $('#loginPage').addClass('hidden');
    $('#registerPage').removeClass('hidden');
});

$('#showLogin').on('click', function(e) {
    e.preventDefault();
    $('#registerPage').addClass('hidden');
    $('#loginPage').removeClass('hidden');
});

// Logout Handler
$('#logoutLink').on('click', function(e) {
    e.preventDefault();
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('currentUser');
        checkAuth();
    }
});

// Navigation Functions
function showPage(page) {
    $('#homePage, #browsePage, #dashboardPage').addClass('hidden');
    
    switch(page) {
        case 'home':
            $('#homePage').removeClass('hidden');
            loadFeaturedProducts();
            break;
        case 'browse':
            $('#browsePage').removeClass('hidden');
            loadBrowseProducts();
            break;
        case 'dashboard':
            $('#dashboardPage').removeClass('hidden');
            loadDashboardSection('overview');
            break;
    }
    
    // Smooth scroll to top
    $('html, body').animate({ scrollTop: 0 }, 300);
}

// Navigation Click Handlers
$('#logoLink, #homeLink').on('click', function(e) {
    e.preventDefault();
    showPage('home');
});

$('#browseLink').on('click', function(e) {
    e.preventDefault();
    showPage('browse');
});

$('#dashboardLink').on('click', function(e) {
    e.preventDefault();
    showPage('dashboard');
});

$('#becomeSellerLink').on('click', function(e) {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (user.accountType === 'seller' || user.isAdmin) {
        showPage('dashboard');
    } else {
        if (confirm('Would you like to upgrade to a seller account? This will allow you to add and manage products.')) {
            user.accountType = 'seller';
            localStorage.setItem('currentUser', JSON.stringify(user));
            const users = JSON.parse(localStorage.getItem('users'));
            const userIndex = users.findIndex(u => u.id === user.id);
            users[userIndex] = user;
            localStorage.setItem('users', JSON.stringify(users));
            alert('Your account has been upgraded to seller! 🎉');
            showPage('dashboard');
        }
    }
});

// Load Featured Products with Swiper
function loadFeaturedProducts() {
    const products = JSON.parse(localStorage.getItem('products'));
    const container = $('#featuredProductsContainer');
    container.empty();
    
    products.forEach(product => {
        const productCard = createProductCard(product);
        container.append(`<div class="swiper-slide">${productCard}</div>`);
    });
    
    // Initialize Swiper
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
            }
        },
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        }
    });
}

// Load Browse Products
function loadBrowseProducts() {
    const products = JSON.parse(localStorage.getItem('products'));
    const container = $('#browseProductsContainer');
    container.empty();
    
    if (products.length === 0) {
        container.html('<div class="col-12 text-center"><p>No products available yet.</p></div>');
        return;
    }
    
    products.forEach(product => {
        const productCard = createProductCard(product);
        container.append(`<div class="col-md-6 col-lg-4">${productCard}</div>`);
    });
}

// Create Product Card with Images
function createProductCard(product) {
    const stars = generateStars(product.rating);
    return `
        <div class="product-card" data-product-id="${product.id}">
            <div class="product-image-container">
                <img src="${product.image}" alt="${product.name}" class="product-img" loading="lazy">
                <div class="product-badge">${product.hasDemo ? 'Live Demo' : 'View Course'}</div>
            </div>
            <div class="product-body">
                <span class="product-category">${product.category}</span>
                <h5 class="product-title">${product.name}</h5>
                <div class="product-rating">
                    ${stars}
                    <span class="rating-text">${product.rating} (${product.reviews} reviews)</span>
                </div>
                <p class="product-description">${product.description.substring(0, 100)}...</p>
                <div class="product-price">$${product.price}</div>
                <button class="btn btn-primary-custom btn-sm view-details-btn" data-product-id="${product.id}">
                    ${product.hasDemo ? '<i class="fas fa-play"></i> Watch Demo' : '<i class="fas fa-eye"></i> View Details'}
                </button>
            </div>
        </div>
    `;
}

// Generate Star Rating
function generateStars(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= Math.floor(rating)) {
            stars += '<i class="fas fa-star"></i>';
        } else if (i - 0.5 <= rating) {
            stars += '<i class="fas fa-star-half-alt"></i>';
        } else {
            stars += '<i class="far fa-star"></i>';
        }
    }
    return `<div class="stars-display">${stars}</div>`;
}

// View Product Details with Enhanced Modal
$(document).on('click', '.view-details-btn', function(e) {
    e.stopPropagation();
    const productId = $(this).data('product-id');
    showProductModal(productId);
});

$(document).on('click', '.product-card', function(e) {
    if (!$(e.target).hasClass('btn') && !$(e.target).closest('button').length) {
        const productId = $(this).data('product-id');
        showProductModal(productId);
    }
});

// Show Enhanced Product Modal
function showProductModal(productId) {
    const products = JSON.parse(localStorage.getItem('products'));
    const product = products.find(p => p.id === productId);
    
    if (!product) return;
    
    const stars = generateStars(product.rating);
    
    let modalContent = `
        <div class="modal fade" id="productModal" tabindex="-1">
            <div class="modal-dialog modal-xl">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">${product.name}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                            <div class="col-md-6">
                                ${product.hasDemo && product.videoUrl ? `
                                    <div class="video-container">
                                        <iframe src="${product.videoUrl}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                                    </div>
                                ` : `
                                    <img src="${product.image}" alt="${product.name}" class="img-fluid product-detail-img">
                                `}
                                
                                <div class="trust-badges mt-3">
                                    <img src="https://cdn-icons-png.flaticon.com/128/825/825561.png" alt="Secure" class="badge-img">
                                    <img src="https://cdn-icons-png.flaticon.com/128/1705/1705471.png" alt="Money Back" class="badge-img">
                                    <img src="https://cdn-icons-png.flaticon.com/128/2991/2991148.png" alt="24/7 Support" class="badge-img">
                                </div>
                            </div>
                            <div class="col-md-6">
                                <span class="product-category">${product.category}</span>
                                <h3 class="mt-2">${product.name}</h3>
                                <div class="product-rating mb-3">
                                    ${stars}
                                    <span class="rating-text">${product.rating} (${product.reviews} reviews)</span>
                                </div>
                                <p class="product-full-description">${product.description}</p>
                                
                                <div class="product-features">
                                    <h5>Key Features:</h5>
                                    <ul>
                                        <li><i class="fas fa-check-circle text-success"></i> Full source code included</li>
                                        <li><i class="fas fa-check-circle text-success"></i> Lifetime updates</li>
                                        <li><i class="fas fa-check-circle text-success"></i> 24/7 customer support</li>
                                        <li><i class="fas fa-check-circle text-success"></i> Money-back guarantee</li>
                                        <li><i class="fas fa-check-circle text-success"></i> Commercial license</li>
                                    </ul>
                                </div>
                                
                                <div class="price-section">
                                    <h2 class="text-primary">$${product.price}</h2>
                                    <p class="text-muted">One-time payment</p>
                                </div>
                                
                                <button class="btn btn-primary-custom btn-lg w-100 mb-2" id="addToCartModalBtn" data-product-id="${product.id}">
                                    <i class="fas fa-shopping-cart"></i> Add to Cart
                                </button>
                                <button class="btn btn-outline-primary btn-lg w-100" onclick="addToWishlist(${product.id})">
                                    <i class="fas fa-heart"></i> Add to Wishlist
                                </button>
                            </div>
                        </div>
                        
                        <div class="row mt-4">
                            <div class="col-12">
                                <div class="customer-reviews">
                                    <h4>Customer Reviews</h4>
                                    ${generateReviews(product)}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Remove any existing modals first
    $('#productModal').remove();
    
    $('body').append(modalContent);
    const modal = new bootstrap.Modal(document.getElementById('productModal'));
    modal.show();
    
    $('#productModal').on('hidden.bs.modal', function () {
        $(this).remove();
    });
    
    $('#addToCartModalBtn').on('click', function() {
        const productId = $(this).data('product-id');
        addToCartFunction(productId);
    });
}

// Generate Customer Reviews
function generateReviews(product) {
    const reviews = [
        { name: "John Smith", rating: 5, comment: "Excellent product! Exactly what I needed.", avatar: "1" },
        { name: "Sarah Johnson", rating: 5, comment: "Great value for money. Highly recommended!", avatar: "5" },
        { name: "Mike Davis", rating: 4, comment: "Very good quality. Fast delivery and support.", avatar: "8" }
    ];
    
    return reviews.map(review => `
        <div class="review-item">
            <div class="review-header">
                <img src="https://i.pravatar.cc/60?img=${review.avatar}" alt="${review.name}" class="review-avatar">
                <div>
                    <h6>${review.name}</h6>
                    <div class="stars-display small">${generateStars(review.rating)}</div>
                </div>
            </div>
            <p class="review-text">${review.comment}</p>
        </div>
    `).join('');
}

// Add to Cart Function
function addToCartFunction(productId) {
    const products = JSON.parse(localStorage.getItem('products'));
    const product = products.find(p => p.id === productId);
    
    if (!product) {
        alert('Product not found!');
        return;
    }
    
    const cart = JSON.parse(localStorage.getItem('cart'));
    
    if (cart.find(item => item.id === productId)) {
        alert('This product is already in your cart!');
        return;
    }
    
    cart.push(product);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    alert('Product added to cart successfully! 🛒');
}

// Add to Wishlist
window.addToWishlist = function(productId) {
    const wishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
    if (!wishlist.includes(productId)) {
        wishlist.push(productId);
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        alert('Added to wishlist! ❤️');
    } else {
        alert('Already in wishlist!');
    }
};

// Update Cart Count
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart'));
    $('#cartCount').text(cart.length);
}

// Enhanced Cart Modal with Checkout Progress
$('#cartIcon').on('click', function() {
    const cart = JSON.parse(localStorage.getItem('cart'));
    
    if (cart.length === 0) {
        alert('Your cart is empty! Browse products to add items.');
        return;
    }
    
    let cartHTML = `
        <div class="modal fade" id="cartModal" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title"><i class="fas fa-shopping-cart"></i> Shopping Cart (${cart.length} items)</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="checkout-progress">
                            <div class="progress-step active">
                                <div class="step-number">1</div>
                                <div class="step-label">Cart</div>
                            </div>
                            <div class="progress-line"></div>
                            <div class="progress-step">
                                <div class="step-number">2</div>
                                <div class="step-label">Checkout</div>
                            </div>
                            <div class="progress-line"></div>
                            <div class="progress-step">
                                <div class="step-number">3</div>
                                <div class="step-label">Complete</div>
                            </div>
                        </div>
                        
                        <div class="cart-items">
                            ${cart.map(item => `
                                <div class="cart-item" data-item-id="${item.id}">
                                    <img src="${item.image}" alt="${item.name}" class="cart-item-img">
                                    <div class="cart-item-details">
                                        <h6>${item.name}</h6>
                                        <p class="text-muted">${item.category}</p>
                                    </div>
                                    <div class="cart-item-price">
                                        <strong>$${item.price}</strong>
                                    </div>
                                    <button class="btn btn-sm btn-danger remove-from-cart" data-product-id="${item.id}">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </div>
                            `).join('')}
                        </div>
                        
                        <div class="cart-summary">
                            <div class="summary-row">
                                <span>Subtotal:</span>
                                <span>$${cart.reduce((sum, item) => sum + item.price, 0)}</span>
                            </div>
                            <div class="summary-row">
                                <span>Tax:</span>
                                <span>$0</span>
                            </div>
                            <div class="summary-row total">
                                <span>Total:</span>
                                <span>$${cart.reduce((sum, item) => sum + item.price, 0)}</span>
                            </div>
                        </div>
                        
                        <button class="btn btn-primary-custom btn-lg w-100" onclick="proceedToCheckout()">
                            <i class="fas fa-lock"></i> Proceed to Secure Checkout
                        </button>
                        
                        <div class="security-info mt-3">
                            <i class="fas fa-shield-alt text-success"></i>
                            <small class="text-muted">Secure SSL encrypted payment</small>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Remove existing modal if any
    $('#cartModal').remove();
    
    $('body').append(cartHTML);
    const modal = new bootstrap.Modal(document.getElementById('cartModal'));
    modal.show();
    
    $('#cartModal').on('hidden.bs.modal', function () {
        $(this).remove();
    });
});

// Remove from Cart
$(document).on('click', '.remove-from-cart', function() {
    const productId = $(this).data('product-id');
    let cart = JSON.parse(localStorage.getItem('cart'));
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    
    $(this).closest('.cart-item').fadeOut(300, function() { 
        $(this).remove(); 
        
        // Update summary
        const remainingCart = JSON.parse(localStorage.getItem('cart'));
        if (remainingCart.length === 0) {
            const modalInstance = bootstrap.Modal.getInstance(document.getElementById('cartModal'));
            if (modalInstance) {
                modalInstance.hide();
            }
        } else {
            // Update total
            const newTotal = remainingCart.reduce((sum, item) => sum + item.price, 0);
            $('.cart-summary .summary-row').eq(0).find('span:last').text('$' + newTotal);
            $('.cart-summary .summary-row.total').find('span:last').text('$' + newTotal);
            $('.modal-title').html(`<i class="fas fa-shopping-cart"></i> Shopping Cart (${remainingCart.length} items)`);
        }
    });
});

// Proceed to Checkout
window.proceedToCheckout = function() {
    const modalInstance = bootstrap.Modal.getInstance(document.getElementById('cartModal'));
    if (modalInstance) {
        modalInstance.hide();
    }
    checkout();
};

// Checkout Function
window.checkout = function() {
    const cart = JSON.parse(localStorage.getItem('cart'));
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    const user = JSON.parse(localStorage.getItem('currentUser'));
    
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const newOrder = {
        id: Date.now(),
        items: cart,
        total: total,
        date: new Date().toISOString(),
        status: 'Completed',
        customer: user.name,
        customerEmail: user.email
    };
    orders.push(newOrder);
    localStorage.setItem('orders', JSON.stringify(orders));
    
    localStorage.setItem('cart', JSON.stringify([]));
    updateCartCount();
    
    alert(`✅ Order placed successfully!\n\nOrder ID: #${newOrder.id}\nTotal: $${total}\n\nThank you for your purchase, ${user.name}!`);
    updateDashboardStats();
};

// Enhanced Search with Tracking
$('#searchBtn').on('click', function(e) {
    e.preventDefault();
    performSearch();
});

$('#searchInput').on('keypress', function(e) {
    if (e.which === 13) {
        e.preventDefault();
        performSearch();
    }
});

function performSearch() {
    const searchTerm = $('#searchInput').val().toLowerCase().trim();
    if (!searchTerm) {
        alert('Please enter a search term');
        return;
    }
    
    // Track search term
    const searchTerms = JSON.parse(localStorage.getItem('searchTerms') || '{}');
    searchTerms[searchTerm] = (searchTerms[searchTerm] || 0) + 1;
    localStorage.setItem('searchTerms', JSON.stringify(searchTerms));
    
    const products = JSON.parse(localStorage.getItem('products'));
    const filteredProducts = products.filter(p => 
        p.name.toLowerCase().includes(searchTerm) || 
        p.description.toLowerCase().includes(searchTerm) ||
        p.category.toLowerCase().includes(searchTerm)
    );
    
    showPage('browse');
    
    setTimeout(() => {
        const container = $('#browseProductsContainer');
        container.empty();
        
        if (filteredProducts.length === 0) {
            container.html(`
                <div class="col-12 text-center">
                    <i class="fas fa-search fa-4x text-muted mb-3"></i>
                    <h4>No products found for "${searchTerm}"</h4>
                    <p>Try different keywords or browse all products</p>
                </div>
            `);
        } else {
            filteredProducts.forEach(product => {
                const productCard = createProductCard(product);
                container.append(`<div class="col-md-6 col-lg-4">${productCard}</div>`);
            });
        }
    }, 100);
}

// Category Filter
$('#categoryFilter').on('change', function() {
    filterProducts();
});

$('#priceFilter').on('change', function() {
    filterProducts();
});

// Filter Products
function filterProducts() {
    const category = $('#categoryFilter').val();
    const priceRange = $('#priceFilter').val();
    
    let products = JSON.parse(localStorage.getItem('products'));
    
    if (category !== 'all') {
        products = products.filter(p => p.category === category);
    }
    
    if (priceRange !== 'all') {
        const [min, max] = priceRange.split('-').map(Number);
        products = products.filter(p => p.price >= min && p.price <= max);
    }
    
    const container = $('#browseProductsContainer');
    container.empty();
    
    if (products.length === 0) {
        container.html('<div class="col-12 text-center"><p>No products match your filters</p></div>');
    } else {
        products.forEach(product => {
            const productCard = createProductCard(product);
            container.append(`<div class="col-md-6 col-lg-4">${productCard}</div>`);
        });
    }
}

// Category Card Click
$(document).on('click', '.category-card', function() {
    const category = $(this).data('category');
    showPage('browse');
    
    setTimeout(() => {
        $('#categoryFilter').val(category).trigger('change');
    }, 100);
});

// Notification Icon Click
$('#notificationIcon').on('click', function(e) {
    e.stopPropagation();
    $('#notificationDropdown').toggleClass('hidden');
});

// Close notification dropdown when clicking outside
$(document).on('click', function(e) {
    if (!$(e.target).closest('#notificationIcon, #notificationDropdown').length) {
        $('#notificationDropdown').addClass('hidden');
    }
});

// Dashboard Menu Navigation
$(document).on('click', '.dashboard-menu-item', function() {
    $('.dashboard-menu-item').removeClass('active');
    $(this).addClass('active');
    
    const section = $(this).data('section');
    loadDashboardSection(section);
});

// Load Dashboard Section
function loadDashboardSection(section) {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    const content = $('#dashboardContent');
    
    switch(section) {
        case 'overview':
            loadOverviewSection(content, user);
            break;
        case 'products':
            loadProductsSection(content, user);
            break;
        case 'orders':
            loadOrdersSection(content, user);
            break;
        case 'sales':
            loadSalesSection(content, user);
            break;
            case 'messages':
        loadMessagesSection(content, user);
        break;
        case 'settings':
            loadSettingsSection(content, user);
            break;
    }
}

// Overview Section
function loadOverviewSection(content, user) {
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const products = JSON.parse(localStorage.getItem('products'));
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const searchTerms = JSON.parse(localStorage.getItem('searchTerms') || '{}');
    
    const totalSales = orders.reduce((sum, order) => sum + order.total, 0);
    const totalOrders = orders.length;
    const totalProducts = products.length;
    const totalCustomers = users.length;
    
    // Get top search terms
    const topSearches = Object.entries(searchTerms)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);
    
    content.html(`
        <h2 class="mb-4">${user.isAdmin ? '🔒 Admin' : ''} Dashboard Overview</h2>
        ${user.isAdmin ? '<div class="alert alert-warning"><strong>ADMIN MODE:</strong> You have full control over the entire platform</div>' : ''}
        
        <div class="row">
            <div class="col-md-3 mb-4">
                <div class="stat-card">
                    <div class="stat-value">${totalSales}</div>
                    <div>Total Sales</div>
                </div>
            </div>
            <div class="col-md-3 mb-4">
                <div class="stat-card">
                    <div class="stat-value">${totalProducts}</div>
                    <div>Products</div>
                </div>
            </div>
            <div class="col-md-3 mb-4">
                <div class="stat-card">
                    <div class="stat-value">${totalOrders}</div>
                    <div>Orders</div>
                </div>
            </div>
            <div class="col-md-3 mb-4">
                <div class="stat-card">
                    <div class="stat-value">${totalCustomers}</div>
                    <div>Users</div>
                </div>
            </div>
        </div>
        
        <div class="row">
            <div class="col-md-8">
                <div class="dashboard-card">
                    <h4>Quick Actions</h4>
                    <button class="btn btn-primary-custom me-2 mb-2" onclick="$('.dashboard-menu-item[data-section=products]').click()">
                        <i class="fas fa-plus"></i> Add Product
                    </button>
                    <button class="btn btn-primary-custom me-2 mb-2" onclick="$('.dashboard-menu-item[data-section=orders]').click()">
                        <i class="fas fa-list"></i> View Orders
                    </button>
                    <button class="btn btn-primary-custom mb-2" onclick="$('.dashboard-menu-item[data-section=sales]').click()">
                        <i class="fas fa-chart-bar"></i> Sales Report
                    </button>
                </div>
            </div>
            <div class="col-md-4">
                <div class="dashboard-card">
                    <h4>Top Searches</h4>
                    ${topSearches.length > 0 ? `
                        <ul class="list-unstyled">
                            ${topSearches.map(([term, count]) => `
                                <li class="mb-2"><i class="fas fa-search text-primary"></i> ${term} <span class="badge badge-primary">${count}</span></li>
                            `).join('')}
                        </ul>
                    ` : '<p class="text-muted">No search data yet</p>'}
                </div>
            </div>
        </div>
        
        <div class="dashboard-card mt-4">
            <h4>Recent Activity</h4>
            <div class="table-responsive">
                <table class="table">
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Activity</th>
                            <th>Details</th>
                        </tr>
                    </thead>
                    <tbody id="activityTable">
                        ${orders.length > 0 ? orders.slice(-5).reverse().map(order => `
                            <tr>
                                <td>${new Date(order.date).toLocaleDateString()}</td>
                                <td><i class="fas fa-shopping-bag text-success"></i> New Order</td>
                                <td>Order #${order.id} - ${order.total}</td>
                            </tr>
                        `).join('') : '<tr><td colspan="3" class="text-center">No activity yet</td></tr>'}
                    </tbody>
                </table>
            </div>
        </div>
    `);
}

// Products Section
function loadProductsSection(content, user) {
    const products = JSON.parse(localStorage.getItem('products'));
    
    content.html(`
        <h2 class="mb-4">Manage Products</h2>
        
        <div class="dashboard-card">
            <h4>Add New Product</h4>
            <form id="addProductForm">
                <div class="row">
                    <div class="col-md-6 mb-3">
                        <label class="form-label">Product Name</label>
                        <input type="text" class="form-control" id="productName" required>
                    </div>
                    <div class="col-md-6 mb-3">
                        <label class="form-label">Category</label>
                        <select class="form-control" id="productCategory" required>
                            <option value="websites">Websites</option>
                            <option value="apps">Apps</option>
                            <option value="apis">APIs</option>
                            <option value="ai-tools">AI Tools</option>
                            <option value="courses">Courses</option>
                        </select>
                    </div>
                    <div class="col-md-6 mb-3">
                        <label class="form-label">Price ($)</label>
                        <input type="number" class="form-control" id="productPrice" min="1" required>
                    </div>
                    <div class="col-md-6 mb-3">
                        <label class="form-label">Has Live Demo?</label>
                        <select class="form-control" id="productHasDemo">
                            <option value="true">Yes</option>
                            <option value="false">No</option>
                        </select>
                    </div>
                    <div class="col-md-12 mb-3">
                        <label class="form-label">Image URL</label>
                        <input type="url" class="form-control" id="productImage" placeholder="https://example.com/image.jpg">
                    </div>
                    <div class="col-md-12 mb-3">
                        <label class="form-label">Video URL (YouTube embed)</label>
                        <input type="url" class="form-control" id="productVideo" placeholder="https://www.youtube.com/embed/...">
                    </div>
                    <div class="col-md-12 mb-3">
                        <label class="form-label">Description</label>
                        <textarea class="form-control" id="productDescription" rows="3" required></textarea>
                    </div>
                </div>
                <button type="submit" class="btn btn-primary-custom">
                    <i class="fas fa-plus"></i> Add Product
                </button>
            </form>
        </div>
        
        <div class="dashboard-card mt-4">
            <h4>All Products (${products.length})</h4>
            <div class="table-responsive">
                <table class="table">
                    <thead>
                        <tr>
                            <th>Image</th>
                            <th>Name</th>
                            <th>Category</th>
                            <th>Price</th>
                            <th>Rating</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${products.map(product => `
                            <tr>
                                <td><img src="${product.image}" alt="${product.name}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 5px;"></td>
                                <td>${product.name}</td>
                                <td><span class="badge badge-primary">${product.category}</span></td>
                                <td>${product.price}</td>
                                <td>${product.rating || 4.5} ⭐</td>
                                <td>
                                    <button class="btn btn-sm btn-danger delete-product-btn" data-product-id="${product.id}">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        </div>
    `);
    
    attachProductFormHandler();
}

// Orders Section
function loadOrdersSection(content, user) {
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    
    content.html(`
        <h2 class="mb-4">Manage Orders</h2>
        
        <div class="dashboard-card">
            <h4>All Orders (${orders.length})</h4>
            <div class="table-responsive">
                <table class="table">
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Date</th>
                            <th>Customer</th>
                            <th>Products</th>
                            <th>Total</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${orders.length === 0 ? 
                            '<tr><td colspan="7" class="text-center">No orders yet</td></tr>' :
                            orders.slice().reverse().map(order => `
                                <tr>
                                    <td>#${order.id}</td>
                                    <td>${new Date(order.date).toLocaleDateString()}</td>
                                    <td>${order.customer || 'Guest'}<br><small>${order.customerEmail || ''}</small></td>
                                    <td>${order.items.map(item => item.name).join(', ').substring(0, 50)}${order.items.map(item => item.name).join(', ').length > 50 ? '...' : ''}</td>
                                    <td>${order.total}</td>
                                    <td><span class="badge badge-success">${order.status}</span></td>
                                    <td>
                                        <button class="btn btn-sm btn-primary view-order-btn" data-order-id="${order.id}">
                                            <i class="fas fa-eye"></i>
                                        </button>
                                        ${user.isAdmin ? `
                                            <button class="btn btn-sm btn-danger delete-order-btn" data-order-id="${order.id}">
                                                <i class="fas fa-trash"></i>
                                            </button>
                                        ` : ''}
                                    </td>
                                </tr>
                            `).join('')
                        }
                    </tbody>
                </table>
            </div>
        </div>
    `);
}

// Sales Section
function loadSalesSection(content, user) {
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const products = JSON.parse(localStorage.getItem('products'));
    
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const averageOrderValue = orders.length > 0 ? (totalRevenue / orders.length).toFixed(2) : 0;
    
    const salesByCategory = {};
    orders.forEach(order => {
        order.items.forEach(item => {
            if (!salesByCategory[item.category]) {
                salesByCategory[item.category] = 0;
            }
            salesByCategory[item.category] += item.price;
        });
    });
    
    const productSales = {};
    orders.forEach(order => {
        order.items.forEach(item => {
            if (!productSales[item.id]) {
                productSales[item.id] = { name: item.name, count: 0, revenue: 0 };
            }
            productSales[item.id].count++;
            productSales[item.id].revenue += item.price;
        });
    });
    
    const bestSellers = Object.values(productSales).sort((a, b) => b.count - a.count).slice(0, 5);
    
    content.html(`
        <h2 class="mb-4">Sales Analytics</h2>
        
        <div class="row">
            <div class="col-md-4 mb-4">
                <div class="stat-card">
                    <div class="stat-value">${totalRevenue}</div>
                    <div>Total Revenue</div>
                </div>
            </div>
            <div class="col-md-4 mb-4">
                <div class="stat-card">
                    <div class="stat-value">${orders.length}</div>
                    <div>Total Orders</div>
                </div>
            </div>
            <div class="col-md-4 mb-4">
                <div class="stat-card">
                    <div class="stat-value">${averageOrderValue}</div>
                    <div>Average Order Value</div>
                </div>
            </div>
        </div>
        
        <div class="row">
            <div class="col-md-6">
                <div class="dashboard-card">
                    <h4>Sales by Category</h4>
                    <div class="table-responsive">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th>Category</th>
                                    <th>Revenue</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${Object.entries(salesByCategory).length > 0 ? Object.entries(salesByCategory).map(([category, revenue]) => `
                                    <tr>
                                        <td>${category}</td>
                                        <td>${revenue}</td>
                                    </tr>
                                `).join('') : '<tr><td colspan="2" class="text-center">No sales data</td></tr>'}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            
            <div class="col-md-6">
                <div class="dashboard-card">
                    <h4>Best Selling Products</h4>
                    <div class="table-responsive">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th>Product</th>
                                    <th>Sales</th>
                                    <th>Revenue</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${bestSellers.length > 0 ? 
                                    bestSellers.map(product => `
                                        <tr>
                                            <td>${product.name}</td>
                                            <td>${product.count}</td>
                                            <td>${product.revenue}</td>
                                        </tr>
                                    `).join('') :
                                    '<tr><td colspan="3" class="text-center">No sales data</td></tr>'
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    `);
} 

// Messages Section (Admin Only)
function loadMessagesSection(content, user) {
    const messages = JSON.parse(localStorage.getItem('chatMessages') || '[]');
    
    // Group messages by user
    const messagesByUser = {};
    messages.forEach(msg => {
        if (!messagesByUser[msg.userId]) {
            messagesByUser[msg.userId] = {
                userName: msg.userName,
                userEmail: msg.userEmail,
                messages: []
            };
        }
        messagesByUser[msg.userId].messages.push(msg);
    });
    
    content.html(`
        <h2 class="mb-4"><i class="fas fa-envelope"></i> Customer Messages</h2>
        
        <div class="dashboard-card">
            <h4>All Conversations (${Object.keys(messagesByUser).length})</h4>
            
            ${Object.keys(messagesByUser).length === 0 ? `
                <div class="text-center py-5">
                    <i class="fas fa-inbox fa-4x text-muted mb-3"></i>
                    <p class="text-muted">No messages yet</p>
                </div>
            ` : `
                <div class="table-responsive">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Customer</th>
                                <th>Email</th>
                                <th>Messages</th>
                                <th>Last Message</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${Object.entries(messagesByUser).map(([userId, data]) => {
                                const lastMsg = data.messages[data.messages.length - 1];
                                const unreadCount = data.messages.filter(m => !m.read && m.sender === 'user').length;
                                
                                return `
                                    <tr>
                                        <td>
                                            ${data.userName}
                                            ${unreadCount > 0 ? `<span class="badge badge-danger ms-2">${unreadCount} new</span>` : ''}
                                        </td>
                                        <td>${data.userEmail}</td>
                                        <td>${data.messages.length}</td>
                                        <td>
                                            <small>${lastMsg.message.substring(0, 50)}${lastMsg.message.length > 50 ? '...' : ''}</small>
                                            <br>
                                            <small class="text-muted">${formatChatTime(lastMsg.timestamp)}</small>
                                        </td>
                                        <td>
                                            <button class="btn btn-sm btn-primary view-conversation-btn" data-user-id="${userId}" data-user-name="${data.userName}">
                                                <i class="fas fa-eye"></i> View & Reply
                                            </button>
                                        </td>
                                    </tr>
                                `;
                            }).join('')}
                        </tbody>
                    </table>
                </div>
            `}
        </div>
    `);
    
    // View conversation button click
    $(document).on('click', '.view-conversation-btn', function() {
        const userId = parseInt($(this).data('user-id'));
        const userName = $(this).data('user-name');
        showConversationModal(userId, userName);
    });
}

// Show Conversation Modal (Admin)
function showConversationModal(userId, userName) {
    const messages = JSON.parse(localStorage.getItem('chatMessages') || '[]');
    const userMessages = messages.filter(msg => msg.userId === userId);
    
    // Mark all messages as read
    messages.forEach(msg => {
        if (msg.userId === userId && msg.sender === 'user') {
            msg.read = true;
        }
    });
    localStorage.setItem('chatMessages', JSON.stringify(messages));
    
    const modalHTML = `
        <div class="modal fade" id="conversationModal" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">
                            <i class="fas fa-comments"></i> Conversation with ${userName}
                        </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="chat-messages" id="adminChatMessages" style="max-height: 400px; overflow-y: auto; padding: 1rem; background: #f8fafc; border-radius: 10px; margin-bottom: 1rem;">
                            ${userMessages.map(msg => {
                                const messageClass = msg.sender === 'user' ? 'user' : 'admin';
                                const senderName = msg.sender === 'user' ? userName : 'You (Admin)';
                                
                                return `
                                    <div class="chat-message ${messageClass}" style="margin-bottom: 1rem;">
                                        <div class="message-sender" style="font-size: 0.75rem; color: #64748b; margin-bottom: 0.25rem; font-weight: 600;">${senderName}</div>
                                        <div class="message-bubble" style="max-width: 70%; padding: 0.75rem 1rem; border-radius: 15px; ${msg.sender === 'user' ? 'background: linear-gradient(135deg, var(--primary-color), var(--secondary-color)); color: white;' : 'background: white; color: var(--dark-color); box-shadow: 0 2px 5px rgba(0,0,0,0.1);'}">${escapeHtml(msg.message)}</div>
                                        <div class="message-time" style="font-size: 0.7rem; color: #94a3b8; margin-top: 0.25rem;">${formatChatTime(msg.timestamp)}</div>
                                    </div>
                                `;
                            }).join('')}
                        </div>
                        
                        <div class="input-group">
                            <input type="text" class="form-control" id="adminReplyInput" placeholder="Type your reply...">
                            <button class="btn btn-primary-custom" id="adminSendReplyBtn" data-user-id="${userId}">
                                <i class="fas fa-paper-plane"></i> Send Reply
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Remove existing modal
    $('#conversationModal').remove();
    
    $('body').append(modalHTML);
    const modal = new bootstrap.Modal(document.getElementById('conversationModal'));
    modal.show();
    
    // Scroll to bottom
    const chatContainer = document.getElementById('adminChatMessages');
    chatContainer.scrollTop = chatContainer.scrollHeight;
    
    $('#conversationModal').on('hidden.bs.modal', function () {
        $(this).remove();
        loadDashboardSection('messages');
    });
    
    // Send reply
    $('#adminSendReplyBtn').on('click', function() {
        sendAdminReply(userId);
    });
    
    $('#adminReplyInput').on('keypress', function(e) {
        if (e.which === 13) {
            sendAdminReply(userId);
        }
    });
}

// Send Admin Reply
function sendAdminReply(userId) {
    const input = $('#adminReplyInput');
    const message = input.val().trim();
    
    if (!message) return;
    
    const messages = JSON.parse(localStorage.getItem('chatMessages') || '[]');
    const user = messages.find(m => m.userId === userId);
    
    const newMessage = {
        id: Date.now(),
        userId: userId,
        userName: user.userName,
        userEmail: user.userEmail,
        sender: 'admin',
        message: message,
        timestamp: new Date().toISOString(),
        read: true
    };
    
    messages.push(newMessage);
    localStorage.setItem('chatMessages', JSON.stringify(messages));
    
    input.val('');
    
    // Reload conversation
    const userName = user.userName;
    $('#conversationModal').remove();
    showConversationModal(userId, userName);
}

// Settings Section
function loadSettingsSection(content, user) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    content.html(`
        <h2 class="mb-4">Settings</h2>
        
        <div class="dashboard-card">
            <h4>Account Information</h4>
            <form id="updateProfileForm">
                <div class="row">
                    <div class="col-md-6 mb-3">
                        <label class="form-label">Full Name</label>
                        <input type="text" class="form-control" id="settingsName" value="${user.name}" required>
                    </div>
                    <div class="col-md-6 mb-3">
                        <label class="form-label">Email</label>
                        <input type="email" class="form-control" id="settingsEmail" value="${user.email}" required>
                    </div>
                    <div class="col-md-6 mb-3">
                        <label class="form-label">Account Type</label>
                        <input type="text" class="form-control" value="${user.isAdmin ? 'Admin (Owner)' : user.accountType}" disabled>
                    </div>
                </div>
                <button type="submit" class="btn btn-primary-custom">
                    <i class="fas fa-save"></i> Update Profile
                </button>
            </form>
        </div>
        
        <div class="dashboard-card mt-4">
            <h4>Change Password</h4>
            <form id="changePasswordForm">
                <div class="row">
                    <div class="col-md-6 mb-3">
                        <label class="form-label">New Password</label>
                        <input type="password" class="form-control" id="newPassword" required>
                    </div>
                    <div class="col-md-6 mb-3">
                        <label class="form-label">Confirm Password</label>
                        <input type="password" class="form-control" id="confirmPassword" required>
                    </div>
                </div>
                <button type="submit" class="btn btn-primary-custom">
                    <i class="fas fa-key"></i> Change Password
                </button>
            </form>
        </div>
        
        ${user.isAdmin ? `
            <div class="dashboard-card mt-4">
                <h4>🔒 Admin Controls</h4>
                <p class="text-muted">As the site owner, you have full control over the platform</p>
                
                <div class="mb-3">
                    <h5>All Registered Users (${users.length})</h5>
                    <div class="table-responsive">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Account Type</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${users.map(u => `
                                    <tr>
                                        <td>${u.name}</td>
                                        <td>${u.email}</td>
                                        <td><span class="badge ${u.isAdmin ? 'badge-warning' : 'badge-primary'}">${u.isAdmin ? 'Admin' : u.accountType}</span></td>
                                        <td>
                                            ${!u.isAdmin ? `
                                                <button class="btn btn-sm btn-danger delete-user-btn" data-user-id="${u.id}">
                                                    <i class="fas fa-trash"></i> Delete
                                                </button>
                                            ` : '<span class="text-muted">Owner</span>'}
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
                
                <div class="mt-4">
                    <h5>Danger Zone</h5>
                    <button class="btn btn-danger me-2" onclick="clearAllData()">
                        <i class="fas fa-exclamation-triangle"></i> Clear All Data
                    </button>
                    <button class="btn btn-warning" onclick="exportData()">
                        <i class="fas fa-download"></i> Export Data
                    </button>
                </div>
            </div>
        ` : ''}
    `);
    
    attachSettingsFormHandlers();
}

// Update Dashboard Stats
function updateDashboardStats() {
    const currentSection = $('.dashboard-menu-item.active').data('section');
    if (currentSection) {
        loadDashboardSection(currentSection);
    }
}

// Attach Product Form Handler
function attachProductFormHandler() {
    $('#addProductForm').off('submit').on('submit', function(e) {
        e.preventDefault();
        
        const name = $('#productName').val().trim();
        const category = $('#productCategory').val();
        const price = parseInt($('#productPrice').val());
        const description = $('#productDescription').val().trim();
        const hasDemo = $('#productHasDemo').val() === 'true';
        const image = $('#productImage').val().trim() || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80';
        const videoUrl = $('#productVideo').val().trim() || null;
        
        const products = JSON.parse(localStorage.getItem('products'));
        
        const icons = {
            'websites': 'fa-globe',
            'apps': 'fa-mobile-alt',
            'apis': 'fa-code',
            'ai-tools': 'fa-robot',
            'courses': 'fa-graduation-cap'
        };
        
        const newProduct = {
            id: Date.now(),
            name,
            category,
            price,
            description,
            icon: icons[category],
            hasDemo: hasDemo,
            image: image,
            videoUrl: videoUrl,
            rating: 4.5,
            reviews: 0
        };
        
        products.push(newProduct);
        localStorage.setItem('products', JSON.stringify(products));
        
        alert('Product added successfully! 🎉');
        loadDashboardSection('products');
    });
}

// Delete Product
$(document).on('click', '.delete-product-btn', function() {
    if (!confirm('Are you sure you want to delete this product?')) return;
    
    const productId = $(this).data('product-id');
    let products = JSON.parse(localStorage.getItem('products'));
    products = products.filter(p => p.id !== productId);
    localStorage.setItem('products', JSON.stringify(products));
    
    alert('Product deleted successfully!');
    loadDashboardSection('products');
});

// View Order Details
$(document).on('click', '.view-order-btn', function() {
    const orderId = $(this).data('order-id');
    const orders = JSON.parse(localStorage.getItem('orders'));
    const order = orders.find(o => o.id === orderId);
    
    if (!order) return;
    
    let orderHTML = `
        <div class="modal fade" id="orderModal" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Order #${order.id}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <p><strong>Date:</strong> ${new Date(order.date).toLocaleString()}</p>
                        <p><strong>Customer:</strong> ${order.customer || 'Guest'}</p>
                        <p><strong>Email:</strong> ${order.customerEmail || 'N/A'}</p>
                        <p><strong>Status:</strong> <span class="badge badge-success">${order.status}</span></p>
                        
                        <h5 class="mt-3">Order Items:</h5>
                        <div class="table-responsive">
                            <table class="table">
                                <thead>
                                    <tr>
                                        <th>Product</th>
                                        <th>Category</th>
                                        <th>Price</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${order.items.map(item => `
                                        <tr>
                                            <td>${item.name}</td>
                                            <td>${item.category}</td>
                                            <td>${item.price}</td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                        
                        <h4 class="text-end">Total: ${order.total}</h4>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Remove existing modal
    $('#orderModal').remove();
    
    $('body').append(orderHTML);
    const modal = new bootstrap.Modal(document.getElementById('orderModal'));
    modal.show();
    
    $('#orderModal').on('hidden.bs.modal', function () {
        $(this).remove();
    });
});

// Delete Order
$(document).on('click', '.delete-order-btn', function() {
    if (!confirm('Are you sure you want to delete this order?')) return;
    
    const orderId = $(this).data('order-id');
    let orders = JSON.parse(localStorage.getItem('orders'));
    orders = orders.filter(o => o.id !== orderId);
    localStorage.setItem('orders', JSON.stringify(orders));
    
    alert('Order deleted successfully!');
    loadDashboardSection('orders');
});

// Attach Settings Form Handlers
function attachSettingsFormHandlers() {
    $('#updateProfileForm').off('submit').on('submit', function(e) {
        e.preventDefault();
        
        const name = $('#settingsName').val().trim();
        const email = $('#settingsEmail').val().trim();
        
        let user = JSON.parse(localStorage.getItem('currentUser'));
        user.name = name;
        user.email = email;
        
        localStorage.setItem('currentUser', JSON.stringify(user));
        
        let users = JSON.parse(localStorage.getItem('users'));
        const userIndex = users.findIndex(u => u.id === user.id);
        if (userIndex !== -1) {
            users[userIndex] = user;
            localStorage.setItem('users', JSON.stringify(users));
        }
        
        alert('Profile updated successfully! ✅');
    });
    
    $('#changePasswordForm').off('submit').on('submit', function(e) {
        e.preventDefault();
        
        const newPassword = $('#newPassword').val();
        const confirmPassword = $('#confirmPassword').val();
        
        if (newPassword !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }
        
        if (newPassword.length < 6) {
            alert('Password must be at least 6 characters long');
            return;
        }
        
        let user = JSON.parse(localStorage.getItem('currentUser'));
        user.password = newPassword;
        
        localStorage.setItem('currentUser', JSON.stringify(user));
        
        let users = JSON.parse(localStorage.getItem('users'));
        const userIndex = users.findIndex(u => u.id === user.id);
        if (userIndex !== -1) {
            users[userIndex] = user;
            localStorage.setItem('users', JSON.stringify(users));
        }
        
        alert('Password changed successfully! ✅');
        this.reset();
    });
}

// Delete User
$(document).on('click', '.delete-user-btn', function() {
    if (!confirm('Are you sure you want to delete this user?')) return;
    
    const userId = $(this).data('user-id');
    let users = JSON.parse(localStorage.getItem('users'));
    users = users.filter(u => u.id !== userId);
    localStorage.setItem('users', JSON.stringify(users));
    
    alert('User deleted successfully!');
    loadDashboardSection('settings');
});

// Clear All Data
window.clearAllData = function() {
    if (!confirm('⚠️ WARNING: This will delete ALL data including products, orders, and users (except you). Are you absolutely sure?')) return;
    
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    localStorage.setItem('products', JSON.stringify(sampleProducts));
    localStorage.setItem('orders', JSON.stringify([]));
    localStorage.setItem('cart', JSON.stringify([]));
    localStorage.setItem('users', JSON.stringify([currentUser]));
    localStorage.setItem('searchTerms', JSON.stringify({}));
    localStorage.setItem('wishlist', JSON.stringify([]));
    
    alert('All data has been cleared and reset to default! 🔄');
    location.reload();
};

// Export Data
window.exportData = function() {
    const data = {
        products: JSON.parse(localStorage.getItem('products')),
        orders: JSON.parse(localStorage.getItem('orders')),
        users: JSON.parse(localStorage.getItem('users')),
        searchTerms: JSON.parse(localStorage.getItem('searchTerms')),
        exportDate: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `digimarket-data-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
    
    alert('Data exported successfully! 📦');
};


// Initialize chat messages
if (!localStorage.getItem('chatMessages')) {
    localStorage.setItem('chatMessages', JSON.stringify([]));
}

// Live Chat Button Click
$('#liveChatBtn').on('click', function() {
    openChatModal();
});

// Open Chat Modal
function openChatModal() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    
    if (!user) {
        alert('Please login to use live chat!');
        return;
    }
    
    const chatHTML = `
        <div class="chat-modal" id="chatModal">
            <div class="chat-header">
                <h5><i class="fas fa-comments"></i> Live Chat Support</h5>
                <button class="chat-close-btn" id="closeChatBtn">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="chat-messages" id="chatMessages"></div>
            <div class="chat-input-area">
                <input type="text" class="chat-input" id="chatInput" placeholder="Type your message...">
                <button class="chat-send-btn" id="chatSendBtn">
                    <i class="fas fa-paper-plane"></i>
                </button>
            </div>
        </div>
    `;
    
    // Remove existing chat modal if any
    $('#chatModal').remove();
    
    $('body').append(chatHTML);
    loadChatMessages();
    
    // Close chat button
    $('#closeChatBtn').on('click', function() {
        $('#chatModal').remove();
    });
    
    // Send message on button click
    $('#chatSendBtn').on('click', function() {
        sendChatMessage();
    });
    
    // Send message on Enter key
    $('#chatInput').on('keypress', function(e) {
        if (e.which === 13) {
            sendChatMessage();
        }
    });
    
    // Focus input
    $('#chatInput').focus();
}

// Load Chat Messages
function loadChatMessages() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    const messages = JSON.parse(localStorage.getItem('chatMessages') || '[]');
    const container = $('#chatMessages');
    
    // Filter messages for current user or admin messages to everyone
    const userMessages = messages.filter(msg => 
        msg.userId === user.id || msg.sender === 'admin'
    );
    
    container.empty();
    
    if (userMessages.length === 0) {
        container.html(`
            <div class="chat-empty-state">
                <i class="fas fa-comments"></i>
                <p>Start a conversation with our support team!</p>
            </div>
        `);
    } else {
        userMessages.forEach(msg => {
            const messageClass = msg.sender === 'user' ? 'user' : 'admin';
            const senderName = msg.sender === 'user' ? 'You' : 'Support Team';
            
            container.append(`
                <div class="chat-message ${messageClass}">
                    <div class="message-sender">${senderName}</div>
                    <div class="message-bubble">${escapeHtml(msg.message)}</div>
                    <div class="message-time">${formatChatTime(msg.timestamp)}</div>
                </div>
            `);
        });
        
        // Scroll to bottom
        container.scrollTop(container[0].scrollHeight);
    }
}

// Send Chat Message
function sendChatMessage() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    const input = $('#chatInput');
    const message = input.val().trim();
    
    if (!message) return;
    
    const messages = JSON.parse(localStorage.getItem('chatMessages') || '[]');
    
    const newMessage = {
        id: Date.now(),
        userId: user.id,
        userName: user.name,
        userEmail: user.email,
        sender: 'user',
        message: message,
        timestamp: new Date().toISOString(),
        read: false
    };
    
    messages.push(newMessage);
    localStorage.setItem('chatMessages', JSON.stringify(messages));
    
    input.val('');
    loadChatMessages();
    
    // Show success feedback
    showChatNotification('Message sent! Our team will respond soon.');
}

// Show Chat Notification
function showChatNotification(message) {
    const notification = $(`
        <div style="position: fixed; top: 80px; right: 20px; background: var(--success-color); color: white; padding: 1rem 1.5rem; border-radius: 10px; box-shadow: 0 5px 15px rgba(0,0,0,0.2); z-index: 9999; animation: fadeIn 0.3s;">
            <i class="fas fa-check-circle"></i> ${message}
        </div>
    `);
    
    $('body').append(notification);
    
    setTimeout(() => {
        notification.fadeOut(300, function() {
            $(this).remove();
        });
    }, 3000);
}

// Format Chat Time
function formatChatTime(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    // Less than 1 minute
    if (diff < 60000) {
        return 'Just now';
    }
    
    // Less than 1 hour
    if (diff < 3600000) {
        const minutes = Math.floor(diff / 60000);
        return `${minutes} min ago`;
    }
    
    // Less than 24 hours
    if (diff < 86400000) {
        const hours = Math.floor(diff / 3600000);
        return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    }
    
    // Show date and time
    return date.toLocaleString();
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// Update unread message count (for admin)
function updateUnreadChatCount() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (!user || !user.isAdmin) return;
    
    const messages = JSON.parse(localStorage.getItem('chatMessages') || '[]');
    const unreadCount = messages.filter(msg => !msg.read && msg.sender === 'user').length;
    
    if (unreadCount > 0) {
        $('#chatNotificationBadge').removeClass('hidden').text(unreadCount);
    } else {
        $('#chatNotificationBadge').addClass('hidden');
    }
}

// Call this when page loads
setInterval(updateUnreadChatCount, 5000); // Check every 5 seconds



// Initialize everything when document is ready
$(document).ready(function() {
    checkAuth();
});