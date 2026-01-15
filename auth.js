// ========================================
// ENHANCED AUTH.JS - SECURED ADMIN ACCESS
// Only scoutplug6@gmail.com can access admin
// ========================================

(function() {
    const path = window.location.pathname.toLowerCase();
    
    // Check for logged in user from EITHER storage location
    const userSession = getUserSession();
    
    // Path Intelligence
    const isInsideFolder = path.includes('/auth/') || path.includes('/user/') || path.includes('/adim/');
    const toRoot = isInsideFolder ? '../' : '';

    // 1. GLOBAL ACCESS CONTROL
    const protectedPages = ['home.html', 'market.html', 'dashboard.html', 'coures.html', 'downloads.html', 'orders.html', 'setting.html', 'wishlist.html', 'cart.html'];
    const isProtected = protectedPages.some(page => path.includes(page));

    if (isProtected && !userSession) {
        alert("⚠️ Please login or signup to access this page");
        window.location.href = toRoot + "auth/login.html";
        return;
    }

    // 2. ADMIN PROTECTION
    if (path.includes('/adim/')) {
        if (!userSession) {
            alert("⚠️ Please login to access admin area");
            window.location.href = toRoot + "auth/login.html";
            return;
        } else {
            const user = JSON.parse(userSession);
            if (user.accountType !== 'admin') {
                alert("🚫 Access Denied: Admin privileges required.");
                window.location.href = toRoot + "home.html";
                return;
            }
        }
    }

    // 3. REDIRECT IF ALREADY LOGGED IN
    if (userSession && (path.includes('login.html') || path.includes('singnup.html'))) {
        const user = JSON.parse(userSession);
        if (user.accountType === 'admin') {
            window.location.href = toRoot + "adim/dashboard.html";
        } else {
            window.location.href = toRoot + "home.html";
        }
        return;
    }
})();

// ========================================
// 🔐 ADMIN CONFIGURATION (EDIT THIS!)
// ========================================
const ADMIN_CONFIG = {
    email: 'scoutplug6@gmail.com',  // ← Your admin email
    password: '123456789',           // ← Your admin password
    name: 'Admin'                    // ← Your display name
};

// ========================================
// MULTI-DEVICE SESSION MANAGEMENT
// ========================================

function getUserSession() {
    let session = localStorage.getItem('currentUser');
    if (!session) {
        session = localStorage.getItem('digimarket_user');
    }
    return session;
}

function saveUserSession(userData) {
    const userString = JSON.stringify(userData);
    localStorage.setItem('currentUser', userString);
    localStorage.setItem('digimarket_user', userString);
    console.log('✅ User session saved:', userData.email);
}

function clearUserSession() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('digimarket_user');
    console.log('🔓 User session cleared');
}

function getCurrentUser() {
    const session = getUserSession();
    return session ? JSON.parse(session) : null;
}

window.getCurrentUser = getCurrentUser;

// ========================================
// PASSWORD HASHING
// ========================================

function simpleHash(text) {
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
        const char = text.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return hash.toString(16);
}

// ========================================
// USER DATABASE MANAGEMENT
// ========================================

function getAllUsers() {
    const users = localStorage.getItem('digimarket_users');
    return users ? JSON.parse(users) : [];
}

function saveAllUsers(users) {
    localStorage.setItem('digimarket_users', JSON.stringify(users));
}

function storeUser(userData) {
    const users = getAllUsers();
    userData.createdAt = new Date().toISOString();
    userData.lastLogin = new Date().toISOString();
    users.push(userData);
    saveAllUsers(users);
    console.log('✅ New user registered:', userData.email);
}

function findUser(email) {
    const users = getAllUsers();
    return users.find(u => u.email.toLowerCase() === email.toLowerCase());
}

function updateLastLogin(email) {
    const users = getAllUsers();
    const userIndex = users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (userIndex !== -1) {
        users[userIndex].lastLogin = new Date().toISOString();
        saveAllUsers(users);
        console.log('✅ Last login updated for:', email);
    }
}

// ========================================
// 🔐 ADMIN ACCOUNT AUTO-CREATION
// ========================================

function initializeAdminAccount() {
    const adminExists = findUser(ADMIN_CONFIG.email);
    
    if (!adminExists) {
        const adminUser = {
            name: ADMIN_CONFIG.name,
            email: ADMIN_CONFIG.email,
            password: simpleHash(ADMIN_CONFIG.password),
            accountType: 'admin',
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString()
        };
        
        storeUser(adminUser);
        console.log('👑 Admin account created automatically');
    }
}

// Initialize admin on page load
initializeAdminAccount();

// ========================================
// 🔒 CHECK IF EMAIL IS ADMIN
// ========================================

function isAdminEmail(email) {
    return email.toLowerCase() === ADMIN_CONFIG.email.toLowerCase();
}

// ========================================
// VALIDATION HELPERS
// ========================================

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isStrongPassword(password) {
    if (password.length < 6) {
        return { valid: false, message: 'Password must be at least 6 characters long' };
    }
    return { valid: true };
}

// ========================================
// UI FEEDBACK FUNCTIONS
// ========================================

function showAlert(message, type) {
    const existingAlerts = document.querySelectorAll('.alert');
    existingAlerts.forEach(alert => alert.remove());
    
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.setAttribute('role', 'alert');
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    const form = document.querySelector('form');
    if (form) {
        form.parentElement.insertBefore(alertDiv, form);
        setTimeout(() => alertDiv.remove(), 5000);
    }
}

function showFieldError(input, message) {
    const existingError = input.nextElementSibling;
    if (existingError && existingError.classList.contains('error-message')) {
        existingError.remove();
    }
    
    input.classList.add('is-invalid');
    const error = document.createElement('div');
    error.className = 'error-message text-danger small mt-1';
    error.textContent = message;
    input.parentNode.insertBefore(error, input.nextSibling);
}

function clearFieldError(input) {
    input.classList.remove('is-invalid');
    const error = input.nextElementSibling;
    if (error && error.classList.contains('error-message')) {
        error.remove();
    }
}

// ========================================
// LOGIN FORM HANDLER
// ========================================

const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const emailInput = document.getElementById('loginEmail');
        const passwordInput = document.getElementById('loginPassword');
        const submitBtn = loginForm.querySelector('button[type="submit"]');
        
        const email = emailInput.value.trim();
        const pass = passwordInput.value;

        clearFieldError(emailInput);
        clearFieldError(passwordInput);

        if (!isValidEmail(email)) {
            showFieldError(emailInput, 'Please enter a valid email address');
            return;
        }

        const originalBtnText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';
        submitBtn.disabled = true;

        await new Promise(resolve => setTimeout(resolve, 500));

        const user = findUser(email);
        
        if (!user) {
            submitBtn.innerHTML = originalBtnText;
            submitBtn.disabled = false;
            showAlert('❌ No account found with this email. Please sign up first.', 'danger');
            return;
        }

        const hashedPass = simpleHash(pass);
        if (user.password !== hashedPass) {
            submitBtn.innerHTML = originalBtnText;
            submitBtn.disabled = false;
            showAlert('❌ Invalid password. Please try again.', 'danger');
            return;
        }

        // ✅ LOGIN SUCCESS
        saveUserSession(user);
        updateLastLogin(email);
        
        showAlert('✅ Login successful! Redirecting...', 'success');
        
        setTimeout(() => {
            const isInsideAuth = window.location.pathname.includes('/auth/');
            const root = isInsideAuth ? '../' : '';
            
            if (user.accountType === 'admin') {
                window.location.href = root + "adim/dashboard.html";
            } else {
                window.location.href = root + "home.html";
            }
        }, 1000);
    });
    
    const emailInput = document.getElementById('loginEmail');
    
    if (emailInput) {
        emailInput.addEventListener('blur', function() {
            if (this.value.trim() && !isValidEmail(this.value.trim())) {
                showFieldError(this, 'Invalid email format');
            } else {
                clearFieldError(this);
            }
        });
    }
}

// ========================================
// 🔒 SIGNUP FORM HANDLER (ADMIN BLOCKED)
// ========================================

const registerForm = document.getElementById('registerForm');
if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const nameInput = document.getElementById('registerName');
        const emailInput = document.getElementById('registerEmail');
        const passwordInput = document.getElementById('registerPassword');
        const confirmPasswordInput = document.getElementById('confirmPassword');
        const accountTypeSelect = document.getElementById('accountType');
        const termsCheckbox = document.getElementById('agreeTerms');
        const submitBtn = registerForm.querySelector('button[type="submit"]');
        
        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const pass = passwordInput.value;
        const confirmPass = confirmPasswordInput.value;
        let type = accountTypeSelect.value;

        [nameInput, emailInput, passwordInput, confirmPasswordInput].forEach(clearFieldError);

        let hasError = false;

        if (!name) {
            showFieldError(nameInput, 'Name is required');
            hasError = true;
        }

        if (!email) {
            showFieldError(emailInput, 'Email is required');
            hasError = true;
        } else if (!isValidEmail(email)) {
            showFieldError(emailInput, 'Invalid email format');
            hasError = true;
        }

        // 🔒 BLOCK ADMIN SIGNUP (except for your email)
        if (type === 'admin' && !isAdminEmail(email)) {
            showAlert('🚫 Admin accounts can only be created by the system administrator.', 'danger');
            accountTypeSelect.value = 'user'; // Force to user
            return;
        }

        const passwordCheck = isStrongPassword(pass);
        if (!passwordCheck.valid) {
            showFieldError(passwordInput, passwordCheck.message);
            hasError = true;
        }

        if (pass !== confirmPass) {
            showFieldError(confirmPasswordInput, 'Passwords do not match');
            hasError = true;
        }

        if (!termsCheckbox.checked) {
            showAlert('Please accept the Terms & Conditions', 'danger');
            hasError = true;
        }

        if (hasError) return;

        if (findUser(email)) {
            showAlert('❌ This email is already registered. Please <a href="login.html">login instead</a>.', 'danger');
            return;
        }

        const originalBtnText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating account...';
        submitBtn.disabled = true;

        await new Promise(resolve => setTimeout(resolve, 800));

        // Force admin type for your email
        if (isAdminEmail(email)) {
            type = 'admin';
        }

        const newUser = {
            name,
            email,
            password: simpleHash(pass),
            accountType: type,
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString()
        };

        storeUser(newUser);

        showAlert('✅ Account created successfully! Redirecting to login...', 'success');
        
        registerForm.reset();
        
        setTimeout(() => {
            window.location.href = "login.html";
        }, 2000);
    });
    
    const passwordInput = document.getElementById('registerPassword');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    
    if (passwordInput) {
        passwordInput.addEventListener('input', function() {
            const check = isStrongPassword(this.value);
            if (!check.valid && this.value) {
                showFieldError(this, check.message);
            } else {
                clearFieldError(this);
            }
        });
    }
    
    if (confirmPasswordInput) {
        confirmPasswordInput.addEventListener('input', function() {
            const password = document.getElementById('registerPassword').value;
            if (this.value && this.value !== password) {
                showFieldError(this, 'Passwords do not match');
            } else {
                clearFieldError(this);
            }
        });
    }
}

// ========================================
// FORGOT PASSWORD HANDLER
// ========================================

const forgotPasswordForm = document.getElementById('forgotPasswordForm');
if (forgotPasswordForm) {
    forgotPasswordForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const emailInput = document.getElementById('forgotEmail');
        const submitBtn = forgotPasswordForm.querySelector('button[type="submit"]');
        const email = emailInput.value.trim();

        clearFieldError(emailInput);

        if (!isValidEmail(email)) {
            showFieldError(emailInput, 'Please enter a valid email address');
            return;
        }

        const originalBtnText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;

        await new Promise(resolve => setTimeout(resolve, 1000));

        const user = findUser(email);
        
        submitBtn.innerHTML = originalBtnText;
        submitBtn.disabled = false;

        if (user) {
            showAlert('✅ Password reset link sent to your email! (Demo Mode: Check console)', 'success');
            console.log('=================================');
            console.log('📧 PASSWORD RESET EMAIL');
            console.log('=================================');
            console.log('To:', email);
            console.log('Account Type:', user.accountType);
            console.log('Created:', user.createdAt);
            console.log('=================================');
        } else {
            showAlert('❌ No account found with this email address', 'danger');
        }
    });
}

// ========================================
// LOGOUT FUNCTION
// ========================================

function logout() {
    const currentUser = getCurrentUser();
    
    if (!currentUser) {
        window.location.href = getPathToRoot() + "index.html";
        return;
    }
    
    if (confirm('🔓 Are you sure you want to logout?')) {
        console.log('👋 User logged out:', currentUser.email);
        clearUserSession();
        alert('✅ You have been logged out successfully!');
        window.location.href = getPathToRoot() + "index.html";
    }
}

function getPathToRoot() {
    const path = window.location.pathname;
    const isInsideSub = path.includes('/user/') || path.includes('/adim/') || path.includes('/auth/');
    return isInsideSub ? '../' : '';
}

window.logout = logout;

// ========================================
// AUTO-LOGIN CHECK
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    const currentUser = getCurrentUser();
    
    if (currentUser) {
        console.log('👤 Auto-login detected');
        console.log('User:', currentUser.name);
        console.log('Email:', currentUser.email);
        console.log('Account Type:', currentUser.accountType);
        console.log('Last Login:', currentUser.lastLogin);
        
        updateUserUI(currentUser);
    }
    
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            once: true
        });
    }
});

function updateUserUI(user) {
    const userNameElements = document.querySelectorAll('#userName, .user-name, #welcomeUserName');
    userNameElements.forEach(el => {
        if (el) el.textContent = user.name;
    });
    
    const userEmailElements = document.querySelectorAll('#userEmail, .user-email');
    userEmailElements.forEach(el => {
        if (el) el.textContent = user.email;
    });
    
    if (user.accountType === 'admin') {
        const adminElements = document.querySelectorAll('.admin-only');
        adminElements.forEach(el => {
            if (el) el.style.display = 'block';
        });
    }
}

// ========================================
// SESSION REFRESH
// ========================================

setInterval(() => {
    const currentUser = getCurrentUser();
    if (currentUser) {
        saveUserSession(currentUser);
        console.log('🔄 Session refreshed for:', currentUser.email);
    }
}, 5 * 60 * 1000);

// ========================================
// DEBUG UTILITIES
// ========================================

window.viewAllUsers = function() {
    const users = getAllUsers();
    console.log('=================================');
    console.log('📊 ALL REGISTERED USERS');
    console.log('=================================');
    console.table(users.map(u => ({
        Name: u.name,
        Email: u.email,
        Type: u.accountType,
        Created: new Date(u.createdAt).toLocaleDateString(),
        LastLogin: new Date(u.lastLogin).toLocaleDateString()
    })));
    console.log('Total Users:', users.length);
    console.log('=================================');
}

console.log('%c🔐 DigiMarket Pro - Secured Admin System', 'color: #667eea; font-size: 16px; font-weight: bold;');
console.log('%c👑 Admin Email: ' + ADMIN_CONFIG.email, 'color: #48bb78; font-weight: bold;');
console.log('%cType viewAllUsers() to see all registered users', 'color: #666; font-style: italic;');