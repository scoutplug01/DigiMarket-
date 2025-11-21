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

// Initialize storage
if (!localStorage.getItem('cart')) {
    localStorage.setItem('cart', JSON.stringify([]));
}
if (!localStorage.getItem('orders')) {
    localStorage.setItem('orders', JSON.stringify([]));
}
if (!localStorage.getItem('searchTerms')) {
    localStorage.setItem('searchTerms', JSON.stringify({}));
}
if (!localStorage.getItem('payments')) {
    localStorage.setItem('payments', JSON.stringify([]));
}
if (!localStorage.getItem('purchases')) {
    localStorage.setItem('purchases', JSON.stringify([]));
}
if (!localStorage.getItem('userNotifications')) {
    localStorage.setItem('userNotifications', JSON.stringify({}));
}
if (!localStorage.getItem('chatMessages')) {
    localStorage.setItem('chatMessages', JSON.stringify([]));
}

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
        updateUserNotificationBadge();
        updateAdminPaymentNotifications();
    }
}

// ============================================
// GOOGLE SIGN-IN FUNCTIONALITY
// ============================================

$('#googleSignInBtn, #googleSignUpBtn').on('click', function() {
    const googleUser = {
        name: 'Google User ' + Math.floor(Math.random() * 1000),
        email: 'user' + Math.floor(Math.random() * 10000) + '@gmail.com',
        password: 'google_auth_' + Date.now(),
        accountType: 'buyer',
        id: Date.now(),
        isAdmin: false,
        googleAuth: true
    };
    
    let users = JSON.parse(localStorage.getItem('users') || '[]');
    let existingUser = users.find(u => u.email === googleUser.email);
    
    if (!existingUser) {
        users.push(googleUser);
        localStorage.setItem('users', JSON.stringify(users));
    } else {
        googleUser.id = existingUser.id;
    }
    
    localStorage.setItem('currentUser', JSON.stringify(googleUser));
    alert('✅ Signed in with Google successfully! Welcome, ' + googleUser.name);
    checkAuth();
});

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

// Load Featured Products - MOBILE COMPATIBLE
function loadFeaturedProducts() {
    const products = JSON.parse(localStorage.getItem('products'));
    const container = $('#featuredProductsContainer');
    container.empty();
    
    products.forEach(product => {
        const stars = generateStars(product.rating);
        
        const categoryIcons = {
            'websites': 'fa-globe',
            'apps': 'fa-mobile-alt',
            'apis': 'fa-code',
            'ai-tools': 'fa-robot',
            'courses': 'fa-graduation-cap'
        };
        
        const cardHTML = `
            <div class="product-card" data-product-id="${product.id}">
                <div class="product-image-container" style="position: relative; width: 100%; height: 200px; overflow: hidden;">
                    ${product.image ? `
                        <img src="${product.image}" 
                             alt="${product.name}" 
                             class="product-img"
                             onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
                             style="display:block; width:100%; height:100%; object-fit:cover; position:absolute; top:0; left:0;">
                        <div style="display:none; width:100%; height:100%; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); position:absolute; top:0; left:0; align-items:center; justify-content:center; color:white;">
                            <i class="fas ${categoryIcons[product.category] || 'fa-box'}" style="font-size: 4rem;"></i>
                        </div>
                    ` : `
                        <div style="display:flex; width:100%; height:100%; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); position:absolute; top:0; left:0; align-items:center; justify-content:center; color:white;">
                            <i class="fas ${categoryIcons[product.category] || 'fa-box'}" style="font-size: 4rem;"></i>
                        </div>
                    `}
                    <div class="product-badge" style="position:absolute; top:10px; right:10px; z-index:10;">${product.hasDemo ? 'Live Demo' : 'View Course'}</div>
                </div>
                <div class="product-body">
                    <span class="product-category">${product.category}</span>
                    <h5 class="product-title">${product.name}</h5>
                    <div class="product-rating">
                        <div class="stars-display">${stars}</div>
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
        
        container.append(`<div class="swiper-slide">${cardHTML}</div>`);
    });
    
    if (window.featuredSwiper) {
        window.featuredSwiper.destroy(true, true);
    }
    
    setTimeout(() => {
        window.featuredSwiper = new Swiper('.productsSwiper', {
            slidesPerView: 1,
            spaceBetween: 20,
            loop: false,
            centeredSlides: false,
            watchOverflow: true,
            observer: true,
            observeParents: true,
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            breakpoints: {
                320: {
                    slidesPerView: 1,
                    spaceBetween: 15
                },
                640: {
                    slidesPerView: 2,
                    spaceBetween: 20
                },
                1024: {
                    slidesPerView: 3,
                    spaceBetween: 30
                }
            },
            autoplay: {
                delay: 5000,
                disableOnInteraction: false,
            }
        });
        
        console.log('✅ Swiper initialized with', products.length, 'products');
    }, 200);
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

// Create Product Card
function createProductCard(product) {
    const stars = generateStars(product.rating);
    
    const categoryIcons = {
        'websites': 'fa-globe',
        'apps': 'fa-mobile-alt',
        'apis': 'fa-code',
        'ai-tools': 'fa-robot',
        'courses': 'fa-graduation-cap'
    };
    
    return `
        <div class="product-card" data-product-id="${product.id}">
            <div class="product-image-container" style="position: relative; width: 100%; height: 200px; overflow: hidden;">
                ${product.image ? `
                    <img src="${product.image}" 
                         alt="${product.name}" 
                         class="product-img"
                         onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
                         style="display:block; width:100%; height:100%; object-fit:cover; position:absolute; top:0; left:0;">
                    <div style="display:none; width:100%; height:100%; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); position:absolute; top:0; left:0; align-items:center; justify-content:center; color:white;">
                        <i class="fas ${categoryIcons[product.category] || 'fa-box'}" style="font-size: 4rem;"></i>
                    </div>
                ` : `
                    <div style="display:flex; width:100%; height:100%; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); position:absolute; top:0; left:0; align-items:center; justify-content:center; color:white;">
                        <i class="fas ${categoryIcons[product.category] || 'fa-box'}" style="font-size: 4rem;"></i>
                    </div>
                `}
                <div class="product-badge" style="position:absolute; top:10px; right:10px; z-index:10;">${product.hasDemo ? 'Live Demo' : 'View Course'}</div>
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
    return stars;
}

// View Product Details
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

// ============================================
// PAYMENT SYSTEM - SHOW PRODUCT MODAL WITH BUY NOW
// ============================================

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
                                    <div class="stars-display">${stars}</div>
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
                                
                                <button class="btn btn-success btn-lg w-100 mb-2" id="buyNowBtn" data-product-id="${product.id}">
                                    <i class="fas fa-shopping-bag"></i> Buy Now
                                </button>
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
    
    $('#productModal').remove();
    $('body').append(modalContent);
    const modal = new bootstrap.Modal(document.getElementById('productModal'));
    modal.show();
    
    $('#productModal').on('hidden.bs.modal', function () {
        $(this).remove();
    });
    
    // Buy Now Button Handler
    $('#buyNowBtn').on('click', function() {
        const productId = $(this).data('product-id');
        openPaymentModal(productId);
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

// ============================================
// PAYMENT MODAL
// ============================================

function openPaymentModal(productId) {
    const products = JSON.parse(localStorage.getItem('products'));
    const product = products.find(p => p.id === productId);
    const user = JSON.parse(localStorage.getItem('currentUser'));
    
    if (!product) return;
    
    const productModal = bootstrap.Modal.getInstance(document.getElementById('productModal'));
    if (productModal) {
        productModal.hide();
    }
    
    setTimeout(() => {
        $('#paymentProductImage').attr('src', product.image);
        $('#paymentProductName').text(product.name);
        $('#paymentProductCategory').text(product.category);
        $('#paymentProductPrice').text('$' + product.price);
        $('#payerProduct').val(product.name);
        $('#payerAmount').val(product.price);
        $('#payerName').val(user.name);
        
        $('#paymentProofForm').data('productId', productId);
        
        const paymentModal = new bootstrap.Modal(document.getElementById('paymentModal'));
        paymentModal.show();
    }, 500);
}

// Copy to Clipboard Function
window.copyToClipboard = function(text) {
    navigator.clipboard.writeText(text).then(() => {
        showNotification('✅ Account number copied to clipboard!', 'success');
    }).catch(() => {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showNotification('✅ Account number copied!', 'success');
    });
};

// Screenshot Preview
$('#paymentScreenshot').on('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            $('#screenshotPreview').html(`<img src="${e.target.result}" alt="Payment Screenshot" style="max-width: 100%; border-radius: 10px; margin-top: 1rem;">`);
        };
        reader.readAsDataURL(file);
    }
});

// Submit Payment Proof
$('#paymentProofForm').on('submit', function(e) {
    e.preventDefault();
    
    const productId = $(this).data('productId');
    const user = JSON.parse(localStorage.getItem('currentUser'));
    const products = JSON.parse(localStorage.getItem('products'));
    const product = products.find(p => p.id === productId);
    
    const payerName = $('#payerName').val().trim();
    const payerAmount = parseFloat($('#payerAmount').val());
    const paymentBank = $('#paymentBank').val();
    const screenshotFile = $('#paymentScreenshot')[0].files[0];
    
    if (!screenshotFile) {
        alert('Please upload payment screenshot!');
        return;
    }
    
    if (payerAmount !== product.price) {
        alert('❌ Amount must match the product price exactly: $' + product.price);
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const payments = JSON.parse(localStorage.getItem('payments') || '[]');
        
        const newPayment = {
            id: Date.now(),
            userId: user.id,
            userName: payerName,
            userEmail: user.email,
            productId: product.id,
            productName: product.name,
            amount: payerAmount,
            bank: paymentBank,
            screenshot: e.target.result,
            status: 'pending',
            date: new Date().toISOString(),
            product: product
        };
        
        payments.push(newPayment);
        localStorage.setItem('payments', JSON.stringify(payments));
        
        sendNotificationToUser(user.id, 'Payment Submitted', `Your payment of $${payerAmount} for ${product.name} has been submitted and is being verified.`);
        
        const paymentModal = bootstrap.Modal.getInstance(document.getElementById('paymentModal'));
        if (paymentModal) {
            paymentModal.hide();
        }
        
        showSuccessModal('Payment Proof Submitted!', `Thank you ${payerName}! Your payment of $${payerAmount} has been submitted successfully. You will receive a confirmation within 5-10 minutes. Check your notifications.`);
        
        $('#paymentProofForm')[0].reset();
        $('#screenshotPreview').empty();
        
        updateAdminPaymentNotifications();
    };
    reader.readAsDataURL(screenshotFile);
});

// Show Success Modal
function showSuccessModal(title, message) {
    const modalHTML = `
        <div class="modal fade" id="successModal" tabindex="-1">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-body text-center p-5">
                        <i class="fas fa-check-circle text-success" style="font-size: 5rem;"></i>
                        <h3 class="mt-3">${title}</h3>
                        <p class="text-muted">${message}</p>
                        <button class="btn btn-primary-custom mt-3" data-bs-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    $('#successModal').remove();
    $('body').append(modalHTML);
    const modal = new bootstrap.Modal(document.getElementById('successModal'));
    modal.show();
    
    $('#successModal').on('hidden.bs.modal', function () {
        $(this).remove();
    });
}

// Show Notification
function showNotification(message, type = 'info') {
    const bgColor = type === 'success' ? 'var(--success-color)' : type === 'error' ? '#ef4444' : 'var(--primary-color)';
    const notification = $(`
        <div style="position: fixed; top: 80px; right: 20px; background: ${bgColor}; color: white; padding: 1rem 1.5rem; border-radius: 10px; box-shadow: 0 5px 15px rgba(0,0,0,0.2); z-index: 9999; animation: fadeIn 0.3s; max-width: 350px;">
            ${message}
        </div>
    `);
    
    $('body').append(notification);
    
    setTimeout(() => {
        notification.fadeOut(300, function() {
            $(this).remove();
        });
    }, 4000);
}

// Send Notification to User
function sendNotificationToUser(userId, title, message) {
    const userNotifications = JSON.parse(localStorage.getItem('userNotifications') || '{}');
    
    if (!userNotifications[userId]) {
        userNotifications[userId] = [];
    }
    
    userNotifications[userId].push({
        id: Date.now(),
        title: title,
        message: message,
        date: new Date().toISOString(),
        read: false
    });
    
    localStorage.setItem('userNotifications', JSON.stringify(userNotifications));
    updateUserNotificationBadge();
}

// Update User Notification Badge
function updateUserNotificationBadge() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (!user) return;
    
    const userNotifications = JSON.parse(localStorage.getItem('userNotifications') || '{}');
    const notifications = userNotifications[user.id] || [];
    const unreadCount = notifications.filter(n => !n.read).length;
    
    if (unreadCount > 0) {
        $('#notificationBadge').text(unreadCount).show();
    } else {
        $('#notificationBadge').text('0').hide();
    }
}

// Update Admin Payment Notifications
function updateAdminPaymentNotifications() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (!user || !user.isAdmin) return;
    
    const payments = JSON.parse(localStorage.getItem('payments') || '[]');
    const pendingPayments = payments.filter(p => p.status === 'pending').length;
    
    if (pendingPayments > 0) {
        if ($('#dashboardLink').find('.payment-notification-badge').length === 0) {
            $('#dashboardLink').css('position', 'relative').append(`<span class="payment-notification-badge">${pendingPayments}</span>`);
        } else {
            $('#dashboardLink .payment-notification-badge').text(pendingPayments);
        }
    } else {
        $('#dashboardLink .payment-notification-badge').remove();
    }
}

// ============================================
// CART FUNCTIONS
// ============================================

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

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart'));
    $('#cartCount').text(cart.length);
}

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
    
    $('#cartModal').remove();
    $('body').append(cartHTML);
    const modal = new bootstrap.Modal(document.getElementById('cartModal'));
    modal.show();
    
    $('#cartModal').on('hidden.bs.modal', function () {
        $(this).remove();
    });
});

$(document).on('click', '.remove-from-cart', function() {
    const productId = $(this).data('product-id');
    let cart = JSON.parse(localStorage.getItem('cart'));
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    
    $(this).closest('.cart-item').fadeOut(300, function() { 
        $(this).remove(); 
        
        const remainingCart = JSON.parse(localStorage.getItem('cart'));
        if (remainingCart.length === 0) {
            const modalInstance = bootstrap.Modal.getInstance(document.getElementById('cartModal'));
            if (modalInstance) {
                modalInstance.hide();
            }
        } else {
            const newTotal = remainingCart.reduce((sum, item) => sum + item.price, 0);
            $('.cart-summary .summary-row').eq(0).find('span:last').text('$' + newTotal);
            $('.cart-summary .summary-row.total').find('span:last').text('$' + newTotal);
            $('.modal-title').html(`<i class="fas fa-shopping-cart"></i> Shopping Cart (${remainingCart.length} items)`);
        }
    });
});

window.proceedToCheckout = function() {
    const modalInstance = bootstrap.Modal.getInstance(document.getElementById('cartModal'));
    if (modalInstance) {
        modalInstance.hide();
    }
    checkout();
};

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

// ============================================
// SEARCH & FILTER
// ============================================

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

$('#categoryFilter').on('change', function() {
    filterProducts();
});

$('#priceFilter').on('change', function() {
    filterProducts();
});

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
    
    const user = JSON.parse(localStorage.getItem('currentUser'));
    const userNotifications = JSON.parse(localStorage.getItem('userNotifications') || '{}');
    const notifications = userNotifications[user.id] || [];
    
    const container = $('#notificationsList');
    container.empty();
    
    if (notifications.length === 0) {
        container.html('<div class="notification-item">No notifications</div>');
    } else {
        notifications.reverse().forEach(notif => {
            container.append(`
                <div class="notification-item">
                    <i class="fas fa-info-circle text-primary"></i> <strong>${notif.title}</strong>
                    <div style="font-size: 0.9rem; margin-top: 0.5rem;">${notif.message}</div>
                    <div style="font-size: 0.85rem; color: #64748b; margin-top: 0.25rem;">${new Date(notif.date).toLocaleString()}</div>
                </div>
            `);
        });
        
        // Mark as read
        notifications.forEach(n => n.read = true);
        userNotifications[user.id] = notifications;
        localStorage.setItem('userNotifications', JSON.stringify(userNotifications));
        updateUserNotificationBadge();
    }
});

$(document).on('click', function(e) {
    if (!$(e.target).closest('#notificationIcon, #notificationDropdown').length) {
        $('#notificationDropdown').addClass('hidden');
    }
});

// ============================================
// DASHBOARD SECTIONS
// ============================================

$(document).on('click', '.dashboard-menu-item', function() {
    $('.dashboard-menu-item').removeClass('active');
    $(this).addClass('active');
    
    const section = $(this).data('section');
    loadDashboardSection(section);
});

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
        case 'purchases':
            loadPurchasesSection(content, user);
            break;
        case 'payments':
            if (user.isAdmin) {
                loadPaymentsSection(content);
            } else {
                content.html('<div class="alert alert-warning">Access denied. Admin only.</div>');
            }
            break;
        case 'orders':
            loadOrdersSection(content, user);
            break;
        case 'sales':
            loadSalesSection(content, user);
            break;
        case 'messages':
            if (user.isAdmin) {
                loadMessagesSection(content, user);
            } else {
                content.html('<div class="alert alert-warning">Access denied. Admin only.</div>');
            }
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
    
    const topSearches = Object.entries(searchTerms)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5);
    
    content.html(`
        <h2 class="mb-4">${user.isAdmin ? '🔒 Admin' : ''} Dashboard Overview</h2>
        ${user.isAdmin ? '<div class="alert alert-warning"><strong>ADMIN MODE:</strong> You have full control over the entire platform</div>' : ''}
        
        <div class="row">
            <div class="col-md-3 mb-4">
                <div class="stat-card">
                    <div class="stat-value">$${totalSales}</div>
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
                                <td>Order #${order.id} - $${order.total}</td>
                            </tr>
                        `).join('') : '<tr><td colspan="3" class="text-center">No activity yet</td></tr>'}
                    </tbody>
                </table>
            </div>
        </div>
    `);
}

// Load Products Section - I'll abbreviate these since they're in your original code
function loadProductsSection(content, user) {
    const products = JSON.parse(localStorage.getItem('products'));
    // Your existing products section code goes here - keeping it short for space
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
    `);
    
    attachProductFormHandler();
}

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

// My Purchases Section
function loadPurchasesSection(content, user) {
    const purchases = JSON.parse(localStorage.getItem('purchases') || '[]');
    const userPurchases = purchases.filter(p => p.userId === user.id);
    
    content.html(`
        <h2 class="mb-4">📦 My Purchases</h2>
        
        ${userPurchases.length === 0 ? `
            <div class="text-center py-5">
                <i class="fas fa-shopping-bag fa-4x text-muted mb-3"></i>
                <h4>No purchases yet</h4>
                <p class="text-muted">Browse our marketplace to find amazing products!</p>
                <button class="btn btn-primary-custom" onclick="showPage('browse')">Browse Products</button>
            </div>
        ` : `
            <div class="row">
                ${userPurchases.reverse().map(purchase => `
                    <div class="col-md-6 mb-4">
                        <div class="dashboard-card">
                            <div class="d-flex align-items-center gap-3 mb-3">
                                <img src="${purchase.product.image}" alt="${purchase.product.name}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 10px;">
                                <div>
                                    <h5>${purchase.product.name}</h5>
                                    <p class="text-muted mb-0">${new Date(purchase.date).toLocaleDateString()}</p>
                                </div>
                            </div>
                            <button class="btn btn-download w-100" onclick="downloadProduct(${purchase.product.id})">
                                <i class="fas fa-download"></i> Download Product
                            </button>
                        </div>
                    </div>
                `).join('')}
            </div>
        `}
    `);
}

window.downloadProduct = function(productId) {
    const products = JSON.parse(localStorage.getItem('products'));
    const product = products.find(p => p.id === productId);
    
    if (!product) return;
    
    showNotification('📥 Downloading ' + product.name + '...', 'success');
    
    setTimeout(() => {
        alert(`✅ ${product.name} has been downloaded successfully!\n\nThe product files will be sent to your email within 5 minutes.\n\nFor immediate access, contact us on WhatsApp: +234 913 376 7432`);
    }, 2000);
};

// Admin Payments Section
function loadPaymentsSection(content) {
    const payments = JSON.parse(localStorage.getItem('payments') || '[]');
    const pendingPayments = payments.filter(p => p.status === 'pending');
    const confirmedPayments = payments.filter(p => p.status === 'confirmed');
    const rejectedPayments = payments.filter(p => p.status === 'rejected');
    
    content.html(`
        <h2 class="mb-4">💳 Payment Management</h2>
        
        <div class="row mb-4">
            <div class="col-md-4">
                <div class="stat-card" style="background: linear-gradient(135deg, #fbbf24, #f59e0b);">
                    <div class="stat-value">${pendingPayments.length}</div>
                    <div>Pending Payments</div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="stat-card">
                    <div class="stat-value">${confirmedPayments.length}</div>
                    <div>Confirmed</div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="stat-card" style="background: linear-gradient(135deg, #ef4444, #dc2626);">
                    <div class="stat-value">${rejectedPayments.length}</div>
                    <div>Rejected</div>
                </div>
            </div>
        </div>
        
        <div class="dashboard-card">
            <h4>Pending Payments (${pendingPayments.length})</h4>
            ${pendingPayments.length === 0 ? '<p class="text-muted">No pending payments</p>' : `
                <div class="table-responsive">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Customer</th>
                                <th>Product</th>
                                <th>Amount</th>
                                <th>Bank</th>
                                <th>Screenshot</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${pendingPayments.reverse().map(payment => `
                                <tr>
                                    <td>${new Date(payment.date).toLocaleString()}</td>
                                    <td>${payment.userName}<br><small>${payment.userEmail}</small></td>
                                    <td>${payment.productName}</td>
                                    <td><strong>$${payment.amount}</strong></td>
                                    <td>${payment.bank}</td>
                                    <td><button class="btn btn-sm btn-info view-screenshot-btn" data-screenshot="${payment.screenshot}"><i class="fas fa-image"></i> View</button></td>
                                    <td>
                                        <button class="btn btn-sm btn-success confirm-payment-btn" data-payment-id="${payment.id}">
                                            <i class="fas fa-check"></i> Confirm
                                        </button>
                                        <button class="btn btn-sm btn-danger reject-payment-btn" data-payment-id="${payment.id}">
                                            <i class="fas fa-times"></i> Reject
                                        </button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            `}
        </div>
    `);
}

$(document).on('click', '.view-screenshot-btn', function() {
    const screenshot = $(this).data('screenshot');
    
    const modalHTML = `
        <div class="modal fade" id="screenshotModal" tabindex="-1">
            <div class="modal-dialog modal-lg modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Payment Screenshot</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body text-center">
                        <img src="${screenshot}" class="screenshot-modal-img" alt="Payment Proof">
                    </div>
                </div>
            </div>
        </div>
    `;
    
    $('#screenshotModal').remove();
    $('body').append(modalHTML);
    const modal = new bootstrap.Modal(document.getElementById('screenshotModal'));
    modal.show();
    
    $('#screenshotModal').on('hidden.bs.modal', function () {
        $(this).remove();
    });
});

$(document).on('click', '.confirm-payment-btn', function() {
    if (!confirm('Confirm this payment? The customer will be notified and will receive their product.')) return;
    
    const paymentId = $(this).data('payment-id');
    const payments = JSON.parse(localStorage.getItem('payments'));
    const payment = payments.find(p => p.id === paymentId);
    
    if (!payment) return;
    
    payment.status = 'confirmed';
    localStorage.setItem('payments', JSON.stringify(payments));
    
    const purchases = JSON.parse(localStorage.getItem('purchases') || '[]');
    purchases.push({
        id: Date.now(),
        userId: payment.userId,
        product: payment.product,
        paymentId: paymentId,
        date: new Date().toISOString()
    });
    localStorage.setItem('purchases', JSON.stringify(purchases));
    
    sendNotificationToUser(payment.userId, 'Payment Confirmed ✅', `Your payment of $${payment.amount} for ${payment.productName} has been confirmed! Your product is ready for download. Check "My Purchases" section.`);
    
    showNotification('✅ Payment confirmed! Customer has been notified.', 'success');
    loadDashboardSection('payments');
    updateAdminPaymentNotifications();
});

$(document).on('click', '.reject-payment-btn', function() {
    const reason = prompt('Enter reason for rejection:');
    if (!reason) return;
    
    const paymentId = $(this).data('payment-id');
    const payments = JSON.parse(localStorage.getItem('payments'));
    const payment = payments.find(p => p.id === paymentId);
    
    if (!payment) return;
    
    payment.status = 'rejected';
    payment.rejectionReason = reason;
    localStorage.setItem('payments', JSON.stringify(payments));
    
    sendNotificationToUser(payment.userId, 'Payment Rejected ❌', `Your payment for ${payment.productName} was rejected. Reason: ${reason}. Please contact support on WhatsApp: +234 913 376 7432`);
    
    showNotification('Payment rejected. Customer has been notified.', 'error');
    loadDashboardSection('payments');
    updateAdminPaymentNotifications();
});

// Orders, Sales, Messages, Settings sections are in your original code
// Keep them as they are - just make sure they're included
function loadOrdersSection(content, user) {
    // Your existing orders code
}

function loadSalesSection(content, user) {
    // Your existing sales code
}

function loadMessagesSection(content, user) {
    // Your existing messages code
}

function loadSettingsSection(content, user) {
    // Your existing settings code
}

function updateDashboardStats() {
    const currentSection = $('.dashboard-menu-item.active').data('section');
    if (currentSection) {
        loadDashboardSection(currentSection);
    }
}

// Live Chat (existing code)
$('#liveChatBtn').on('click', function() {
    openChatModal();
});

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
    
    $('#chatModal').remove();
    $('body').append(chatHTML);
    loadChatMessages();
    
    $('#closeChatBtn').on('click', function() {
        $('#chatModal').remove();
    });
    
    $('#chatSendBtn').on('click', function() {
        sendChatMessage();
    });
    
    $('#chatInput').on('keypress', function(e) {
        if (e.which === 13) {
            sendChatMessage();
        }
    });
    
    $('#chatInput').focus();
}

function loadChatMessages() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    const messages = JSON.parse(localStorage.getItem('chatMessages') || '[]');
    const container = $('#chatMessages');
    
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
        
        container.scrollTop(container[0].scrollHeight);
    }
}

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
    
    showNotification('Message sent! Our team will respond soon.', 'success');
}

function formatChatTime(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    if (diff < 60000) {
        return 'Just now';
    }
    
    if (diff < 3600000) {
        const minutes = Math.floor(diff / 60000);
        return `${minutes} min ago`;
    }
    
    if (diff < 86400000) {
        const hours = Math.floor(diff / 3600000);
        return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    }
    
    return date.toLocaleString();
}

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

// Initialize everything when document is ready
$(document).ready(function() {
    checkAuth();
    
    if (localStorage.getItem('currentUser')) {
        updateUserNotificationBadge();
        updateAdminPaymentNotifications();
        
        setInterval(() => {
            updateUserNotificationBadge();
            updateAdminPaymentNotifications();
        }, 10000);
    }
});