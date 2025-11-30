// ===================================
// ADMIN PANEL JAVASCRIPT - PART 1
// Core Initialization & Navigation
// ===================================

// === DOCUMENT READY ===
$(document).ready(function() {
    initializeAdmin();
    setupEventListeners();
    loadDashboardData();
    setupCharts();
});

// === INITIALIZE ADMIN PANEL ===
function initializeAdmin() {
    console.log('Admin Panel Initialized 🚀');
    
    // Add mobile menu toggle button if not exists
    if ($(window).width() <= 991 && !$('.mobile-menu-toggle').length) {
        $('body').append(`
            <div class="mobile-menu-toggle">
                <i class="fas fa-bars"></i>
            </div>
            <div class="sidebar-overlay"></div>
        `);
    }
    
    // Add fade-in animation to cards
    $('.card').addClass('fade-in');
    
    // Initialize tooltips
    $('[data-bs-toggle="tooltip"]').tooltip();
}

// === SETUP ALL EVENT LISTENERS ===
function setupEventListeners() {
    // Mobile menu toggle
    $(document).on('click', '.mobile-menu-toggle', toggleMobileSidebar);
    $(document).on('click', '.sidebar-overlay', closeMobileSidebar);
    
    // Dashboard menu items - FIXED: Now actually navigates
    $('.dashboard-menu-item').on('click', handleMenuClick);
    
    // Search functionality
    $('#searchInput, input[placeholder*="Search"]').on('keyup', handleSearch);
    
    // Filter dropdowns
    $('select.form-control').on('change', handleFilter);
    
    // Window resize handler
    $(window).on('resize', handleWindowResize);
}

// === MOBILE SIDEBAR FUNCTIONS ===
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
        $('.mobile-menu-toggle').hide();
    } else {
        $('.mobile-menu-toggle').show();
    }
}

// === MENU CLICK HANDLER - FIXED VERSION ===
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
    const targetTable = $(this).closest('.container-fluid').find('table tbody');
    
    if (targetTable.length) {
        targetTable.find('tr').each(function() {
            const rowText = $(this).text().toLowerCase();
            $(this).toggle(rowText.includes(searchTerm));
        });
        
        // Show result count
        const visibleRows = targetTable.find('tr:visible').length;
        showNotification(`Found ${visibleRows} results`, 'info');
    }
}

// === FILTER FUNCTIONALITY ===
function handleFilter() {
    const filterValue = $(this).val().toLowerCase();
    const targetTable = $(this).closest('.container-fluid').find('table tbody');
    
    if (filterValue === 'all' || filterValue === 'all status' || filterValue === 'all categories' || filterValue === 'all customers') {
        targetTable.find('tr').show();
        showNotification('Showing all items', 'info');
    } else {
        let visibleCount = 0;
        targetTable.find('tr').each(function() {
            const rowText = $(this).text().toLowerCase();
            const isVisible = rowText.includes(filterValue);
            $(this).toggle(isVisible);
            if (isVisible) visibleCount++;
        });
        showNotification(`Filter applied: ${filterValue} (${visibleCount} items)`, 'success');
    }
}

// === LOAD DASHBOARD DATA ===
function loadDashboardData() {
    // Simulate loading stats
    animateCounters();
    
    // Update recent activity
    updateRecentActivity();
}

// === ANIMATE COUNTERS ===
function animateCounters() {
    $('.card h3').each(function() {
        const $this = $(this);
        const countText = $this.text();
        
        // Extract number from text
        const matches = countText.match(/[\d,]+/);
        if (matches) {
            const countTo = parseInt(matches[0].replace(/,/g, ''));
            const prefix = countText.includes('$') ? '$' : '';
            const suffix = countText.includes('%') ? '%' : '';
            
            $({ countNum: 0 }).animate({
                countNum: countTo
            }, {
                duration: 2000,
                easing: 'swing',
                step: function() {
                    const num = Math.floor(this.countNum).toLocaleString();
                    $this.text(prefix + num + suffix);
                },
                complete: function() {
                    const num = countTo.toLocaleString();
                    $this.text(prefix + num + suffix);
                }
            });
        }
    });
}

// === UPDATE RECENT ACTIVITY ===
function updateRecentActivity() {
    // Simulate real-time updates
    setInterval(() => {
        const badge = $('#notificationBadge');
        if (badge.length) {
            const count = parseInt(badge.text()) || 0;
            badge.text(count + 1);
            badge.addClass('pulse');
            setTimeout(() => badge.removeClass('pulse'), 500);
        }
    }, 30000); // Every 30 seconds
}

// === NOTIFICATION SYSTEM ===
function showNotification(message, type = 'info') {
    // Remove existing notifications
    $('.admin-notification').remove();
    
    // Create notification element
    const notification = $(`
        <div class="admin-notification alert alert-${type} shadow-lg" role="alert">
            <i class="fas fa-${getNotificationIcon(type)} me-2"></i>
            ${message}
        </div>
    `);
    
    // Add styles
    notification.css({
        position: 'fixed',
        top: '90px',
        right: '20px',
        zIndex: 9999,
        minWidth: '300px',
        maxWidth: '400px',
        animation: 'slideIn 0.3s ease-out'
    });
    
    // Append to body
    $('body').append(notification);
    
    // Auto remove after 3 seconds
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

console.log('Admin Part 1: Core Functions Loaded! ✅');

// ===================================
// ADMIN PANEL JAVASCRIPT - PART 2
// Button Actions & Table Management
// ===================================

// Add this to your document ready in Part 1
$(document).ready(function() {
    setupButtonActions();
    setupPagination();
});

// === BUTTON ACTIONS ===
function setupButtonActions() {
    // View button - Details page
    $(document).on('click', '.btn-info:has(.fa-eye), .btn-primary:contains("View")', function(e) {
        e.preventDefault();
        
        const row = $(this).closest('tr');
        const itemName = row.find('td:nth-child(3), td:nth-child(2)').first().text().trim();
        const itemId = row.find('td:first-child').text().trim();
        
        showNotification('Opening details for: ' + itemName, 'info');
        
        // You can redirect to detail page here
        // window.location.href = 'order-detail.html?id=' + itemId;
    });
    
    // Edit button
    $(document).on('click', '.btn-warning:has(.fa-edit)', function(e) {
        e.preventDefault();
        
        const row = $(this).closest('tr');
        const itemName = row.find('td:nth-child(3), td:nth-child(2)').first().text().trim();
        
        showNotification('Opening editor for: ' + itemName, 'warning');
        
        // Redirect to edit page
        // window.location.href = 'edit-product.html?name=' + encodeURIComponent(itemName);
    });
    
    // Delete button
    $(document).on('click', '.btn-danger:has(.fa-trash)', function(e) {
        e.preventDefault();
        
        const row = $(this).closest('tr');
        const itemName = row.find('td:nth-child(3), td:nth-child(2)').first().text().trim();
        const itemId = row.find('td:first-child').text().trim();
        
        if (confirm('Are you sure you want to delete:\n\n' + itemName + '\n\nThis action cannot be undone!')) {
            // Animate removal
            row.fadeOut(400, function() {
                $(this).remove();
                showNotification('Deleted: ' + itemName, 'danger');
                
                // Update stats
                updateStatCards();
            });
        }
    });
    
    // Approve/Check button (Orders page)
    $(document).on('click', '.btn-success:has(.fa-check)', function(e) {
        e.preventDefault();
        
        const row = $(this).closest('tr');
        const badge = row.find('.badge');
        const itemName = row.find('td:nth-child(3)').text().trim();
        
        // Update status
        badge.removeClass('bg-warning bg-danger bg-info').addClass('bg-success').text('Completed');
        
        showNotification('Order approved: ' + itemName, 'success');
        
        // Disable button after approval
        $(this).prop('disabled', true).html('<i class="fas fa-check"></i> Approved');
    });
    
    // Ban/Block button (Customers page)
    $(document).on('click', '.btn-danger:has(.fa-ban)', function(e) {
        e.preventDefault();
        
        const row = $(this).closest('tr');
        const customerName = row.find('td:nth-child(2)').text().trim();
        const badge = row.find('.badge');
        
        if (confirm('Are you sure you want to ban:\n\n' + customerName + '\n\nThey will no longer be able to access their account.')) {
            // Update status
            badge.removeClass('bg-success bg-warning').addClass('bg-danger').text('Banned');
            
            showNotification('User banned: ' + customerName, 'warning');
            
            // Change button to unban
            $(this).removeClass('btn-danger').addClass('btn-success')
                .html('<i class="fas fa-user-check"></i>')
                .attr('title', 'Unban User');
        }
    });
    
    // Add New Product button
    $(document).on('click', '.btn-primary:contains("Add New Product")', function(e) {
        // Let this navigate normally
        showNotification('Opening product creation form...', 'info');
    });
    
    // Back to Products button
    $(document).on('click', '.btn-secondary:contains("Back to Products")', function(e) {
        // Let this navigate normally
        showNotification('Returning to products list...', 'info');
    });
    
    // Export buttons (if any)
    $(document).on('click', '.btn:contains("Export")', function(e) {
        e.preventDefault();
        const format = $(this).text().includes('PDF') ? 'PDF' : 'Excel';
        exportTableData(format);
    });
}

// === UPDATE STAT CARDS ===
function updateStatCards() {
    // Update total counts in stat cards
    const totalRows = $('table tbody tr').length;
    const completedRows = $('table tbody tr .badge.bg-success').length;
    const processingRows = $('table tbody tr .badge.bg-warning').length;
    const pendingRows = $('table tbody tr .badge.bg-danger, table tbody tr .badge.bg-info').length;
    
    // Update cards if they exist
    $('.card.bg-primary h3').text(totalRows);
    $('.card.bg-success h3').text(completedRows);
    $('.card.bg-warning h3').text(processingRows);
    $('.card.bg-danger h3, .card.bg-info h3').text(pendingRows);
}

// === PAGINATION FUNCTIONALITY ===
function setupPagination() {
    $('.pagination .page-link').on('click', function(e) {
        e.preventDefault();
        
        const pageText = $(this).text();
        
        // Don't process if disabled
        if ($(this).parent().hasClass('disabled')) {
            return;
        }
        
        // Update active state
        $('.pagination .page-item').removeClass('active');
        $(this).parent().addClass('active');
        
        // Show notification for number pages only
        if (!isNaN(pageText)) {
            showNotification('Loading page ' + pageText, 'info');
        }
        
        // Scroll to top smoothly
        $('html, body').animate({ scrollTop: 0 }, 600);
        
        // Simulate loading
        $('table tbody').css('opacity', '0.5');
        setTimeout(() => {
            $('table tbody').css('opacity', '1');
        }, 500);
    });
}

// === COPY TO CLIPBOARD ===
function copyToClipboard(text) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            showNotification('Copied to clipboard!', 'success');
        }).catch(() => {
            fallbackCopyToClipboard(text);
        });
    } else {
        fallbackCopyToClipboard(text);
    }
}

function fallbackCopyToClipboard(text) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    document.body.appendChild(textArea);
    textArea.select();
    
    try {
        document.execCommand('copy');
        showNotification('Copied to clipboard!', 'success');
    } catch (err) {
        showNotification('Failed to copy', 'danger');
    }
    
    document.body.removeChild(textArea);
}

// === EXPORT TABLE DATA ===
function exportTableData(format) {
    showNotification('Preparing ' + format + ' export...', 'info');
    
    setTimeout(() => {
        showNotification('Export completed! Download starting...', 'success');
        // In real app, would generate and download file
        // generateExport(format);
    }, 1500);
}

// === BULK ACTIONS ===
function setupBulkActions() {
    // Select all checkbox
    $(document).on('change', '#selectAll', function() {
        const isChecked = $(this).is(':checked');
        $('table tbody input[type="checkbox"]').prop('checked', isChecked);
        
        const count = $('table tbody input[type="checkbox"]:checked').length;
        if (count > 0) {
            showNotification(count + ' items selected', 'info');
        }
    });
    
    // Individual checkbox
    $(document).on('change', 'table tbody input[type="checkbox"]', function() {
        const checkedCount = $('table tbody input[type="checkbox"]:checked').length;
        const totalCount = $('table tbody input[type="checkbox"]').length;
        
        // Update select all checkbox
        $('#selectAll').prop('checked', checkedCount === totalCount);
    });
}

// === QUICK EDIT (Inline editing) ===
function enableQuickEdit() {
    $(document).on('dblclick', 'table tbody td:not(:last-child)', function() {
        const $td = $(this);
        const currentValue = $td.text().trim();
        
        // Don't edit if it contains badge or image
        if ($td.find('.badge, img').length) return;
        
        const input = $('<input type="text" class="form-control form-control-sm">').val(currentValue);
        
        $td.html(input);
        input.focus().select();
        
        // Save on blur or enter
        input.on('blur keypress', function(e) {
            if (e.type === 'blur' || e.which === 13) {
                const newValue = $(this).val().trim();
                $td.text(newValue || currentValue);
                showNotification('Value updated', 'success');
            }
        });
        
        // Cancel on escape
        input.on('keydown', function(e) {
            if (e.which === 27) {
                $td.text(currentValue);
            }
        });
    });
}

console.log('Admin Part 2: Button Actions Loaded! ✅');

// ===================================
// ADMIN PANEL JAVASCRIPT - PART 3
// Forms, Validation & Charts
// ===================================

// Add this to your document ready in Part 1
$(document).ready(function() {
    setupFormHandlers();
    setupCharts();
});

// === FORM HANDLERS ===
function setupFormHandlers() {
    // Product form submission
    $('form').on('submit', function(e) {
        e.preventDefault();
        
        const form = $(this);
        
        // Validate form
        if (validateForm(form)) {
            const formTitle = form.closest('.container-fluid').find('h2').text().trim();
            const submitBtn = form.find('button[type="submit"]');
            const originalText = submitBtn.html();
            
            // Show loading
            submitBtn.html('<i class="fas fa-spinner fa-spin"></i> Saving...').prop('disabled', true);
            
            // Simulate save
            setTimeout(() => {
                submitBtn.html('<i class="fas fa-check"></i> Saved!').removeClass('btn-primary').addClass('btn-success');
                showNotification(formTitle + ' - Saved successfully!', 'success');
                
                // Reset button and form
                setTimeout(() => {
                    submitBtn.html(originalText).removeClass('btn-success').addClass('btn-primary').prop('disabled', false);
                    
                    // Only reset if it's a create form
                    if (formTitle.includes('Create')) {
                        form[0].reset();
                        $('.is-valid, .is-invalid').removeClass('is-valid is-invalid');
                    }
                }, 2000);
            }, 1500);
        } else {
            showNotification('Please fill in all required fields correctly', 'danger');
        }
    });
    
    // Cancel/Reset button
    $(document).on('click', 'button[type="reset"], .btn:contains("Cancel")', function(e) {
        const form = $(this).closest('form');
        
        if (form.find('input, textarea, select').filter(function() {
            return $(this).val() !== '';
        }).length > 0) {
            if (confirm('Are you sure you want to cancel? All unsaved changes will be lost.')) {
                form[0].reset();
                $('.is-valid, .is-invalid').removeClass('is-valid is-invalid');
                showNotification('Form reset', 'info');
            } else {
                e.preventDefault();
            }
        }
    });
    
    // File upload preview
    $('input[type="file"]').on('change', function() {
        const files = this.files;
        const fileCount = files.length;
        
        if (fileCount > 0) {
            let fileNames = [];
            for (let i = 0; i < Math.min(fileCount, 3); i++) {
                fileNames.push(files[i].name);
            }
            
            const message = fileCount === 1 
                ? 'File selected: ' + fileNames[0]
                : fileNames.join(', ') + (fileCount > 3 ? ' and ' + (fileCount - 3) + ' more...' : '');
            
            showNotification(message, 'info');
            
            // Preview images if it's an image file
            if (this.accept && this.accept.includes('image')) {
                previewImages(this);
            }
        }
    });
    
    // Price calculation
    $('input[placeholder="99.00"]').on('input', calculateFinalPrice);
    $('input[placeholder="0"]').on('input', calculateFinalPrice);
    
    // Real-time validation
    $('input[required], textarea[required], select[required]').on('blur', function() {
        validateField($(this));
    });
}

// === FORM VALIDATION ===
function validateForm(form) {
    let isValid = true;
    
    form.find('[required]').each(function() {
        if (!validateField($(this))) {
            isValid = false;
        }
    });
    
    return isValid;
}

function validateField(field) {
    const value = field.val().trim();
    const fieldType = field.attr('type');
    let isValid = true;
    let errorMessage = '';
    
    // Check if empty
    if (!value) {
        isValid = false;
        errorMessage = 'This field is required';
    }
    // Email validation
    else if (fieldType === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        }
    }
    // URL validation
    else if (fieldType === 'url') {
        try {
            new URL(value);
        } catch {
            isValid = false;
            errorMessage = 'Please enter a valid URL';
        }
    }
    // Number validation
    else if (fieldType === 'number') {
        if (isNaN(value) || parseFloat(value) < 0) {
            isValid = false;
            errorMessage = 'Please enter a valid positive number';
        }
    }
    
    // Update field appearance
    if (isValid) {
        field.removeClass('is-invalid').addClass('is-valid');
        field.next('.invalid-feedback').remove();
    } else {
        field.removeClass('is-valid').addClass('is-invalid');
        
        if (!field.next('.invalid-feedback').length) {
            field.after(`<div class="invalid-feedback">${errorMessage}</div>`);
        } else {
            field.next('.invalid-feedback').text(errorMessage);
        }
    }
    
    return isValid;
}

// === CALCULATE FINAL PRICE ===
function calculateFinalPrice() {
    const priceInput = $('input[placeholder="99.00"]');
    const discountInput = $('input[placeholder="0"]');
    const finalPriceInput = $('input[readonly][value*="$"]');
    
    const price = parseFloat(priceInput.val()) || 0;
    const discount = parseFloat(discountInput.val()) || 0;
    
    // Calculate final price
    const finalPrice = price - (price * discount / 100);
    
    // Update final price field
    finalPriceInput.val('$' + finalPrice.toFixed(2));
    
    // Show savings if discount applied
    if (discount > 0) {
        const savings = price - finalPrice;
        showNotification(`Discount: ${discount}% - Save $${savings.toFixed(2)}`, 'success');
    }
}

// === PREVIEW IMAGES ===
function previewImages(input) {
    const previewContainer = $(input).next('.image-preview');
    
    if (!previewContainer.length) {
        $(input).after('<div class="image-preview mt-2 d-flex flex-wrap gap-2"></div>');
    }
    
    const container = $(input).next('.image-preview');
    container.empty();
    
    if (input.files) {
        Array.from(input.files).slice(0, 5).forEach(file => {
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                
                reader.onload = function(e) {
                    const img = $('<img>')
                        .attr('src', e.target.result)
                        .css({
                            'width': '100px',
                            'height': '100px',
                            'object-fit': 'cover',
                            'border-radius': '8px',
                            'border': '2px solid #ddd'
                        });
                    container.append(img);
                };
                
                reader.readAsDataURL(file);
            }
        });
    }
}

// === SETUP CHARTS ===
function setupCharts() {
    // Sales Chart
    const salesCtx = document.getElementById('salesChart');
    if (salesCtx) {
        new Chart(salesCtx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                datasets: [{
                    label: 'Sales ($)',
                    data: [12000, 19000, 15000, 25000, 22000, 30000, 28000, 35000, 32000, 40000, 38000, 45000],
                    borderColor: 'rgb(99, 102, 241)',
                    backgroundColor: 'rgba(99, 102, 241, 0.1)',
                    tension: 0.4,
                    fill: true,
                    pointRadius: 5,
                    pointHoverRadius: 7,
                    pointBackgroundColor: 'rgb(99, 102, 241)',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top',
                        labels: {
                            font: {
                                size: 12,
                                weight: 'bold'
                            }
                        }
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        padding: 12,
                        callbacks: {
                            label: function(context) {
                                return 'Sales: $' + context.parsed.y.toLocaleString();
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return '$' + value.toLocaleString();
                            }
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                },
                interaction: {
                    mode: 'nearest',
                    axis: 'x',
                    intersect: false
                }
            }
        });
    }

    // Category Chart
    const categoryCtx = document.getElementById('categoryChart');
    if (categoryCtx) {
        new Chart(categoryCtx, {
            type: 'doughnut',
            data: {
                labels: ['Websites', 'Apps', 'APIs', 'AI Tools', 'Courses'],
                datasets: [{
                    data: [30, 25, 20, 15, 10],
                    backgroundColor: [
                        'rgb(255, 99, 132)',
                        'rgb(54, 162, 235)',
                        'rgb(255, 205, 86)',
                        'rgb(75, 192, 192)',
                        'rgb(153, 102, 255)'
                    ],
                    borderWidth: 3,
                    borderColor: '#fff',
                    hoverOffset: 10
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            padding: 15,
                            font: {
                                size: 11
                            }
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                        padding: 12,
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.parsed || 0;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = ((value / total) * 100).toFixed(1);
                                return label + ': ' + percentage + '%';
                            }
                        }
                    }
                }
            }
        });
    }
}

// === AUTO-SAVE DRAFT ===
function enableAutoSave() {
    let autoSaveTimer;
    
    $('form input, form textarea, form select').on('input change', function() {
        clearTimeout(autoSaveTimer);
        
        autoSaveTimer = setTimeout(() => {
            const formData = {};
            $(this).closest('form').find('input, textarea, select').each(function() {
                if ($(this).attr('name')) {
                    formData[$(this).attr('name')] = $(this).val();
                }
            });
            
            // Save to localStorage
            localStorage.setItem('admin_form_draft', JSON.stringify(formData));
            
            // Show subtle notification
            console.log('Draft saved automatically');
        }, 2000);
    });
}

console.log('Admin Part 3: Forms & Charts Loaded! ✅');


// ===================================
// ADMIN SUPPORT SYSTEM
// Real-time Customer Support Management
// ===================================

// Global variables
let currentChatId = null;
let conversations = [];
let autoRefreshInterval = null;

// === DOCUMENT READY ===
$(document).ready(function() {
    console.log('Admin Support System Initialized! 💬');
    
    initializeSupport();
    loadConversations();
    setupSupportListeners();
    startAutoRefresh();
});

// === INITIALIZE SUPPORT SYSTEM ===
function initializeSupport() {
    // Load conversations from localStorage (simulating database)
    const savedConversations = localStorage.getItem('supportConversations');
    if (savedConversations) {
        conversations = JSON.parse(savedConversations);
    } else {
        // Create demo conversations
        conversations = createDemoConversations();
        saveConversations();
    }
    
    updateStats();
}

// === CREATE DEMO CONVERSATIONS ===
function createDemoConversations() {
    return [
        {
            id: 'chat_001',
            userId: 'user_001',
            userName: 'John Doe',
            userEmail: 'john@example.com',
            userAvatar: 'https://i.pravatar.cc/150?img=1',
            status: 'online',
            lastMessage: 'Hi, I need help with my order #ORD-1234',
            lastMessageTime: new Date(Date.now() - 300000).toISOString(), // 5 mins ago
            unread: true,
            messages: [
                {
                    id: 'msg_001',
                    from: 'customer',
                    text: 'Hello! I need some help.',
                    time: new Date(Date.now() - 600000).toISOString(),
                    status: 'read'
                },
                {
                    id: 'msg_002',
                    from: 'customer',
                    text: 'I placed an order yesterday (Order #ORD-1234) but haven\'t received any confirmation email.',
                    time: new Date(Date.now() - 300000).toISOString(),
                    status: 'delivered'
                }
            ]
        },
        {
            id: 'chat_002',
            userId: 'user_002',
            userName: 'Sarah Smith',
            userEmail: 'sarah@example.com',
            userAvatar: 'https://i.pravatar.cc/150?img=5',
            status: 'online',
            lastMessage: 'Thank you so much!',
            lastMessageTime: new Date(Date.now() - 1800000).toISOString(), // 30 mins ago
            unread: false,
            messages: [
                {
                    id: 'msg_003',
                    from: 'customer',
                    text: 'How do I download my purchased product?',
                    time: new Date(Date.now() - 3600000).toISOString(),
                    status: 'read'
                },
                {
                    id: 'msg_004',
                    from: 'admin',
                    text: 'Hello! You can download your product from the Downloads page in your dashboard.',
                    time: new Date(Date.now() - 2400000).toISOString(),
                    status: 'read'
                },
                {
                    id: 'msg_005',
                    from: 'customer',
                    text: 'Thank you so much!',
                    time: new Date(Date.now() - 1800000).toISOString(),
                    status: 'read'
                }
            ]
        },
        {
            id: 'chat_003',
            userId: 'user_003',
            userName: 'Mike Wilson',
            userEmail: 'mike@example.com',
            userAvatar: 'https://i.pravatar.cc/150?img=8',
            status: 'away',
            lastMessage: 'Can you help me with payment options?',
            lastMessageTime: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
            unread: true,
            messages: [
                {
                    id: 'msg_006',
                    from: 'customer',
                    text: 'Can you help me with payment options?',
                    time: new Date(Date.now() - 7200000).toISOString(),
                    status: 'delivered'
                }
            ]
        }
    ];
}

// === LOAD CONVERSATIONS ===
function loadConversations(filter = 'all') {
    const container = $('#chatListContainer');
    container.empty();
    
    let filteredConversations = conversations;
    
    // Apply filter
    if (filter === 'unread') {
        filteredConversations = conversations.filter(c => c.unread);
    } else if (filter === 'active') {
        filteredConversations = conversations.filter(c => c.status === 'online');
    }
    
    // Sort by last message time
    filteredConversations.sort((a, b) => 
        new Date(b.lastMessageTime) - new Date(a.lastMessageTime)
    );
    
    if (filteredConversations.length === 0) {
        container.html(`
            <div class="text-center py-5 text-muted">
                <i class="fas fa-inbox fa-3x mb-3"></i>
                <p>No conversations found</p>
            </div>
        `);
        return;
    }
    
    filteredConversations.forEach(chat => {
        const chatItem = createChatListItem(chat);
        container.append(chatItem);
    });
    
    updateStats();
}

// === CREATE CHAT LIST ITEM ===
function createChatListItem(chat) {
    const timeAgo = getTimeAgo(chat.lastMessageTime);
    const unreadClass = chat.unread ? 'unread' : '';
    const activeClass = chat.id === currentChatId ? 'active' : '';
    
    return $(`
        <div class="chat-item ${unreadClass} ${activeClass}" data-chat-id="${chat.id}">
            <div class="chat-item-header">
                <div class="d-flex align-items-center">
                    <img src="${chat.userAvatar}" alt="${chat.userName}" class="rounded-circle me-2" width="40" height="40">
                    <h6 class="chat-item-name mb-0">${chat.userName}</h6>
                </div>
                <span class="chat-item-time">${timeAgo}</span>
            </div>
            <p class="chat-item-message">${chat.lastMessage}</p>
            <div class="chat-item-status">
                <span class="status-indicator ${chat.status}"></span>
                <small class="text-muted">${chat.status}</small>
            </div>
        </div>
    `);
}

// === OPEN CHAT ===
function openChat(chatId) {
    const chat = conversations.find(c => c.id === chatId);
    if (!chat) return;
    
    currentChatId = chatId;
    
    // Mark as read
    chat.unread = false;
    saveConversations();
    
    // Update UI
    $('.chat-item').removeClass('active');
    $(`.chat-item[data-chat-id="${chatId}"]`).addClass('active').removeClass('unread');
    
    // Update header
    $('#chatHeaderEmpty').addClass('d-none');
    $('#chatHeaderActive').removeClass('d-none');
    $('#currentUserAvatar').attr('src', chat.userAvatar);
    $('#currentUserName').text(chat.userName);
    $('#currentUserStatus').html(`
        <span class="status-indicator ${chat.status}"></span> ${chat.status}
    `);
    
    // Show footer
    $('#footerEmpty').addClass('d-none');
    $('#replyForm').removeClass('d-none');
    
    // Load messages
    loadMessages(chat);
    
    updateStats();
}

// === LOAD MESSAGES ===
function loadMessages(chat) {
    const container = $('#chatMessagesContainer');
    container.empty();
    
    let currentDate = null;
    
    chat.messages.forEach((msg, index) => {
        const msgDate = new Date(msg.time).toDateString();
        
        // Add date separator if date changed
        if (msgDate !== currentDate) {
            currentDate = msgDate;
            container.append(createDateSeparator(msg.time));
        }
        
        const messageGroup = createMessageBubble(msg, chat);
        container.append(messageGroup);
    });
    
    // Show typing indicator if customer is typing (random simulation)
    if (chat.status === 'online' && Math.random() > 0.7) {
        container.append(createTypingIndicator(chat));
    }
    
    // Scroll to bottom
    container.scrollTop(container[0].scrollHeight);
}

// === CREATE MESSAGE BUBBLE ===
function createMessageBubble(msg, chat) {
    const time = new Date(msg.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const isAdmin = msg.from === 'admin';
    const avatar = isAdmin ? 'https://i.pravatar.cc/150?img=20' : chat.userAvatar;
    
    let statusIcon = '';
    if (isAdmin) {
        statusIcon = msg.status === 'read' 
            ? '<i class="fas fa-check-double text-primary"></i>' 
            : '<i class="fas fa-check"></i>';
    }
    
    return $(`
        <div class="message-group ${msg.from}">
            <img src="${avatar}" alt="Avatar" class="message-avatar">
            <div class="message-content">
                <div class="message-bubble">
                    ${msg.text}
                </div>
                <div class="message-time">
                    ${time}
                    ${isAdmin ? `<span class="message-status">${statusIcon} ${msg.status}</span>` : ''}
                </div>
            </div>
        </div>
    `);
}

// === CREATE DATE SEPARATOR ===
function createDateSeparator(timestamp) {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    let dateText;
    if (date.toDateString() === today.toDateString()) {
        dateText = 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
        dateText = 'Yesterday';
    } else {
        dateText = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
    
    return $(`
        <div class="date-separator">
            <span>${dateText}</span>
        </div>
    `);
}

// === CREATE TYPING INDICATOR ===
function createTypingIndicator(chat) {
    return $(`
        <div class="message-group customer">
            <img src="${chat.userAvatar}" alt="Avatar" class="message-avatar">
            <div class="message-content">
                <div class="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        </div>
    `);
}

// === SEND REPLY ===
function sendReply(text) {
    if (!currentChatId || !text.trim()) return;
    
    const chat = conversations.find(c => c.id === currentChatId);
    if (!chat) return;
    
    const newMessage = {
        id: 'msg_' + Date.now(),
        from: 'admin',
        text: text.trim(),
        time: new Date().toISOString(),
        status: 'delivered'
    };
    
    chat.messages.push(newMessage);
    chat.lastMessage = text.trim();
    chat.lastMessageTime = new Date().toISOString();
    
    saveConversations();
    
    // Update UI
    loadMessages(chat);
    loadConversations();
    
    // Clear input
    $('#messageInput').val('');
    
    // Show notification
    showNotification('Message sent!', 'success');
    
    // Simulate customer reading the message
    setTimeout(() => {
        newMessage.status = 'read';
        saveConversations();
        loadMessages(chat);
    }, 3000);
}

// === SETUP LISTENERS ===
function setupSupportListeners() {
    // Chat item click
    $(document).on('click', '.chat-item', function() {
        const chatId = $(this).data('chat-id');
        openChat(chatId);
    });
    
    // Send message
    $('#replyForm').on('submit', function(e) {
        e.preventDefault();
        const message = $('#messageInput').val();
        sendReply(message);
    });
    
    // Quick replies
    $('.quick-replies .dropdown-item').on('click', function(e) {
        e.preventDefault();
        const reply = $(this).data('reply');
        $('#messageInput').val(reply);
        $('#messageInput').focus();
    });
    
    // Filter buttons
    $('.filter-btn').on('click', function() {
        $('.filter-btn').removeClass('active');
        $(this).addClass('active');
        const filter = $(this).data('filter');
        loadConversations(filter);
    });
    
    // Search chats
    $('#searchChats').on('keyup', function() {
        const searchTerm = $(this).val().toLowerCase();
        $('.chat-item').each(function() {
            const text = $(this).text().toLowerCase();
            $(this).toggle(text.includes(searchTerm));
        });
    });
    
    // Close conversation
    $('#closeConversation').on('click', function() {
        if (confirm('Are you sure you want to close this conversation?')) {
            currentChatId = null;
            $('#chatHeaderActive').addClass('d-none');
            $('#chatHeaderEmpty').removeClass('d-none');
            $('#replyForm').addClass('d-none');
            $('#footerEmpty').removeClass('d-none');
            $('#chatMessagesContainer').empty();
            $('.chat-item').removeClass('active');
        }
    });
    
    // View user profile
    $('#viewUserProfile').on('click', function() {
        const chat = conversations.find(c => c.id === currentChatId);
        if (chat) {
            showNotification('Opening profile: ' + chat.userName, 'info');
            // You can redirect to customer profile page
        }
    });
    
    // Attach file
    $('#attachFile').on('click', function() {
        const input = $('<input type="file" accept="image/*,application/pdf">');
        input.on('change', function() {
            if (this.files && this.files[0]) {
                showNotification('File selected: ' + this.files[0].name, 'success');
                // In real app, upload file here
            }
        });
        input.click();
    });
}

// === UPDATE STATS ===
function updateStats() {
    const total = conversations.length;
    const unread = conversations.filter(c => c.unread).length;
    const active = conversations.filter(c => c.status === 'online').length;
    
    $('#totalChats').text(total);
    $('#unreadChats').text(unread);
    $('#activeChats').text(active);
    $('#unreadCount').text(unread);
    $('#sidebarUnreadCount').text(unread).toggle(unread > 0);
}

// === AUTO REFRESH ===
function startAutoRefresh() {
    // Simulate new messages every 30 seconds
    autoRefreshInterval = setInterval(() => {
        // Random chance of new message
        if (Math.random() > 0.7 && conversations.length > 0) {
            const randomChat = conversations[Math.floor(Math.random() * conversations.length)];
            simulateNewMessage(randomChat);
        }
    }, 30000);
}

// === SIMULATE NEW MESSAGE ===
function simulateNewMessage(chat) {
    const responses = [
        'Thank you for your help!',
        'I understand now.',
        'When will this be resolved?',
        'Can you give me more details?',
        'Perfect, thank you!'
    ];
    
    const newMessage = {
        id: 'msg_' + Date.now(),
        from: 'customer',
        text: responses[Math.floor(Math.random() * responses.length)],
        time: new Date().toISOString(),
        status: 'delivered'
    };
    
    chat.messages.push(newMessage);
    chat.lastMessage = newMessage.text;
    chat.lastMessageTime = newMessage.time;
    chat.unread = true;
    
    saveConversations();
    loadConversations();
    
    if (currentChatId === chat.id) {
        loadMessages(chat);
    }
    
    // Show notification
    showNotification('New message from ' + chat.userName, 'info');
    
    // Play notification sound (optional)
    playNotificationSound();
}

// === SAVE CONVERSATIONS ===
function saveConversations() {
    localStorage.setItem('supportConversations', JSON.stringify(conversations));
}

// === UTILITY FUNCTIONS ===
function getTimeAgo(timestamp) {
    const now = new Date();
    const time = new Date(timestamp);
    const diff = Math.floor((now - time) / 1000); // seconds
    
    if (diff < 60) return 'Just now';
    if (diff < 3600) return Math.floor(diff / 60) + 'm ago';
    if (diff < 86400) return Math.floor(diff / 3600) + 'h ago';
    return Math.floor(diff / 86400) + 'd ago';
}

function playNotificationSound() {
    // Create and play notification sound
    const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiDYHGGS57OdmTgwOUKXh7q1jHQU2jdXvvnkpBip+yO/XkD8KFGK36OunWBYLRJvd8LpnIAUpfsju15BAChFfteXp');
    audio.volume = 0.3;
    audio.play().catch(() => {}); // Ignore errors
}

// === NOTIFICATION SYSTEM (Use existing from admin.js) ===
function showNotification(message, type = 'info') {
    $('.admin-notification').remove();
    
    const notification = $(`
        <div class="admin-notification alert alert-${type} shadow-lg" role="alert">
            <i class="fas fa-${getNotificationIcon(type)} me-2"></i>
            ${message}
        </div>
    `);
    
    notification.css({
        position: 'fixed',
        top: '90px',
        right: '20px',
        zIndex: 9999,
        minWidth: '300px',
        maxWidth: '400px'
    });
    
    $('body').append(notification);
    
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

console.log('Admin Support System Loaded! ✅');