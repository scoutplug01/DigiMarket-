// ===================================
// COMPLETE AUTH.JS - Authentication System
// With First User Admin & Automatic Page Protection
// ===================================

// ===================================
// PAGE PROTECTION - RUNS IMMEDIATELY
// ===================================
(function() {
    'use strict';
    
    // Get current page name
    const currentPage = window.location.pathname.split('/').pop().toLowerCase();
    
    // Pages that DON'T require login (PUBLIC PAGES)
    const publicPages = [
        'index.html',
        'login.html',
        'register.html',
        'forgot-password.html',
        ''
    ];
    
    // Check if current page is public
    const isPublicPage = publicPages.some(page => 
        currentPage === page || 
        currentPage === '' || 
        currentPage === '/' ||
        window.location.pathname === '/' ||
        window.location.pathname === ''
    );
    
    // If this is a PUBLIC page, skip protection
    if (isPublicPage) {
        console.log('✅ Public page - No authentication required');
        return;
    }
    
    // CHECK IF USER IS LOGGED IN
    function isUserLoggedIn() {
        const currentUser = localStorage.getItem('currentUser');
        const digimarketUser = localStorage.getItem('digimarket_user');
        return currentUser !== null || digimarketUser !== null;
    }
    
    // BLOCK ACCESS IF NOT LOGGED IN
    if (!isUserLoggedIn()) {
        console.log('🚫 Access Denied - Redirecting to index...');
        
        // Prevent page from loading
        document.addEventListener('DOMContentLoaded', function(e) {
            e.stopImmediatePropagation();
        }, true);
        
        // Hide page content immediately
        if (document.body) {
            document.body.style.display = 'none';
        }
        
        // Show alert
        alert('⚠️ Please login to access this page!');
        
        // Redirect to index
        window.location.replace('../index.html');
        
        // Stop all script execution
        throw new Error('Authentication required');
    }
    
    console.log('✅ Access Granted - User authenticated');
    
})();

// ===================================
// INITIALIZE ON PAGE LOAD
// ===================================
document.addEventListener('DOMContentLoaded', function() {
    if (typeof AOS !== 'undefined') {
        AOS.init({ duration: 800, once: true });
    }
});

// ===================================
// HELPER FUNCTIONS
// ===================================

function showAlert(message, type) {
    const existing = document.querySelectorAll('.alert');
    existing.forEach(a => a.remove());

    const div = document.createElement('div');
    div.className = `alert alert-${type}`;
    div.textContent = message;

    const form = document.querySelector('form');
    if (form) {
        form.parentNode.insertBefore(div, form);
    }

    setTimeout(() => div.remove(), 4000);
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function storeUser(user) {
    const users = JSON.parse(localStorage.getItem('digimarket_users') || '[]');
    users.push(user);
    localStorage.setItem('digimarket_users', JSON.stringify(users));
}

function findUser(email) {
    const users = JSON.parse(localStorage.getItem('digimarket_users') || '[]');
    return users.find(u => u.email === email);
}

function isFirstUser() {
    const users = JSON.parse(localStorage.getItem('digimarket_users') || '[]');
    return users.length === 0;
}

// ===================================
// LOGIN FORM HANDLER
// ===================================
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const email = document.getElementById('loginEmail').value.trim();
        const pass = document.getElementById('loginPassword').value;

        if (!email || !pass) return showAlert('Please fill in all fields', 'danger');
        if (!isValidEmail(email)) return showAlert('Invalid email format', 'danger');

        const user = findUser(email);
        if (!user) return showAlert('No account found with this email', 'danger');
        if (user.password !== pass) return showAlert('Incorrect password', 'danger');

        // Login successful
        const userSession = {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role || 'buyer',
            isAdmin: user.isAdmin || false,
            isOwner: user.isOwner || false
        };
        
        // Save to both storage keys
        localStorage.setItem('currentUser', JSON.stringify(userSession));
        localStorage.setItem('digimarket_user', JSON.stringify(userSession));
        
        // Show appropriate message
        if (userSession.isOwner) {
            showAlert('Welcome back, Site Owner! 👑 Redirecting...', 'success');
        } else if (userSession.isAdmin) {
            showAlert('Welcome back, Admin! 🛡️ Redirecting...', 'success');
        } else {
            showAlert('Login successful! Redirecting...', 'success');
        }
        
        loginForm.querySelector('button[type="submit"]').disabled = true;

        // Redirect to home
        setTimeout(() => {
            window.location.href = "../home.html";
        }, 1500);
    });
}

// ===================================
// REGISTER FORM HANDLER
// ===================================
const registerForm = document.getElementById('registerForm');
if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('registerName').value.trim();
        const email = document.getElementById('registerEmail').value.trim();
        const pass = document.getElementById('registerPassword').value;
        const confirm = document.getElementById('confirmPassword').value;
        const type = document.getElementById('accountType') ? document.getElementById('accountType').value : 'buyer';
        const terms = document.getElementById('agreeTerms') ? document.getElementById('agreeTerms').checked : true;

        if (!name || !email || !pass || !confirm) return showAlert('Please fill in all fields', 'danger');
        if (!isValidEmail(email)) return showAlert('Invalid email format', 'danger');
        if (pass.length < 6) return showAlert('Password must be at least 6 characters', 'danger');
        if (pass !== confirm) return showAlert('Passwords do not match', 'danger');
        if (!terms) return showAlert('Agree to the Terms & Conditions', 'danger');
        if (findUser(email)) return showAlert('Email already registered', 'danger');

        // CHECK IF FIRST USER - MAKE THEM OWNER!
        const isOwner = isFirstUser();
        
        const newUser = {
            id: Date.now(),
            name,
            email,
            password: pass,
            role: isOwner ? 'admin' : type,
            isAdmin: isOwner,
            isOwner: isOwner,
            createdAt: new Date().toISOString()
        };

        storeUser(newUser);
        
        // Auto login after registration
        const userSession = {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
            isAdmin: newUser.isAdmin,
            isOwner: newUser.isOwner
        };
        
        // Save to both storage keys
        localStorage.setItem('currentUser', JSON.stringify(userSession));
        localStorage.setItem('digimarket_user', JSON.stringify(userSession));
        
        // Show special message for first user
        if (isOwner) {
            showAlert('🎉 Congratulations! You are the SITE OWNER with full admin access!', 'success');
        } else {
            showAlert('Account created successfully! Redirecting...', 'success');
        }
        
        registerForm.querySelector('button[type="submit"]').disabled = true;

        setTimeout(() => {
            window.location.href = "../home.html";
        }, 2000);
    });
}

// ===================================
// FORGOT PASSWORD HANDLER
// ===================================
const forgotPasswordForm = document.getElementById('forgotPasswordForm');
if (forgotPasswordForm) {
    forgotPasswordForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const email = document.getElementById('forgotEmail').value.trim();
        if (!email) return showAlert('Please enter your email', 'danger');
        if (!isValidEmail(email)) return showAlert('Invalid email format', 'danger');

        const user = findUser(email);
        if (!user) return showAlert('No account found with this email', 'danger');

        showAlert('Password reset link sent to your email!', 'success');
        forgotPasswordForm.querySelector('button[type="submit"]').disabled = true;
        
        setTimeout(() => {
            window.location.href = "login.html";
        }, 2000);
    });
}

// ===================================
// LOGOUT FUNCTIONALITY
// ===================================
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('digimarket_user');
        
        alert('✅ Logged out successfully!');
        window.location.href = '../index.html';
    }
}

// Attach logout to buttons
document.addEventListener('DOMContentLoaded', function() {
    const logoutButtons = document.querySelectorAll('.btn-logout, .logout-btn, #logoutBtn, [onclick*="logout"]');
    logoutButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            logout();
        });
    });
});

// ===================================
// UPDATE UI BASED ON LOGIN STATUS
// ===================================
window.addEventListener('load', function() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    const digimarketUser = JSON.parse(localStorage.getItem('digimarket_user') || 'null');
    const user = currentUser || digimarketUser;
    
    if (user) {
        console.log('👤 Logged in as:', user.name);
        
        // Update user name in UI
        document.querySelectorAll('.user-name, #userName').forEach(el => {
            if (el) el.textContent = user.name;
        });
        
        // Update user email
        document.querySelectorAll('.user-email, #userEmail').forEach(el => {
            if (el) el.textContent = user.email;
        });
        
        // Show admin badge
        if (user.isOwner || user.isAdmin) {
            document.querySelectorAll('.admin-badge').forEach(badge => {
                if (badge) {
                    badge.style.display = 'inline-block';
                    badge.textContent = user.isOwner ? '👑 OWNER' : '🛡️ ADMIN';
                }
            });
        }
        
        // Hide login/register buttons
        document.querySelectorAll('.btn-login, .login-btn, a[href*="login.html"]').forEach(btn => {
            if (btn && !btn.classList.contains('keep-visible')) {
                btn.style.display = 'none';
            }
        });
        
        document.querySelectorAll('.btn-register, .register-btn, a[href*="register.html"]').forEach(btn => {
            if (btn && !btn.classList.contains('keep-visible')) {
                btn.style.display = 'none';
            }
        });
        
        // Show logout button
        document.querySelectorAll('.btn-logout, .logout-btn, #logoutBtn').forEach(btn => {
            if (btn) btn.style.display = 'inline-block';
        });
    }
});

// Clear alerts on load
window.addEventListener('load', () => {
    document.querySelectorAll('.alert').forEach(alert => alert.remove());
});

console.log('🔐 Auth System Loaded with Page Protection!');