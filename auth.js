// Fixed AUTH.JS (Clean, Simple, Fully Working)

// Initialize AOS Animation
document.addEventListener('DOMContentLoaded', function() {
    if (typeof AOS !== 'undefined') {
        AOS.init({ duration: 800, once: true });
    }
});

// Helper function to show alerts
function showAlert(message, type) {
    const existing = document.querySelectorAll('.alert');
    existing.forEach(a => a.remove());

    const div = document.createElement('div');
    div.className = `alert alert-${type}`;
    div.textContent = message;

    const form = document.querySelector('form');
    form.parentNode.insertBefore(div, form);

    setTimeout(() => div.remove(), 4000);
}

// Email validation
function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Store new user
function storeUser(user) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    users.push(user);
    localStorage.setItem('users', JSON.stringify(users));
}

// Find user
function findUser(email) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    return users.find(u => u.email === email);
}

// ---------------------------
// LOGIN FORM HANDLER
// ---------------------------
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
        localStorage.setItem('currentUser', JSON.stringify(user));
        showAlert('Login successful! Redirecting...', 'success');

        loginForm.querySelector('button[type="submit"]').disabled = true;

        // Correct redirect
        setTimeout(() => {
            window.location.href = "/project-root/home.html";
        }, 1500);
    });
}

// ---------------------------
// REGISTER FORM HANDLER
// ---------------------------
const registerForm = document.getElementById('registerForm');
if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('registerName').value.trim();
        const email = document.getElementById('registerEmail').value.trim();
        const pass = document.getElementById('registerPassword').value;
        const confirm = document.getElementById('confirmPassword').value;
        const type = document.getElementById('accountType').value;
        const terms = document.getElementById('agreeTerms').checked;

        if (!name || !email || !pass || !confirm) return showAlert('Please fill in all fields', 'danger');
        if (!isValidEmail(email)) return showAlert('Invalid email format', 'danger');
        if (pass.length < 6) return showAlert('Password must be at least 6 characters', 'danger');
        if (pass !== confirm) return showAlert('Passwords do not match', 'danger');
        if (!terms) return showAlert('Agree to the Terms & Conditions', 'danger');
        if (findUser(email)) return showAlert('Email already registered', 'danger');

        const newUser = {
            name,
            email,
            password: pass,
            accountType: type,
            createdAt: new Date().toISOString()
        };

        storeUser(newUser);
        showAlert('Account created! Redirecting...', 'success');
        registerForm.querySelector('button[type="submit"]').disabled = true;

        setTimeout(() => {
            window.location.href = "login.html";
        }, 1500);
    });
}

// ---------------------------
// FORGOT PASSWORD HANDLER
// ---------------------------
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

// Clear alerts on load
window.addEventListener('load', () => {
    document.querySelectorAll('.alert').forEach(alert => alert.remove());
});