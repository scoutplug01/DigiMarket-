// ===================================
// USER DASHBOARD JAVASCRIPT - PART 1
// Core Initialization & Navigation
// ===================================

// === DOCUMENT READY ===
$(document).ready(function() {
    initializeUserDashboard();
    setupEventListeners();
    loadUserData();
    animateElements();
});

// === INITIALIZE ===
function initializeUserDashboard() {
    console.log('User Dashboard Initialized! 🚀');
    
    // Add mobile menu button if screen is small
    if ($(window).width() <= 991 && !$('.mobile-menu-toggle').length) {
        $('body').append(`
            <button class="mobile-menu-toggle">
                <i class="fas fa-bars"></i>
            </button>
            <div class="sidebar-overlay"></div>
        `);
    }
    
    // Add fade-in animation
    $('.card').addClass('fade-in');
    
    // Initialize tooltips
    $('[data-bs-toggle="tooltip"]').tooltip();
}

// === SETUP EVENT LISTENERS ===
function setupEventListeners() {
    // Mobile menu toggle
    $(document).on('click', '.mobile-menu-toggle', toggleMobileSidebar);
    $(document).on('click', '.sidebar-overlay', closeMobileSidebar);
    
    // Menu items - FIXED: Now actually navigates
    $('.dashboard-menu-item').on('click', handleMenuClick);
    
    // Search functionality
    $('input[placeholder*="Search"]').on('keyup', handleSearch);
    
    // Filter dropdowns
    $('select.form-control').on('change', handleFilter);
    
    // Window resize
    $(window).on('resize', handleWindowResize);
}

// === MOBILE SIDEBAR ===
function toggleMobileSidebar() {
    $('.dashboard-sidebar').toggleClass('show');
    $('.sidebar-overlay').toggleClass('show');
    $(this).find('i').toggleClass('fa-bars fa-times');
}

function closeMobileSidebar() {
    $('.dashboard-sidebar').removeClass('show');
    $('.sidebar-overlay').removeClass('show');
    $('.mobile-menu-toggle i').removeClass('fa-times').addClass('fa-bars');
}

function handleWindowResize() {
    if ($(window).width() > 991) {
        closeMobileSidebar();
        $('.mobile-menu-toggle, .sidebar-overlay').remove();
    } else if ($(window).width() <= 991 && !$('.mobile-menu-toggle').length) {
        $('body').append(`
            <button class="mobile-menu-toggle">
                <i class="fas fa-bars"></i>
            </button>
            <div class="sidebar-overlay"></div>
        `);
    }
}

// === MENU CLICK - FIXED VERSION ===
function handleMenuClick(e) {
    // Don't prevent default - let the link work normally
    // e.preventDefault(); // REMOVED THIS LINE
    
    // Visual feedback
    $('.dashboard-menu-item').removeClass('active');
    $(this).addClass('active');
    
    // Close mobile sidebar after click
    if ($(window).width() <= 991) {
        closeMobileSidebar();
    }
    
    // Get the page name from href
    const href = $(this).attr('href');
    const pageName = href.split('/').pop().replace('.html', '');
    
    // Show loading notification
    showNotification('Loading ' + pageName + '...', 'info');
}

// === SEARCH FUNCTIONALITY ===
function handleSearch() {
    const searchTerm = $(this).val().toLowerCase();
    const target = $(this).closest('.container-fluid, .card').find('.table tbody, .row > [class*="col-"]');
    
    if (target.length) {
        target.find('tr, .card').each(function() {
            const text = $(this).text().toLowerCase();
            $(this).toggle(text.includes(searchTerm));
        });
    }
}

// === FILTER FUNCTIONALITY ===
function handleFilter() {
    const filterValue = $(this).val().toLowerCase();
    const target = $(this).closest('.container-fluid').find('.table tbody, .row');
    
    if (filterValue === 'all' || filterValue.includes('all')) {
        target.find('tr, .card').show();
    } else {
        target.find('tr, .card').each(function() {
            const text = $(this).text().toLowerCase();
            $(this).toggle(text.includes(filterValue));
        });
    }
    
    showNotification('Filter applied', 'success');
}

// === LOAD USER DATA ===
function loadUserData() {
    // Simulate loading user stats
    animateCounters();
    
    // Simulate notifications
    setTimeout(() => {
        const badge = $('.notification-badge');
        if (badge.length) {
            badge.text(Math.floor(Math.random() * 5) + 1);
        }
    }, 2000);
}

// === ANIMATE COUNTERS ===
function animateCounters() {
    $('.card h3').each(function() {
        const $this = $(this);
        const text = $this.text();
        const matches = text.match(/[\d,]+/);
        
        if (matches) {
            const target = parseInt(matches[0].replace(/,/g, ''));
            const prefix = text.includes('$') ? '$' : '';
            const suffix = text.includes('%') ? '%' : '';
            
            $({ count: 0 }).animate({
                count: target
            }, {
                duration: 2000,
                easing: 'swing',
                step: function() {
                    const num = Math.floor(this.count).toLocaleString();
                    $this.text(prefix + num + suffix);
                },
                complete: function() {
                    const num = target.toLocaleString();
                    $this.text(prefix + num + suffix);
                }
            });
        }
    });
}

// === ANIMATE ELEMENTS ===
function animateElements() {
    // Add animation on scroll
    $(window).on('scroll', function() {
        $('.card').each(function() {
            const elementTop = $(this).offset().top;
            const viewportBottom = $(window).scrollTop() + $(window).height();
            
            if (elementTop < viewportBottom - 50) {
                $(this).addClass('fade-in');
            }
        });
    });
}

// === NOTIFICATION SYSTEM ===
function showNotification(message, type = 'info') {
    // Remove existing
    $('.user-notification').remove();
    
    // Create notification
    const notification = $(`
        <div class="user-notification alert alert-${type} shadow-lg" role="alert">
            <i class="fas fa-${getNotificationIcon(type)} me-2"></i>
            ${message}
        </div>
    `);
    
    // Style
    notification.css({
        position: 'fixed',
        top: '90px',
        right: '20px',
        zIndex: 9999,
        minWidth: '300px',
        maxWidth: '400px',
        animation: 'slideIn 0.3s ease-out'
    });
    
    // Append
    $('body').append(notification);
    
    // Auto remove
    setTimeout(() => {
        notification.fadeOut(400, function() {
            $(this).remove();
        });
    }, 3000);
}

function getNotificationIcon(type) {
    const icons = {
        'success': 'check-circle',
        'danger': 'exclamation-circle',
        'warning': 'exclamation-triangle',
        'info': 'info-circle'
    };
    return icons[type] || 'info-circle';
}

// === KEYBOARD SHORTCUTS ===
$(document).on('keydown', function(e) {
    // Ctrl/Cmd + K for search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        $('input[placeholder*="Search"]').first().focus();
    }
    
    // ESC to close mobile sidebar
    if (e.key === 'Escape') {
        closeMobileSidebar();
    }
});

console.log('Part 1: Core Functions Loaded! ✅');

// ===================================
// USER DASHBOARD JAVASCRIPT - PART 2
// Button Actions & Click Events
// ===================================

// Add this to your document ready in Part 1
$(document).ready(function() {
    setupButtonActions();
    setupWishlistFeatures();
    setupProgressTracking();
});

// === BUTTON ACTIONS ===
function setupButtonActions() {
    // Download buttons
    $(document).on('click', '.btn-primary:contains("Download"), .btn:contains("Download")', function(e) {
        e.preventDefault();
        const productName = $(this).closest('.card, tr').find('h5, td:nth-child(2)').first().text().trim();
        const btn = $(this);
        
        // Simulate download
        btn.html('<i class="fas fa-spinner fa-spin"></i> Downloading...').prop('disabled', true);
        
        setTimeout(() => {
            btn.html('<i class="fas fa-check"></i> Downloaded!').removeClass('btn-primary').addClass('btn-success');
            showNotification('Downloaded: ' + productName, 'success');
            
            setTimeout(() => {
                btn.html('<i class="fas fa-download"></i> Download').removeClass('btn-success').addClass('btn-primary').prop('disabled', false);
            }, 2000);
        }, 1500);
    });
    
    // Continue Learning / Access Course buttons
    $(document).on('click', '.btn:contains("Continue Learning"), .btn:contains("Access Course")', function(e) {
        e.preventDefault();
        const courseName = $(this).closest('.card, tr').find('.card-title, h5, td:nth-child(2)').first().text().trim();
        showNotification('Opening: ' + courseName, 'info');
        
        // Add animation
        $(this).html('<i class="fas fa-spinner fa-spin"></i> Loading...').prop('disabled', true);
        
        setTimeout(() => {
            $(this).html('<i class="fas fa-play"></i> Continue Learning').prop('disabled', false);
            // You can redirect here if needed
            // window.location.href = 'course-viewer.html';
        }, 1000);
    });
    
    // View Certificate buttons
    $(document).on('click', '.btn:contains("Certificate")', function(e) {
        e.preventDefault();
        const courseName = $(this).closest('.card').find('.card-title').text().trim();
        showNotification('Opening certificate for: ' + courseName, 'success');
        
        // Simulate certificate viewing
        $(this).html('<i class="fas fa-spinner fa-spin"></i> Loading...').prop('disabled', true);
        
        setTimeout(() => {
            $(this).html('<i class="fas fa-certificate"></i> View Certificate').prop('disabled', false);
            // You can open certificate in modal or new tab
            // window.open('certificate.html?course=' + courseName, '_blank');
        }, 1000);
    });
    
    // Add to Cart buttons
    $(document).on('click', '.btn:contains("Add to Cart")', function(e) {
        e.preventDefault();
        const card = $(this).closest('.card');
        const productName = card.find('.card-title').text().trim();
        const price = card.find('h4').text().trim();
        const btn = $(this);
        
        btn.html('<i class="fas fa-spinner fa-spin"></i> Adding...').prop('disabled', true);
        
        setTimeout(() => {
            btn.html('<i class="fas fa-check"></i> Added!').removeClass('btn-primary').addClass('btn-success');
            showNotification('Added to cart: ' + productName + ' (' + price + ')', 'success');
            
            // Update cart count
            updateCartCount();
            
            setTimeout(() => {
                btn.html('<i class="fas fa-shopping-cart"></i> Add to Cart').removeClass('btn-success').addClass('btn-primary').prop('disabled', false);
            }, 2000);
        }, 800);
    });
    
    // Invoice buttons
    $(document).on('click', '.btn:contains("Invoice")', function(e) {
        // Let this navigate normally - don't prevent default
        const orderID = $(this).closest('tr, .card').find('td:first-child, .text-muted:contains("#ORD")').text().trim();
        showNotification('Loading invoice ' + orderID, 'info');
    });
    
    // View Order buttons
    $(document).on('click', '.btn:contains("View")', function(e) {
        e.preventDefault();
        const orderID = $(this).closest('tr').find('td:first-child').text().trim();
        showNotification('Loading order details ' + orderID, 'info');
        
        // You can open order details modal or redirect
        // showOrderDetailsModal(orderID);
    });
    
    // Remove from wishlist (X button)
    $(document).on('click', '.btn-danger .fa-times', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const card = $(this).closest('.card').parent();
        const productName = card.find('.card-title').text().trim();
        
        // Confirm removal
        if (confirm('Remove "' + productName + '" from wishlist?')) {
            card.fadeOut(400, function() {
                $(this).remove();
                showNotification('Removed: ' + productName, 'warning');
                
                // Check if wishlist is empty
                if ($('.row > [class*="col-"] .card').length === 0) {
                    $('#emptyWishlist').removeClass('d-none');
                }
            });
        }
    });
    
    // Clear All Wishlist button
    $(document).on('click', '.btn-danger:contains("Clear All")', function(e) {
        e.preventDefault();
        
        if (confirm('Are you sure you want to clear all items from your wishlist?')) {
            $('.row > [class*="col-"]').fadeOut(400, function() {
                $(this).remove();
                $('#emptyWishlist').removeClass('d-none');
                showNotification('Wishlist cleared', 'warning');
            });
        }
    });
    
    // Pagination
    $('.pagination .page-link').on('click', function(e) {
        e.preventDefault();
        $('.pagination .page-item').removeClass('active');
        $(this).parent().addClass('active');
        
        const pageNum = $(this).text();
        if (pageNum && pageNum !== 'Previous' && pageNum !== 'Next') {
            showNotification('Loading page ' + pageNum, 'info');
        }
        
        // Scroll to top smoothly
        $('html, body').animate({ scrollTop: 0 }, 600);
    });
}

// === WISHLIST FEATURES ===
function setupWishlistFeatures() {
    // Check if wishlist is empty on load
    if ($('.row > [class*="col-"] .card').length === 0 && $('#emptyWishlist').length) {
        $('#emptyWishlist').removeClass('d-none');
    }
}

// === PROGRESS TRACKING ===
function setupProgressTracking() {
    // Animate progress bars on page load
    $('.progress-bar').each(function() {
        const $bar = $(this);
        const targetWidth = $bar.css('width');
        
        // Start from 0
        $bar.css('width', '0%');
        
        // Animate to target
        setTimeout(() => {
            $bar.css({
                'width': targetWidth,
                'transition': 'width 1.5s ease-in-out'
            });
        }, 300);
    });
}

// === UPDATE CART COUNT ===
function updateCartCount() {
    const cartCount = $('#cartCount, .cart-count');
    if (cartCount.length) {
        const current = parseInt(cartCount.text()) || 0;
        cartCount.text(current + 1);
        cartCount.addClass('pulse');
        setTimeout(() => cartCount.removeClass('pulse'), 500);
    }
}

// === UTILITY FUNCTIONS ===
function formatCurrency(amount) {
    return '$' + parseFloat(amount).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
}

function formatDate(date) {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

console.log('Part 2: Button Actions Loaded! ✅');

// ===================================
// USER DASHBOARD JAVASCRIPT - PART 3
// Forms, Chat & Settings
// ===================================

// Add this to your document ready in Part 1
$(document).ready(function() {
    setupFormHandlers();
    setupChatFeatures();
});

// === FORM HANDLERS ===
function setupFormHandlers() {
    // Settings form submission
    $('form').on('submit', function(e) {
        e.preventDefault();
        
        const form = $(this);
        const formType = form.closest('.tab-pane').attr('id') || 'settings';
        
        // Don't handle chat form here
        if (form.find('input[placeholder*="Type your message"]').length) {
            return;
        }
        
        // Validate
        if (validateForm(form)) {
            const btn = form.find('button[type="submit"]');
            const originalText = btn.html();
            
            // Show loading
            btn.html('<i class="fas fa-spinner fa-spin"></i> Saving...').prop('disabled', true);
            
            setTimeout(() => {
                btn.html('<i class="fas fa-check"></i> Saved!').removeClass('btn-primary').addClass('btn-success');
                showNotification('Settings saved successfully!', 'success');
                
                setTimeout(() => {
                    btn.html(originalText).removeClass('btn-success').addClass('btn-primary').prop('disabled', false);
                }, 1500);
            }, 1000);
        } else {
            showNotification('Please fill in all required fields', 'danger');
        }
    });
    
    // Change photo button
    $(document).on('click', 'button:contains("Change Photo")', function(e) {
        e.preventDefault();
        
        // Create hidden file input
        const fileInput = $('<input type="file" accept="image/*" style="display: none;">');
        
        fileInput.on('change', function() {
            if (this.files && this.files[0]) {
                const fileName = this.files[0].name;
                const fileSize = (this.files[0].size / 1024 / 1024).toFixed(2); // MB
                
                showNotification('Photo selected: ' + fileName + ' (' + fileSize + ' MB)', 'success');
                
                // You can preview the image here
                const reader = new FileReader();
                reader.onload = function(e) {
                    $('.rounded-circle[src*="pravatar"]').attr('src', e.target.result);
                };
                reader.readAsDataURL(this.files[0]);
            }
        });
        
        fileInput.click();
    });
    
    // 2FA Toggle
    $('#enable2FA').on('change', function() {
        const isChecked = $(this).is(':checked');
        
        if (isChecked) {
            showNotification('Two-Factor Authentication enabled. You will receive a setup code via email.', 'success');
        } else {
            if (confirm('Are you sure you want to disable Two-Factor Authentication?')) {
                showNotification('Two-Factor Authentication disabled', 'warning');
            } else {
                $(this).prop('checked', true);
            }
        }
    });
    
    // Notification toggles
    $('.form-check-input[type="checkbox"]:not(#enable2FA)').on('change', function() {
        const label = $(this).next('label').find('strong').text();
        const status = $(this).is(':checked') ? 'enabled' : 'disabled';
        showNotification(label + ' notifications ' + status, 'info');
    });
    
    // Save Preferences button
    $(document).on('click', '.btn:contains("Save Preferences")', function(e) {
        e.preventDefault();
        
        const btn = $(this);
        const originalText = btn.html();
        
        btn.html('<i class="fas fa-spinner fa-spin"></i> Saving...').prop('disabled', true);
        
        setTimeout(() => {
            btn.html('<i class="fas fa-check"></i> Saved!').removeClass('btn-primary').addClass('btn-success');
            showNotification('Notification preferences saved!', 'success');
            
            setTimeout(() => {
                btn.html(originalText).removeClass('btn-success').addClass('btn-primary').prop('disabled', false);
            }, 1500);
        }, 1000);
    });
    
    // Add Payment Method button
    $(document).on('click', '.btn:contains("Add New")', function(e) {
        e.preventDefault();
        showNotification('Payment method form would open here', 'info');
        // You can open a modal for adding payment method
    });
    
    // Remove Payment Method button
    $(document).on('click', '.btn:contains("Remove")', function(e) {
        e.preventDefault();
        
        const paymentCard = $(this).closest('.card');
        const paymentMethod = paymentCard.find('h6').text().trim();
        
        if (confirm('Remove ' + paymentMethod + ' payment method?')) {
            paymentCard.fadeOut(400, function() {
                $(this).remove();
                showNotification('Payment method removed', 'warning');
            });
        }
    });
}

// === VALIDATE FORM ===
function validateForm(form) {
    let isValid = true;
    
    form.find('input[required], select[required], textarea[required]').each(function() {
        const input = $(this);
        
        if (!input.val() || input.val().trim() === '') {
            input.addClass('is-invalid');
            isValid = false;
            
            // Add error message if not exists
            if (!input.next('.invalid-feedback').length) {
                input.after('<div class="invalid-feedback">This field is required</div>');
            }
        } else {
            input.removeClass('is-invalid');
            input.next('.invalid-feedback').remove();
        }
    });
    
    // Password matching validation
    const newPassword = form.find('input[placeholder*="new password"]');
    const confirmPassword = form.find('input[placeholder*="Confirm"]');
    
    if (newPassword.length && confirmPassword.length) {
        if (newPassword.val() !== confirmPassword.val()) {
            confirmPassword.addClass('is-invalid');
            if (!confirmPassword.next('.invalid-feedback').length) {
                confirmPassword.after('<div class="invalid-feedback">Passwords do not match</div>');
            }
            isValid = false;
        }
    }
    
    return isValid;
}

// === CHAT FEATURES ===
function setupChatFeatures() {
    // Message list click
    $('.list-group-item').on('click', function(e) {
        e.preventDefault();
        
        $('.list-group-item').removeClass('active');
        $(this).addClass('active');
        
        const userName = $(this).find('h6').text().trim();
        const userAvatar = $(this).find('img').attr('src');
        
        // Update chat header
        $('.card-header .rounded-circle').attr('src', userAvatar);
        $('.card-header h6').text(userName);
        
        showNotification('Opening chat with ' + userName, 'info');
        
        // Remove 'New' badge
        $(this).find('.badge').remove();
        
        // Load messages for this user (you can implement actual loading here)
        // loadChatMessages(userName);
    });
    
    // Send message form
    $('form:has(input[placeholder*="Type your message"])').on('submit', function(e) {
        e.preventDefault();
        
        const form = $(this);
        const input = form.find('input[type="text"]');
        const message = input.val().trim();
        
        if (message) {
            const chatBody = form.closest('.card').find('.card-body');
            
            // Create message HTML
            const messageHtml = `
                <div class="mb-3 new-message">
                    <div class="d-flex justify-content-end">
                        <div class="text-end">
                            <div class="bg-primary text-white p-3 rounded">
                                <p class="mb-0">${escapeHtml(message)}</p>
                            </div>
                            <small class="text-muted">Just now</small>
                        </div>
                        <img src="https://i.pravatar.cc/40?img=20" alt="You" class="rounded-circle ms-2" width="40" height="40">
                    </div>
                </div>
            `;
            
            // Remove typing indicator
            chatBody.find('.typing-indicator').parent().parent().parent().remove();
            
            // Add message with animation
            const newMessage = $(messageHtml).hide();
            chatBody.append(newMessage);
            newMessage.slideDown(300);
            
            // Scroll to bottom
            chatBody.animate({ scrollTop: chatBody[0].scrollHeight }, 300);
            
            // Clear input
            input.val('');
            
            showNotification('Message sent!', 'success');
            
            // Simulate response after 2 seconds
            setTimeout(() => {
                simulateResponse(chatBody);
            }, 2000);
        }
    });
    
    // Attach file button
    $(document).on('click', '.btn:has(.fa-paperclip)', function(e) {
        e.preventDefault();
        
        const fileInput = $('<input type="file" accept="image/*,application/pdf" style="display: none;">');
        
        fileInput.on('change', function() {
            if (this.files && this.files[0]) {
                const fileName = this.files[0].name;
                showNotification('File selected: ' + fileName, 'success');
                // You can upload the file here
            }
        });
        
        fileInput.click();
    });
}

// === SIMULATE CHAT RESPONSE ===
function simulateResponse(chatBody) {
    const responses = [
        "Thanks for your message! I'll get back to you shortly.",
        "That's a great question! Let me check on that for you.",
        "I understand. Let me help you with that.",
        "Perfect! I'll process that right away.",
        "Got it! I'll look into this and respond soon."
    ];
    
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    const userAvatar = $('.card-header .rounded-circle').attr('src');
    
    const responseHtml = `
        <div class="mb-3 new-message">
            <div class="d-flex">
                <img src="${userAvatar}" alt="User" class="rounded-circle me-2" width="40" height="40">
                <div>
                    <div class="bg-light p-3 rounded">
                        <p class="mb-0">${randomResponse}</p>
                    </div>
                    <small class="text-muted">Just now</small>
                </div>
            </div>
        </div>
    `;
    
    const newResponse = $(responseHtml).hide();
    chatBody.append(newResponse);
    newResponse.slideDown(300);
    chatBody.animate({ scrollTop: chatBody[0].scrollHeight }, 300);
}

// === ESCAPE HTML ===
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, function(m) { return map[m]; });
}

console.log('Part 3: Forms & Chat Loaded! ✅');

// When user sends a message, save it to localStorage
function sendUserMessage(text) {
    // Get or create user conversation
    let conversations = JSON.parse(localStorage.getItem('/admim/support.html') || '[]');
    
    // Find or create current user's conversation
    const userId = 'user_' + (localStorage.getItem('currentUserId') || '001');
    let userChat = conversations.find(c => c.userId === userId);
    
    if (!userChat) {
        userChat = {
            id: 'chat_' + Date.now(),
            userId: userId,
            userName: 'Current User', // Get from profile
            userEmail: 'user@example.com',
            userAvatar: 'https://i.pravatar.cc/150?img=20',
            status: 'online',
            lastMessage: text,
            lastMessageTime: new Date().toISOString(),
            unread: true,
            messages: []
        };
        conversations.push(userChat);
    }
    
    // Add message
    userChat.messages.push({
        id: 'msg_' + Date.now(),
        from: 'customer',
        text: text,
        time: new Date().toISOString(),
        status: 'delivered'
    });
    
    userChat.lastMessage = text;
    userChat.lastMessageTime = new Date().toISOString();
    userChat.unread = true;
    
    // Save
    localStorage.setItem('supportConversations', JSON.stringify(conversations));
} 




// Add to orders-history.html
const orderStatuses = {
    'pending': { color: 'warning', icon: 'clock', text: 'Pending Payment' },
    'processing': { color: 'info', icon: 'sync', text: 'Processing' },
    'shipped': { color: 'primary', icon: 'truck', text: 'Shipped' },
    'delivered': { color: 'success', icon: 'check-circle', text: 'Delivered' },
    'cancelled': { color: 'danger', icon: 'times-circle', text: 'Cancelled' }
};

function renderOrderStatus(status) {
    const statusInfo = orderStatuses[status] || orderStatuses.pending;
    return `
        <span class="badge bg-${statusInfo.color}">
            <i class="fas fa-${statusInfo.icon}"></i> ${statusInfo.text}
        </span>
    `;
}

function showOrderTimeline(order) {
    const timeline = `
        <div class="order-timeline">
            <div class="timeline-item ${order.status === 'pending' ? 'active' : 'completed'}">
                <i class="fas fa-clock"></i> Order Placed
            </div>
            <div class="timeline-item ${order.status === 'processing' ? 'active' : order.status === 'shipped' || order.status === 'delivered' ? 'completed' : ''}">
                <i class="fas fa-sync"></i> Processing
            </div>
            <div class="timeline-item ${order.status === 'shipped' ? 'active' : order.status === 'delivered' ? 'completed' : ''}">
                <i class="fas fa-truck"></i> Shipped
            </div>
            <div class="timeline-item ${order.status === 'delivered' ? 'active completed' : ''}">
                <i class="fas fa-check-circle"></i> Delivered
            </div>
        </div>
    `;
    return timeline;
}