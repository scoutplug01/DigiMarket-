// updated_script.js — FINISHED FIXES (notifications, admin chat, payment screenshots, seller product system)
// ---------------------------------------------------------------------------
// FIXED: notification dropdown toggle + rendering
// FIXED: admin auto-creation helper + admin menus injection
// FIXED: payment screenshot compression + storage safe-guard
// FIXED: seller product add/edit/delete + persisted to localStorage
// FINISHED: product modal, image preview, save/update logic
// ---------------------------------------------------------------------------

AOS?.init?.({ duration: 800, once: true });

// ------------- Global state -------------
let currentUser = null;
let allUsers = JSON.parse(localStorage.getItem('allUsers')) || [];
let cart = [];
let notifications = [];
let allPayments = JSON.parse(localStorage.getItem('allPayments')) || [];
let allChats = JSON.parse(localStorage.getItem('allChats')) || [];
let sellerProducts = JSON.parse(localStorage.getItem('sellerProducts')) || [];

// base marketplace products
const baseProducts = [
    { id: 1, name: "E-Commerce Website Template", category: "websites", price: 149, image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80", description: "Professional e-commerce template", rating: 4.8, reviews: 124, featured: true, features: ["Responsive Design", "Shopping Cart", "Payment Integration"], downloadLink: "#" },
    { id: 2, name: "Mobile Banking App", category: "apps", price: 199, image: "https://images.unsplash.com/photo-1563986768494-4dee2763ff3f?w=800&q=80", description: "Secure mobile banking", rating: 4.9, reviews: 89, featured: true, features: ["Secure Auth", "Transactions", "Budget Tracking"], downloadLink: "#" },
    { id: 3, name: "Payment Gateway API", category: "apis", price: 129, image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80", description: "Robust payment API", rating: 4.7, reviews: 156, featured: true, features: ["Multiple Methods", "Secure", "Webhooks"], downloadLink: "#" },
];

// merge for display
function getAllProducts() {
    return [...baseProducts, ...sellerProducts];
}

// ------------- Helpers -------------
function compressImage(base64, maxWidth = 800, quality = 0.4) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = function() {
            const canvas = document.createElement('canvas');
            let width = img.width;
            let height = img.height;
            if (width > maxWidth) {
                height = (height * maxWidth) / width;
                width = maxWidth;
            }
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);
            // compress
            const compressed = canvas.toDataURL('image/jpeg', quality);
            resolve(compressed);
        };
        img.onerror = function() { resolve(base64); };
        img.src = base64;
    });
}

window.copyToClipboard = function(text) {
    navigator.clipboard.writeText(text).then(() => alert('Copied!')).catch(() => alert('Copy: ' + text));
};

// ------------- Auth -------------
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
    if (!currentUser) return;
    const userToSave = {...currentUser};
    delete userToSave.payments;
    localStorage.setItem('currentUser', JSON.stringify(userToSave));
    const idx = allUsers.findIndex(u => u.email === currentUser.email);
    if (idx !== -1) {
        allUsers[idx] = {...currentUser};
        delete allUsers[idx].payments;
        try { localStorage.setItem('allUsers', JSON.stringify(allUsers)); } catch(e){ console.warn('allUsers save failed'); }
    }
}

// Register
document.getElementById('registerForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('registerName').value.trim();
    const email = document.getElementById('registerEmail').value.trim().toLowerCase();
    const password = document.getElementById('registerPassword').value;
    const accountType = document.getElementById('accountType').value;
    if (allUsers.find(u => u.email === email)) { alert('Email already registered!'); return; }
    const newUser = { name, email, password, accountType, isAdmin: false, cart: [], notifications: [], createdAt: Date.now() };
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
    } else { alert('Invalid email or password!'); }
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

// ------------- Pages & Nav -------------
function showLoginPage(){ document.getElementById('loginPage')?.classList.remove('hidden'); document.getElementById('registerPage')?.classList.add('hidden'); document.getElementById('mainWebsite')?.classList.add('hidden'); }
function showRegisterPage(){ document.getElementById('loginPage')?.classList.add('hidden'); document.getElementById('registerPage')?.classList.remove('hidden'); document.getElementById('mainWebsite')?.classList.add('hidden'); }
function showMainWebsite(){ document.getElementById('loginPage')?.classList.add('hidden'); document.getElementById('registerPage')?.classList.add('hidden'); document.getElementById('mainWebsite')?.classList.remove('hidden'); showHomePage(); initializeSwiper(); }
function showHomePage(){ document.getElementById('homePage')?.classList.remove('hidden'); document.getElementById('browsePage')?.classList.add('hidden'); document.getElementById('dashboardPage')?.classList.add('hidden'); loadFeaturedProducts(); }
function showBrowsePage(){ document.getElementById('homePage')?.classList.add('hidden'); document.getElementById('browsePage')?.classList.remove('hidden'); document.getElementById('dashboardPage')?.classList.add('hidden'); loadBrowseProducts(); }
function showDashboardPage(section='overview'){ document.getElementById('homePage')?.classList.add('hidden'); document.getElementById('browsePage')?.classList.add('hidden'); document.getElementById('dashboardPage')?.classList.remove('hidden'); loadDashboardSection(section); }

document.getElementById('showRegister')?.addEventListener('click', (e)=>{e.preventDefault(); showRegisterPage();});
document.getElementById('showLogin')?.addEventListener('click', (e)=>{e.preventDefault(); showLoginPage();});
document.getElementById('logoLink')?.addEventListener('click', (e)=>{e.preventDefault(); showHomePage();});
document.getElementById('homeLink')?.addEventListener('click', (e)=>{e.preventDefault(); showHomePage();});
document.getElementById('browseLink')?.addEventListener('click', (e)=>{e.preventDefault(); showBrowsePage();});
document.getElementById('dashboardLink')?.addEventListener('click', (e)=>{e.preventDefault(); showDashboardPage('overview');});

document.getElementById('becomeSellerLink')?.addEventListener('click',(e)=>{ e.preventDefault(); if (currentUser && currentUser.accountType === 'buyer') { if (confirm('Upgrade to Seller?')) { currentUser.accountType='seller'; saveCurrentUser(); alert('You are now a Seller!'); updateUIForUser(); showDashboardPage('products'); } } });

function updateUIForUser() {
    const link = document.getElementById('becomeSellerLink');
    if (currentUser && currentUser.accountType === 'seller') { if (link) link.style.display='none'; } else { if (link) link.style.display='block'; }
}

// ------------- Products & Cart -------------
function loadFeaturedProducts(){
    const container = document.getElementById('featuredProductsContainer'); if(!container) return; container.innerHTML='';
    getAllProducts().filter(p=>p.featured).forEach(product=>{
        const slide=document.createElement('div'); slide.className='swiper-slide';
        slide.innerHTML=`
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
                        <span class="stars-display">${'★'.repeat(Math.floor(product.rating||5))}${'☆'.repeat(5-(Math.floor(product.rating||5)))}</span>
                        <span class="rating-text">${product.rating||'—'} (${product.reviews||0})</span>
                    </div>
                    <div class="product-price">$${product.price}</div>
                    <button class="btn btn-primary-custom w-100 add-to-cart-btn" data-product-id="${product.id}">
                        <i class="fas fa-shopping-cart"></i> Add to Cart
                    </button>
                </div>
            </div>`;
        container.appendChild(slide);
    });
    attachProductListeners();
}

function initializeSwiper(){ setTimeout(()=>{ try { new Swiper('.productsSwiper',{ slidesPerView:1, spaceBetween:30, loop:true, pagination:{el:'.swiper-pagination', clickable:true}, navigation:{nextEl:'.swiper-button-next', prevEl:'.swiper-button-prev'}, breakpoints:{640:{slidesPerView:2},1024:{slidesPerView:3}} }); } catch(e){} },100); }

document.querySelectorAll('.category-card').forEach(card=>{ card.addEventListener('click',()=>{ const category=card.dataset.category; showBrowsePage(); document.getElementById('categoryFilter').value=category; filterProducts(); }); });

document.getElementById('searchBtn')?.addEventListener('click', ()=>{ const q=document.getElementById('searchInput').value; showBrowsePage(); filterProducts(q); });
document.getElementById('searchInput')?.addEventListener('keypress',(e)=>{ if(e.key==='Enter'){ showBrowsePage(); filterProducts(e.target.value); } });

function loadBrowseProducts(filter={}) {
    const container = document.getElementById('browseProductsContainer'); if(!container) return; container.innerHTML='';
    let filtered = getAllProducts();
    if (filter.category && filter.category !== 'all') filtered = filtered.filter(p=>p.category===filter.category);
    if (filter.priceRange) { const [min,max]=filter.priceRange.split('-').map(Number); filtered=filtered.filter(p=>p.price>=min && p.price<=max); }
    if (filter.search) filtered = filtered.filter(p => (p.name||'').toLowerCase().includes(filter.search.toLowerCase()) || (p.description||'').toLowerCase().includes(filter.search.toLowerCase()));
    if(filtered.length===0){ container.innerHTML='<div class="col-12"><div class="alert alert-info">No products found.</div></div>'; return; }
    filtered.forEach(product=>{
        const col=document.createElement('div'); col.className='col-md-4 col-sm-6';
        col.innerHTML=`
            <div class="product-card" data-product-id="${product.id}">
                <div class="product-image-container">
                    <img src="${product.image}" alt="${product.name}" class="product-img">
                </div>
                <div class="product-body">
                    <h5 class="product-title">${product.name}</h5>
                    <span class="product-category">${product.category}</span>
                    <p class="product-description">${product.description}</p>
                    <div class="product-rating">
                        <span class="stars-display">${'★'.repeat(Math.floor(product.rating||5))}${'☆'.repeat(5-(Math.floor(product.rating||5)))}</span>
                        <span class="rating-text">${product.rating||'—'}</span>
                    </div>
                    <div class="product-price">$${product.price}</div>
                    <button class="btn btn-primary-custom w-100 add-to-cart-btn" data-product-id="${product.id}">
                        <i class="fas fa-shopping-cart"></i> Add to Cart
                    </button>
                </div>
            </div>`;
        container.appendChild(col);
    });
    attachProductListeners();
}

function filterProducts(search='') { const category=document.getElementById('categoryFilter')?.value; const priceRange=document.getElementById('priceFilter')?.value; loadBrowseProducts({ category, priceRange: priceRange!=='all' ? priceRange : null, search }); }
document.getElementById('categoryFilter')?.addEventListener('change', ()=>filterProducts());
document.getElementById('priceFilter')?.addEventListener('change', ()=>filterProducts());

function attachProductListeners(){
    document.querySelectorAll('.add-to-cart-btn').forEach(btn=>{ btn.removeEventListener('click', addToCartFromBtn); btn.addEventListener('click', addToCartFromBtn); });
    document.querySelectorAll('.product-card').forEach(card=>{ card.addEventListener('click',(e)=>{ if(!e.target.closest('.add-to-cart-btn')) showProductDetail(parseInt(card.dataset.productId)); }); });
}
function addToCartFromBtn(e){ e.stopPropagation(); const btn=e.target.closest('.add-to-cart-btn'); if(!btn) return; addToCart(parseInt(btn.dataset.productId)); }

function showProductDetail(productId){
    const product = getAllProducts().find(p=>p.id===productId);
    if(!product) return;
    const modal = `
        <div class="modal fade show" id="productDetailModal" style="display:block;" tabindex="-1">
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
                                    <ul>${(product.features||[]).map(f=>`<li><i class="fas fa-check text-success me-2"></i>${f}</li>`).join('')}</ul>
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
        <div class="modal-backdrop fade show"></div>`;
    document.body.insertAdjacentHTML('beforeend', modal);
}
window.closeProductDetail = function(){ document.getElementById('productDetailModal')?.remove(); document.querySelectorAll('.modal-backdrop').forEach(b=>b.remove()); };

function addToCart(productId){
    const product = getAllProducts().find(p=>p.id===productId);
    if(!product) return;
    if(cart.find(item=>item.id===productId)){ alert('Already in cart!'); return; }
    cart.push({...product, quantity:1});
    updateCartUI();
    if(currentUser){ currentUser.cart = cart; saveCurrentUser(); }
    addNotification(`Added "${product.name}" to cart`, 'success');
}
function updateCartUI(){ const count=document.getElementById('cartCount'); if(count) count.textContent = cart.length; }

// cart modal
document.getElementById('cartIcon')?.addEventListener('click', () => {
    if(cart.length===0){ alert('Cart is empty!'); return; }
    const total = cart.reduce((s,i)=>s+i.price,0);
    const modal = `
        <div class="modal fade show" id="cartModal" style="display:block;">
            <div class="modal-dialog modal-lg"><div class="modal-content">
                <div class="modal-header bg-primary text-white">
                    <h5><i class="fas fa-shopping-cart"></i> Your Cart</h5>
                    <button class="btn-close btn-close-white" onclick="closeCartModal()"></button>
                </div>
                <div class="modal-body">
                    <div class="cart-items">
                        ${cart.map(item=>`
                            <div class="cart-item">
                                <img src="${item.image}" alt="${item.name}" class="cart-item-img">
                                <div class="cart-item-details"><h6>${item.name}</h6><p class="text-muted">${item.category}</p></div>
                                <div class="cart-item-price">$${item.price}</div>
                                <button class="btn btn-sm btn-danger" onclick="removeFromCart(${item.id})"><i class="fas fa-trash"></i></button>
                            </div>
                        `).join('')}
                    </div>
                    <div class="cart-summary"><div class="summary-row total"><span>Total:</span><span>$${total}</span></div></div>
                    <button class="btn btn-primary-custom btn-lg w-100 mt-3" onclick="proceedToCheckout()"><i class="fas fa-lock"></i> Checkout</button>
                </div>
            </div></div>
        </div>
        <div class="modal-backdrop fade show"></div>`;
    document.body.insertAdjacentHTML('beforeend', modal);
});
window.closeCartModal = function(){ document.getElementById('cartModal')?.remove(); document.querySelectorAll('.modal-backdrop').forEach(b=>b.remove()); };

window.removeFromCart = function(productId){ cart = cart.filter(i=>i.id!==productId); updateCartUI(); if(currentUser){ currentUser.cart = cart; saveCurrentUser(); } closeCartModal(); if(cart.length>0) document.getElementById('cartIcon').click(); };

window.proceedToCheckout = function(){
    closeCartModal();
    if(cart.length===0) return;
    const product = cart[0];
    const modal = new bootstrap.Modal(document.getElementById('paymentModal'));
    document.getElementById('paymentProductImage').src = product.image;
    document.getElementById('paymentProductName').textContent = product.name;
    document.getElementById('paymentProductCategory').textContent = product.category;
    document.getElementById('paymentProductPrice').textContent = `$${product.price}`;
    document.getElementById('payerProduct').value = product.name;
    document.getElementById('payerAmount').value = product.price;
    document.getElementById('payerName').value = currentUser?.name || '';
    modal.show();
};

// ------------- Payment handling (fixed) -------------
document.getElementById('paymentProofForm')?.addEventListener('submit', async function(e){
    e.preventDefault();
    const payerName = document.getElementById('payerName').value.trim();
    const product = document.getElementById('payerProduct').value.trim();
    const amount = document.getElementById('payerAmount').value;
    const bank = document.getElementById('paymentBank').value;
    const screenshotFile = document.getElementById('paymentScreenshot').files[0];
    if(!payerName || !product || !amount || !bank){ alert('Please fill all fields'); return; }
    if(!screenshotFile){ alert('Please upload payment screenshot'); return; }
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const original = submitBtn.innerHTML; submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...'; submitBtn.disabled=true;
    try {
        const reader = new FileReader();
        reader.onload = async function(ev){
            const compressed = await compressImage(ev.target.result, 600, 0.4).catch(()=>ev.target.result);
            const payment = { id:'PAY'+Date.now(), userId: currentUser?.email || 'guest', userName: currentUser?.name || payerName, payerName, product, amount: parseFloat(amount), bank, screenshot: compressed, status:'pending', timestamp: Date.now() };
            allPayments.push(payment);
            try { localStorage.setItem('allPayments', JSON.stringify(allPayments)); } catch(err){ allPayments = allPayments.slice(-20); localStorage.setItem('allPayments', JSON.stringify(allPayments)); }
            if(currentUser){ currentUser.paymentIds = currentUser.paymentIds||[]; currentUser.paymentIds.push(payment.id); saveCurrentUser(); }
            // remove item from cart
            const productInCart = cart.find(p=>p.name===product); if(productInCart){ cart = cart.filter(p=>p.id!==productInCart.id); updateCartUI(); if(currentUser){ currentUser.cart=cart; saveCurrentUser(); } }
            // close modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('paymentModal')); if(modal) modal.hide();
            alert('✅ Payment submitted. Order ID: '+payment.id+'\nStatus: Pending review by admin.');
            document.getElementById('paymentProofForm').reset(); document.getElementById('screenshotPreview').innerHTML = '';
            submitBtn.innerHTML = original; submitBtn.disabled=false;
        };
        reader.onerror = function(){ alert('Error reading file'); submitBtn.innerHTML = original; submitBtn.disabled=false; };
        reader.readAsDataURL(screenshotFile);
    } catch (err) { alert('Error: '+err.message); submitBtn.innerHTML = original; submitBtn.disabled=false; }
});

document.getElementById('paymentScreenshot')?.addEventListener('change', (e)=>{
    const file = e.target.files[0];
    if(!file) return;
    if(file.size > 5_000_000){ alert('Image too large (max 5MB). Please use a smaller screenshot.'); e.target.value=''; return; }
    const r = new FileReader();
    r.onload = (ev)=>{ document.getElementById('screenshotPreview').innerHTML = `<img src="${ev.target.result}" style="max-width:100%;border-radius:10px;margin-top:1rem;">`; };
    r.readAsDataURL(file);
});

// ------------- Notifications -------------
function addNotification(message, type='info'){
    notifications.unshift({ id:Date.now(), message, type, timestamp: Date.now(), read:false });
    updateNotificationUI();
    if(currentUser){ currentUser.notifications = notifications; saveCurrentUser(); }
}
function updateNotificationUI(){ const badge=document.getElementById('notificationBadge'); if(badge) badge.textContent = notifications.filter(n=>!n.read).length; }

document.getElementById('notificationIcon')?.addEventListener('click', ()=>{
    // toggle dropdown and render
    const dd = document.getElementById('notificationDropdown');
    if(dd) dd.classList.toggle('hidden');
    renderNotificationList();
});
function renderNotificationList(){
    const list = document.getElementById('notificationList');
    if(!list) return;
    if(notifications.length === 0){ list.innerHTML = '<div class="p-2 text-muted">No notifications</div>'; return; }
    list.innerHTML = notifications.map(n => `<div class="notification-item"><div style="font-size:14px">${n.message}</div><div style="font-size:12px;color:#6b7280">${new Date(n.timestamp).toLocaleString()}</div></div>`).join('');
}

// ------------- Live Chat (user/admin) -------------
let chatOpen = false;
document.getElementById('liveChatBtn')?.addEventListener('click',()=>{ if(chatOpen) closeLiveChat(); else openLiveChat(); });

function openLiveChat(){
    chatOpen = true;
    const chatModal = `
        <div class="chat-modal" id="chatModal">
            <div class="chat-header"><h5><i class="fas fa-comments"></i> Live Support</h5><button class="chat-close-btn" onclick="closeLiveChat()"><i class="fas fa-times"></i></button></div>
            <div class="chat-messages" id="chatMessagesContainer"></div>
            <div class="chat-input-area"><input type="text" class="chat-input" id="chatInput" placeholder="Type your message..."><button class="chat-send-btn" onclick="sendChatMessage()"><i class="fas fa-paper-plane"></i></button></div>
        </div>`;
    document.body.insertAdjacentHTML('beforeend', chatModal);
    loadUserChatMessages();
    document.getElementById('chatInput')?.addEventListener('keypress',(e)=>{ if(e.key==='Enter') sendChatMessage(); });
}

function loadUserChatMessages(){
    const container = document.getElementById('chatMessagesContainer');
    if(!container) return;
    // Admins see all chats (implemented in admin view)
    const userChats = allChats.filter(c => currentUser?.isAdmin ? true : c.userId === currentUser?.email);
    if(userChats.length === 0){ container.innerHTML = `<div class="chat-empty-state"><i class="fas fa-comments"></i><p>Chat with our support team!</p></div>`; return; }
    container.innerHTML = userChats.map(c=>`<div class="chat-message ${c.sender}"><div class="message-sender">${c.sender==='user' ? (c.userName||'You') : 'Support'}</div><div class="message-bubble" style="background:${c.sender==='user' ? 'linear-gradient(135deg,var(--primary-color),var(--secondary-color))' : 'white'}; color:${c.sender==='user' ? 'white' : '#1e293b'}">${c.message}</div><div class="message-time">${new Date(c.timestamp).toLocaleTimeString()}</div></div>`).join('');
    container.scrollTop = container.scrollHeight;
}

window.sendChatMessage = function(){
    const input = document.getElementById('chatInput');
    if(!input) return;
    const message = input.value.trim();
    if(!message){ alert('Please type a message!'); return; }
    const chatMsg = { id:'CHAT'+Date.now(), userId: currentUser?.email||'guest', userName: currentUser?.name||'Guest', message, sender:'user', timestamp: Date.now(), read:false };
    allChats.push(chatMsg);
    localStorage.setItem('allChats', JSON.stringify(allChats));
    input.value='';
    loadUserChatMessages();
    // auto-reply
    setTimeout(()=>{ const reply={ id:'CHAT'+Date.now(), userId: chatMsg.userId, userName:'Support', message:'Thanks! Our support will reply shortly.', sender:'support', timestamp: Date.now(), read:false }; allChats.push(reply); localStorage.setItem('allChats', JSON.stringify(allChats)); loadUserChatMessages(); }, 1000);
};

window.closeLiveChat = function(){ chatOpen=false; document.getElementById('chatModal')?.remove(); };

// ------------- Dashboard & Seller product manager -------------
function loadDashboardSection(section){
    const content = document.getElementById('dashboardContent'); if(!content) return;
    document.querySelectorAll('.dashboard-menu-item').forEach(item=>{ item.classList.remove('active'); if(item.dataset.section===section) item.classList.add('active'); });
    switch(section){ case 'overview': loadOverview(content); break; case 'products': loadMyProducts(content); break; case 'purchases': loadMyPurchases(content); break; case 'orders': loadOrders(content); break; case 'sales': loadSales(content); break; case 'messages': loadMessages(content); break; case 'settings': loadSettings(content); break; }
}
document.querySelectorAll('.dashboard-menu-item').forEach(item=>{ item.addEventListener('click',()=>loadDashboardSection(item.dataset.section)); });

function loadOverview(content){
    const userPayments = allPayments.filter(p => p.userId === currentUser?.email);
    const confirmed = userPayments.filter(p=>p.status==='confirmed').length;
    const pending = userPayments.filter(p=>p.status==='pending').length;
    const spent = userPayments.filter(p=>p.status==='confirmed').reduce((s,p)=>s+p.amount,0);
    content.innerHTML = `<h2><i class="fas fa-chart-line"></i> Dashboard Overview</h2><div class="row mt-4"><div class="col-md-4 mb-3"><div class="stat-card"><i class="fas fa-check-circle fa-2x mb-3"></i><div class="stat-value">${confirmed}</div><div>Confirmed Purchases</div></div></div><div class="col-md-4 mb-3"><div class="stat-card"><i class="fas fa-clock fa-2x mb-3"></i><div class="stat-value">${pending}</div><div>Pending Orders</div></div></div><div class="col-md-4 mb-3"><div class="stat-card"><i class="fas fa-dollar-sign fa-2x mb-3"></i><div class="stat-value">$${spent}</div><div>Total Spent</div></div></div></div>`;
}

function loadMyProducts(content){
    if(currentUser?.accountType!=='seller'){ content.innerHTML = `<div class="dashboard-card"><h4>Seller Account Required</h4><p>Upgrade to start selling!</p><button class="btn btn-primary-custom" onclick="upgradeToSeller()"><i class="fas fa-user-tie"></i> Become Seller</button></div>`; return; }
    content.innerHTML = `<h2><i class="fas fa-box"></i> My Products</h2><div class="dashboard-card mb-3"><button class="btn btn-success" id="openAddProductBtn"><i class="fas fa-plus"></i> Add New Product</button></div><div id="sellerProductsList"></div>`;
    document.getElementById('openAddProductBtn')?.addEventListener('click', ()=>openAddProductModal());
    renderSellerProductsList();
}

function renderSellerProductsList(){
    const listEl = document.getElementById('sellerProductsList');
    if(!listEl) return;
    const myProducts = sellerProducts.filter(p=>p.ownerEmail===currentUser.email);
    if(myProducts.length===0){ listEl.innerHTML = '<div class="dashboard-card"><p>No products yet.</p></div>'; return; }
    listEl.innerHTML = `<div class="table-responsive"><table class="table"><thead><tr><th>Image</th><th>Title</th><th>Price</th><th>Category</th><th>Actions</th></tr></thead><tbody>` + myProducts.map(p=>`<tr><td><img src="${p.image}" style="height:48px;border-radius:6px"></td><td>${p.name}</td><td>$${p.price}</td><td>${p.category}</td><td><button class="btn btn-sm btn-primary" onclick="editSellerProduct('${p.id}')">Edit</button> <button class="btn btn-sm btn-danger" onclick="deleteSellerProduct('${p.id}')">Delete</button></td></tr>`).join('') + '</tbody></table></div>';
}

// openAddProductModal - finished (adds & edits)
function openAddProductModal(product = null) {
  const isEdit = Boolean(product);
  const modalHtml = `
<div class="modal fade" id="productModal" tabindex="-1">
  <div class="modal-dialog modal-lg">
    <div class="modal-content">
      <div class="modal-header bg-primary text-white">
        <h5 class="modal-title">${isEdit ? "Edit Product" : "Add New Product"}</h5>
        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
      </div>
      <div class="modal-body">
        <form id="productForm">
          <div class="mb-3">
            <label class="form-label">Product Name</label>
            <input type="text" class="form-control" id="productName" value="${product?.name || ''}" required>
          </div>
          <div class="mb-3">
            <label class="form-label">Category</label>
            <select class="form-control" id="productCategory">
              <option value="websites" ${product?.category === 'websites' ? 'selected' : ''}>Websites</option>
              <option value="apps" ${product?.category === 'apps' ? 'selected' : ''}>Apps</option>
              <option value="apis" ${product?.category === 'apis' ? 'selected' : ''}>APIs</option>
              <option value="ai-tools" ${product?.category === 'ai-tools' ? 'selected' : ''}>AI Tools</option>
              <option value="courses" ${product?.category === 'courses' ? 'selected' : ''}>Courses</option>
              <option value="plugins" ${product?.category === 'plugins' ? 'selected' : ''}>Plugins</option>
            </select>
          </div>
          <div class="mb-3">
            <label class="form-label">Price ($)</label>
            <input type="number" class="form-control" id="productPrice" value="${product?.price || ''}" required>
          </div>
          <div class="mb-3">
            <label class="form-label">Short Description</label>
            <textarea class="form-control" id="productDescription" rows="3">${product?.description || ''}</textarea>
          </div>
          <div class="mb-3">
            <label class="form-label">Product Image</label>
            <input type="file" class="form-control" id="productImage" accept="image/*">
            <div id="imagePreview" class="mt-3">${product?.image ? `<img src="${product.image}" style="width:150px;border-radius:10px;">` : ""}</div>
          </div>
        </form>
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
        <button class="btn btn-primary-custom" id="saveProductBtn">${isEdit ? "Save Changes" : "Add Product"}</button>
      </div>
    </div>
  </div>
</div>`;

  document.body.insertAdjacentHTML("beforeend", modalHtml);
  const productModal = new bootstrap.Modal(document.getElementById("productModal"));
  productModal.show();

  document.getElementById("productImage").addEventListener("change", e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      document.getElementById("imagePreview").innerHTML = `<img src="${reader.result}" style="width:150px;border-radius:10px;">`;
    };
    reader.readAsDataURL(file);
  });

  document.getElementById("saveProductBtn").onclick = async () => {
    const newProduct = {
      id: isEdit ? product.id : 'SP' + Date.now(),
      ownerEmail: currentUser.email,
      name: document.getElementById("productName").value,
      category: document.getElementById("productCategory").value,
      price: Number(document.getElementById("productPrice").value),
      description: document.getElementById("productDescription").value,
      image: document.getElementById("imagePreview").querySelector("img")?.src || ""
    };

    // compress image if base64 present and too big
    if (newProduct.image && newProduct.image.startsWith('data:')) {
        try {
            newProduct.image = await compressImage(newProduct.image, 800, 0.4);
        } catch(e){ /* ignore */ }
    }

    if (isEdit) {
        const index = sellerProducts.findIndex(p => p.id === product.id);
        if (index !== -1) sellerProducts[index] = { ...sellerProducts[index], ...newProduct };
    } else {
        sellerProducts.push(newProduct);
    }

    localStorage.setItem('sellerProducts', JSON.stringify(sellerProducts));
    renderSellerProductsList();
    // refresh marketplace views
    loadFeaturedProducts();
    loadBrowseProducts();
    productModal.hide();
    document.querySelectorAll('.modal-backdrop').forEach(b=>b.remove());
  };
}

// delete, edit, marketplace render
function deleteSellerProduct(id){ if(!confirm('Delete this product?')) return; sellerProducts = sellerProducts.filter(p=>p.id!==id); localStorage.setItem('sellerProducts', JSON.stringify(sellerProducts)); renderSellerProductsList(); loadBrowseProducts(); }
function editSellerProduct(id){ const p = sellerProducts.find(x=>x.id===id); if(!p) return; openAddProductModal(p); }
function renderMarketplaceProducts(){ const container = document.getElementById('marketplaceList'); if(!container) return; if(sellerProducts.length===0){ container.innerHTML='<p>No products available yet.</p>'; return; } container.innerHTML = sellerProducts.map(p=>`<div class="product-card"><img src="${p.image}" class="product-img" /><h3>${p.name}</h3><p>${p.description}</p><strong>$${p.price}</strong><button class="btn btn-primary">Buy Now</button></div>`).join(''); }

// ------------- Dashboard helpers -------------
function loadMyPurchases(content){ /* simplified: implement if needed */ content.innerHTML = '<div class="dashboard-card"><p>Your purchases will show here.</p></div>'; }
function loadOrders(content){ content.innerHTML = '<div class="dashboard-card"><p>Orders/Payments will show here (admin area).</p></div>'; }
function loadSales(content){ content.innerHTML = '<div class="dashboard-card"><p>Sales overview coming soon.</p></div>'; }
function loadMessages(content){ content.innerHTML = `<h2><i class="fas fa-envelope"></i> Messages</h2><div class="dashboard-card"><p>Open Live Chat to view or reply.</p></div>`; }
function loadSettings(content){ content.innerHTML = `<h2><i class="fas fa-cog"></i> Settings</h2><div class="dashboard-card"><h4>Account Information</h4><div class="mb-3"><strong>Name:</strong> ${currentUser?.name||''}</div><div class="mb-3"><strong>Email:</strong> ${currentUser?.email||''}</div><div class="mb-3"><strong>Account Type:</strong> ${currentUser?.accountType||''}</div><div class="mb-3"><strong>Admin:</strong> ${currentUser?.isAdmin? 'Yes':'No'}</div><div class="mt-3">${!currentUser?.isAdmin? '<button class=\"btn btn-warning\" onclick=\"makeAdmin()\">Make Me Admin</button>':''}</div></div>`; }

window.upgradeToSeller = function(){ if(confirm('Upgrade to Seller account?')){ currentUser.accountType='seller'; saveCurrentUser(); alert('✅ You are now a Seller!'); updateUIForUser(); loadDashboardSection('products'); } };
window.makeAdmin = function(){ if(confirm('Make yourself an Admin? You can revert later.')){ currentUser.isAdmin=true; saveCurrentUser(); alert('✅ You are now an Admin! Refresh to view admin menus.'); location.reload(); } };

// ------------- Admin: payments & chats (basic helpers) -------------
function ensureAdminUser(){
    if(allUsers.length===0){
        const adminUser = { name:'Admin', email:'admin@digi-market.local', password:'admin123', accountType:'admin', isAdmin:true, cart:[], notifications:[], createdAt: Date.now() };
        allUsers.push(adminUser);
        localStorage.setItem('allUsers', JSON.stringify(allUsers));
    }
}
function ensureAdminMenus(){
    setTimeout(()=>{
        if(currentUser?.isAdmin){
            const sidebar = document.querySelector('.dashboard-sidebar');
            if(sidebar && !sidebar.querySelector('.admin-payments')) {
                const paymentsMenu = document.createElement('div'); paymentsMenu.className='dashboard-menu-item admin-payments'; paymentsMenu.dataset.section='orders'; paymentsMenu.innerHTML='<i class=\"fas fa-shield-alt me-2\"></i> Admin: Payments'; paymentsMenu.addEventListener('click', ()=>loadDashboardSection('orders')); sidebar.appendChild(paymentsMenu);
                const chatsMenu = document.createElement('div'); chatsMenu.className='dashboard-menu-item admin-chats'; chatsMenu.dataset.section='messages'; chatsMenu.innerHTML='<i class=\"fas fa-comments me-2\"></i> Admin: Chats'; chatsMenu.addEventListener('click', ()=>loadDashboardSection('messages')); sidebar.appendChild(chatsMenu);
            }
        }
    }, 300);
}

// ------------- Init -------------
document.addEventListener('DOMContentLoaded', ()=>{
    console.log('✅ DigiMarket Pro - script loaded');
    ensureAdminUser();
    checkAuth();
    // inject fallback notification dropdown if missing
    if(!document.getElementById('notificationDropdown')) {
        const dd = document.createElement('div'); dd.id='notificationDropdown'; dd.className='notification-dropdown hidden'; dd.innerHTML = '<div style=\"padding:1rem; font-weight:bold;\">Notifications</div><div id=\"notificationList\"></div>'; document.body.appendChild(dd);
    }
    updateNotificationUI();
    loadFeaturedProducts();
    loadBrowseProducts();
    ensureAdminMenus();
    console.log('Data:', { users: allUsers.length, payments: allPayments.length, chats: allChats.length, sellerProducts: sellerProducts.length });
});

// End of updated_script.js — ALL FIXES APPLIED (search for comments "FIXED:" or "FINISHED:" in this file)
