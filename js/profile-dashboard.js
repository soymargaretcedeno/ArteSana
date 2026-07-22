/**
 * Perfil adaptado por rol: Cliente vs Vendedor.
 */
(function (global) {
    'use strict';

    function esc(s) {
        if (global.SecurityUtils && global.SecurityUtils.escapeHtml) {
            return global.SecurityUtils.escapeHtml(s);
        }
        return String(s ?? '').replace(/[&<>"']/g, c => ({
            '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
        }[c]));
    }

    function t(key, fallback) {
        const lang = localStorage.getItem('lang') || 'es';
        return (global.translations && global.translations[lang] && global.translations[lang][key]) || fallback || key;
    }

    function showSection(section) {
        document.querySelectorAll('.profile-nav .nav-link[data-section]').forEach(l => {
            l.classList.toggle('active', l.getAttribute('data-section') === section);
        });
        const targetId = section + '-section';
        document.querySelectorAll('.dashboard-section').forEach(sec => {
            const match = sec.id === targetId;
            sec.classList.toggle('d-none', !match);
            if (match) {
                sec.classList.add('animate__animated', 'animate__fadeIn');
                setTimeout(() => sec.classList.remove('animate__animated', 'animate__fadeIn'), 800);
            }
        });
    }

    function renderOrders(user, isSeller) {
        const tbody = document.getElementById('ordersTableBody');
        if (!tbody || !global.productsDB) return;

        let orders = [];
        if (isSeller) {
            orders = global.productsDB.getSellerOrders(user.id) || [];
            // Si no hay ventas, mostrar también compras propias (vendedor puede comprar)
            const purchases = global.productsDB.getUserOrders(user.id) || [];
            const purchaseOnly = purchases.filter(p => !orders.some(o => o.id === p.id));
            orders = [...orders, ...purchaseOnly];
        } else {
            orders = global.productsDB.getUserOrders(user.id) || [];
        }

        // Fallback a muestras de plataforma si no hay órdenes reales
        if (!orders.length && global.PlatformServices && !isSeller) {
            const samples = global.PlatformServices.getOrders() || [];
            tbody.innerHTML = samples.map(o => `
                <tr>
                    <td>#${esc(o.id)}</td>
                    <td>${esc(o.product)}</td>
                    <td>${esc(o.updatedAt)}</td>
                    <td><span class="badge bg-secondary">${esc(o.statusLabel)}</span></td>
                    <td>$${Number(o.total).toFixed(2)}</td>
                </tr>
            `).join('');
            return;
        }

        if (!orders.length) {
            tbody.innerHTML = `<tr><td colspan="5" class="text-muted">${t('profile_no_orders', 'Aún no tienes órdenes.')}</td></tr>`;
            return;
        }

        tbody.innerHTML = orders.map(o => {
            const productName = (o.items && o.items[0] && (o.items[0].name || o.items[0].productName)) || o.product || 'Pedido';
            const date = o.createdAt ? new Date(o.createdAt).toLocaleDateString() : (o.updatedAt || '');
            const status = o.status || 'pending';
            return `
                <tr>
                    <td>#${esc(o.id)}</td>
                    <td>${esc(productName)}${(o.items && o.items.length > 1) ? ' +' + (o.items.length - 1) : ''}</td>
                    <td>${esc(date)}</td>
                    <td><span class="badge bg-secondary">${esc(status)}</span></td>
                    <td>$${Number(o.total || 0).toFixed(2)}</td>
                </tr>
            `;
        }).join('');
    }

    function renderFavorites() {
        const section = document.getElementById('favorites-section');
        if (!section || !global.userProductsDB) return;
        const container = section.querySelector('.row.g-4') || section.querySelector('.content-card');
        const products = global.userProductsDB.getFavoriteProducts() || [];
        const html = products.length
            ? `<div class="row g-4">${products.map(p => `
                <div class="col-md-4">
                    <div class="product-card shadow-sm" style="cursor:pointer;" onclick="location.href='product.html?id=${encodeURIComponent(p.id)}'">
                        <div class="product-image"><img src="${esc(p.mainImage)}" alt="${esc(p.name)}"></div>
                        <div class="product-info">
                            <h5>${esc(p.name)}</h5>
                            <div class="price">$${Number(p.price).toFixed(2)}</div>
                        </div>
                    </div>
                </div>`).join('')}</div>`
            : `<p class="text-muted">${t('profile_no_favorites', 'No tienes favoritos aún. Explora tiendas y marca corazón en los productos.')}</p>`;

        const card = section.querySelector('.content-card');
        if (card) {
            const title = card.querySelector('h3');
            card.innerHTML = '';
            if (title) card.appendChild(title);
            else {
                const h = document.createElement('h3');
                h.textContent = t('profile_favorites_title', 'Favoritos');
                card.appendChild(h);
            }
            const wrap = document.createElement('div');
            wrap.innerHTML = html;
            card.appendChild(wrap);
        }
    }

    function renderSpendChart(user) {
        const canvas = document.getElementById('salesChart');
        const ordersCanvas = document.getElementById('ordersChart');
        if (!canvas || !global.Chart || !global.productsDB) return;

        const orders = global.productsDB.getUserOrders(user.id) || [];
        const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
        const spend = new Array(12).fill(0);
        const counts = new Array(12).fill(0);
        orders.forEach(o => {
            if (!o.createdAt) return;
            const m = new Date(o.createdAt).getMonth();
            spend[m] += Number(o.total) || 0;
            counts[m] += 1;
        });

        // Si no hay datos, mostrar demo suave
        const hasData = spend.some(v => v > 0);
        const spendData = hasData ? spend : [20, 45, 30, 60, 25, 80, 40, 0, 0, 0, 0, 0];
        const countData = hasData ? counts : [1, 2, 1, 3, 1, 2, 1, 0, 0, 0, 0, 0];

        if (canvas._chart) canvas._chart.destroy();
        canvas._chart = new global.Chart(canvas.getContext('2d'), {
            type: 'line',
            data: {
                labels: months,
                datasets: [{
                    label: t('profile_spend_label', 'Gasto ($)'),
                    data: spendData,
                    borderColor: '#800000',
                    backgroundColor: 'rgba(128,0,0,0.1)',
                    fill: true
                }]
            },
            options: { responsive: true }
        });

        if (ordersCanvas) {
            if (ordersCanvas._chart) ordersCanvas._chart.destroy();
            ordersCanvas._chart = new global.Chart(ordersCanvas.getContext('2d'), {
                type: 'bar',
                data: {
                    labels: months,
                    datasets: [{
                        label: t('profile_orders', 'Órdenes'),
                        data: countData,
                        backgroundColor: '#a22a22'
                    }]
                },
                options: { responsive: true }
            });
        }
    }

    function renderSellerProducts(user) {
        const grid = document.getElementById('myProductsGridSim');
        if (!grid || !global.userProductsDB) return;
        const products = global.userProductsDB.getUserOwnProducts(user.id) || [];
        const statProducts = document.getElementById('stat-products');
        if (statProducts) statProducts.textContent = String(products.length);

        if (!products.length) {
            grid.innerHTML = `<div class="col-12"><p class="text-muted">${t('profile_no_products', 'Aún no tienes productos.')} <a href="add-product.html">Agregar producto</a></p></div>`;
            return;
        }

        grid.innerHTML = products.map(p => `
            <div class="col-md-4" data-product-id="${esc(p.id)}">
                <div class="product-card position-relative">
                    <button type="button" class="btn btn-sm btn-danger position-absolute btn-delete-product" style="top:10px;right:10px;border-radius:50%;padding:6px 8px;z-index:2;" title="Eliminar">
                        <i class="fas fa-trash"></i>
                    </button>
                    <div class="product-image"><img src="${esc(p.mainImage)}" alt="${esc(p.name)}"></div>
                    <div class="product-info">
                        <h5>${esc(p.name)}</h5>
                        <div class="price">$${Number(p.price).toFixed(2)}</div>
                        <div class="small text-muted">${esc(p.category || '')} | Stock: ${esc(p.stock)}</div>
                        <a href="add-product.html?edit=${encodeURIComponent(p.id)}" class="small">${t('profile_edit_product', 'Editar')}</a>
                    </div>
                </div>
            </div>
        `).join('');

        grid.querySelectorAll('.btn-delete-product').forEach(btn => {
            btn.addEventListener('click', function () {
                const card = btn.closest('[data-product-id]');
                const id = card && card.getAttribute('data-product-id');
                if (!id || !confirm(t('profile_delete_product_confirm', '¿Eliminar este producto?'))) return;
                global.userProductsDB.deleteUserProduct(id);
                renderSellerProducts(user);
            });
        });
    }

    let activeProfileChat = null;

    function renderChat(user, isSeller) {
        const list = document.getElementById('profileChatList');
        const messages = document.getElementById('profileChatMessages');
        if (!list || !global.PlatformServices) return;

        const threads = isSeller
            ? global.PlatformServices.getSellerThreads(user.id)
            : global.PlatformServices.getBuyerThreads(user.id);

        // Incluir hilos de muestra / todos si vacío
        const all = threads.length ? threads : global.PlatformServices.getMessageThreads();

        list.innerHTML = all.length ? all.map(c => `
            <button type="button" class="list-group-item list-group-item-action profile-chat-item" data-chat="${esc(c.id)}">
                <strong>${esc(isSeller ? (c.buyerName || 'Cliente') : (c.artisanName || 'Vendedor'))}</strong>
                <div class="small text-muted">${esc(c.storeName || c.lastMessage || '')}</div>
            </button>
        `).join('') : `<p class="text-muted p-2">${t('profile_no_chats', 'No hay conversaciones aún.')}</p>`;

        list.querySelectorAll('.profile-chat-item').forEach(btn => {
            btn.addEventListener('click', () => {
                activeProfileChat = all.find(c => c.id === btn.dataset.chat);
                list.querySelectorAll('.profile-chat-item').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                renderChatMessages(isSeller);
            });
        });

        const sendBtn = document.getElementById('profileChatSend');
        const input = document.getElementById('profileChatInput');
        if (sendBtn && !sendBtn._bound) {
            sendBtn._bound = true;
            sendBtn.addEventListener('click', () => sendProfileChat(isSeller));
            if (input) {
                input.addEventListener('keydown', e => {
                    if (e.key === 'Enter') sendProfileChat(isSeller);
                });
            }
        }

        function sendProfileChat(sellerMode) {
            const text = (input && input.value || '').trim();
            if (!text || !activeProfileChat) return;
            const sender = sellerMode ? 'artisan' : 'buyer';
            global.PlatformServices.sendMessage(activeProfileChat.id, text, sender);
            input.value = '';
            renderChatMessages(sellerMode);
        }

        function renderChatMessages(sellerMode) {
            if (!messages || !activeProfileChat) return;
            const msgs = global.PlatformServices.getChatMessages(activeProfileChat.id);
            messages.innerHTML = msgs.map(m => `
                <div class="p-2 mb-2 rounded ${m.sender === (sellerMode ? 'artisan' : 'buyer') ? 'bg-light border ms-auto' : 'text-white'}"
                     style="max-width:85%;${m.sender === (sellerMode ? 'artisan' : 'buyer') ? '' : 'background:#800000;'}">
                    ${esc(m.text)}
                    <small class="d-block opacity-75">${esc(m.time)}</small>
                </div>
            `).join('') || `<p class="text-muted small">${t('profile_chat_empty', 'Sin mensajes. Escribe para comenzar.')}</p>`;
            messages.scrollTop = messages.scrollHeight;
        }
    }

    function wireSettings(user) {
        const form = document.getElementById('profileSettingsForm');
        if (!form) return;
        const nameInput = document.getElementById('settingsName');
        const emailInput = document.getElementById('settingsEmail');
        const notifEmail = document.getElementById('notif1');
        const notifOrders = document.getElementById('notif2');
        const notifChat = document.getElementById('notifChat');

        if (nameInput) nameInput.value = user.name || '';
        if (emailInput) emailInput.value = user.email || '';
        const n = user.notifications || {};
        if (notifEmail) notifEmail.checked = n.email !== false;
        if (notifOrders) notifOrders.checked = n.orders !== false;
        if (notifChat) notifChat.checked = n.chat !== false;

        form.addEventListener('submit', function (e) {
            e.preventDefault();
            global.localDB.updateProfile(user.id, {
                name: nameInput ? nameInput.value.trim() : user.name,
                email: emailInput ? emailInput.value.trim() : user.email,
                notifications: {
                    email: !!(notifEmail && notifEmail.checked),
                    orders: !!(notifOrders && notifOrders.checked),
                    chat: !!(notifChat && notifChat.checked)
                }
            });
            const nameEl = document.getElementById('profileName');
            if (nameEl && nameInput) nameEl.textContent = nameInput.value.trim();
            alert(t('profile_settings_saved', 'Cambios guardados.'));
        });

        const logoutBtn = document.getElementById('profileLogoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', function () {
                global.localDB.logout();
                window.location.href = 'index.html';
            });
        }
    }

    function wireProductForm(user) {
        const form = document.getElementById('createProductForm');
        if (!form || form._bound) return;
        form._bound = true;

        const preview = document.getElementById('productImagePreview');
        const fileInput = document.getElementById('productImageFile');
        if (fileInput && preview) {
            fileInput.addEventListener('change', function () {
                const file = fileInput.files[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = e => {
                    preview.src = e.target.result;
                    preview.style.display = 'inline-block';
                };
                reader.readAsDataURL(file);
            });
        }

        form.addEventListener('submit', function (e) {
            e.preventDefault();
            if (!global.userProductsDB) return;
            const store = global.storesDB && global.storesDB.getStoreByOwner(user.id);
            const name = document.getElementById('productName').value.trim();
            const price = parseFloat(document.getElementById('productPrice').value);
            const category = (document.getElementById('productCategory').value || 'textiles').toLowerCase();
            const stock = parseInt(document.getElementById('productStock').value, 10) || 1;
            const img = (preview && preview.src) || 'https://via.placeholder.com/400x400?text=Producto';

            global.userProductsDB.addUserProduct({
                name,
                description: name,
                price,
                originalPrice: price,
                currency: 'USD',
                category,
                stock,
                mainImage: img,
                images: [img],
                tags: ['handmade'],
                artisan: {
                    id: user.id,
                    name: user.name,
                    avatar: user.avatar || '',
                    store: (store && store.name) || user.store || 'Mi tienda',
                    rating: user.rating || 5,
                    location: (store && store.location) || ''
                }
            });

            form.reset();
            if (preview) { preview.src = ''; preview.style.display = 'none'; }
            const modal = global.bootstrap && bootstrap.Modal.getInstance(document.getElementById('newProductModal'));
            if (modal) modal.hide();
            renderSellerProducts(user);
            showSection('my-products');
        });
    }

    function init() {
        const user = global.localDB && global.localDB.getCurrentUser();
        if (!user) return;

        const isSeller = global.RoleRouter ? global.RoleRouter.isSeller(user) : user.role === 'artisan';
        const roleLabel = global.RoleRouter ? global.RoleRouter.roleLabel(user) : user.role;

        const roleEl = document.getElementById('profileRole');
        if (roleEl) roleEl.textContent = roleLabel;

        const nameEl = document.getElementById('profileName');
        if (nameEl) nameEl.textContent = user.name;

        // Nav visibility
        document.querySelectorAll('[data-role-only]').forEach(el => {
            const only = el.getAttribute('data-role-only');
            const show = (only === 'seller' && isSeller) || (only === 'customer' && !isSeller) || only === 'both';
            el.classList.toggle('d-none', !show);
        });

        const addProductBtn = document.querySelector('[data-bs-target="#newProductModal"]');
        if (addProductBtn) {
            addProductBtn.classList.toggle('d-none', !isSeller);
            if (isSeller) {
                addProductBtn.addEventListener('click', function (e) {
                    // Preferir página completa si no hay tienda
                    if (global.RoleRouter && !global.RoleRouter.hasStore(user)) {
                        e.preventDefault();
                        window.location.href = 'crear-tienda.html';
                    }
                });
            }
        }

        // Stats
        const store = global.storesDB && global.storesDB.getStoreByOwner(user.id);
        const ownProducts = (global.userProductsDB && global.userProductsDB.getUserOwnProducts(user.id)) || [];
        const purchases = (global.productsDB && global.productsDB.getUserOrders(user.id)) || [];
        const favs = (global.userProductsDB && global.userProductsDB.getFavoriteProducts()) || [];

        const s1 = document.getElementById('stat-products');
        const s2 = document.getElementById('stat-sales');
        const s3 = document.getElementById('stat-rating');
        const l1 = s1 && s1.nextElementSibling;
        const l2 = s2 && s2.nextElementSibling;
        const l3 = s3 && s3.nextElementSibling;

        if (isSeller) {
            if (s1) s1.textContent = String(ownProducts.length);
            if (s2) s2.textContent = String((global.productsDB.getSellerOrders(user.id) || []).length);
            if (s3) s3.textContent = String(user.rating || '—');
            if (l1) l1.textContent = t('profile_products', 'Productos');
            if (l2) l2.textContent = t('profile_orders', 'Órdenes');
            if (l3) l3.textContent = t('profile_rating', 'Calificación');
        } else {
            if (s1) s1.textContent = String(purchases.length);
            if (s2) s2.textContent = '$' + purchases.reduce((a, o) => a + (Number(o.total) || 0), 0).toFixed(0);
            if (s3) s3.textContent = String(favs.length);
            if (l1) l1.textContent = t('profile_orders', 'Órdenes');
            if (l2) l2.textContent = t('profile_spend_label', 'Gastado');
            if (l3) l3.textContent = t('profile_favorites', 'Favoritos');
        }

        // Store info block
        const storeInfo = document.getElementById('myStoreInfo');
        if (storeInfo && store) {
            storeInfo.innerHTML = `<strong>${esc(store.name)}</strong> · ${esc(store.location)}
                <br><a href="tienda.html?id=${encodeURIComponent(store.id)}">${t('profile_view_store', 'Ver tienda pública')}</a>
                · <a href="explorar.html">${t('explore', 'Explorar')}</a>`;
        }

        // Seller can also shop
        const shopLink = document.getElementById('sellerShopLink');
        if (shopLink) shopLink.classList.toggle('d-none', !isSeller);

        renderOrders(user, isSeller);
        renderFavorites();
        renderSpendChart(user);
        if (isSeller) {
            renderSellerProducts(user);
            wireProductForm(user);
        }
        renderChat(user, isSeller);
        wireSettings(user);

        // Nav
        document.querySelectorAll('.profile-nav .nav-link[data-section]').forEach(link => {
            link.addEventListener('click', function (e) {
                e.preventDefault();
                showSection(this.getAttribute('data-section'));
            });
        });

        // Hash deep links
        const hash = (location.hash || '').replace('#', '');
        if (hash === 'my-products' || hash === 'orders' || hash === 'chat' || hash === 'settings' || hash === 'favorites' || hash === 'analytics') {
            showSection(hash === 'my-products' ? 'my-products' : hash);
        } else {
            showSection('dashboard');
            const productsCard = document.getElementById('myProductsSimSection');
            if (productsCard && !isSeller) productsCard.classList.add('d-none');
            if (productsCard && isSeller) productsCard.classList.add('d-none'); // solo vía nav
        }

        // Dashboard copy
        const dash = document.getElementById('dashboard-section');
        if (dash && !isSeller) {
            const overview = dash.querySelector('.content-card');
            if (overview) {
                overview.querySelectorAll('.sales-info h4').forEach((h, i) => {
                    if (i === 0) h.textContent = t('profile_orders', 'Órdenes');
                    if (i === 1) h.textContent = t('profile_spend_label', 'Gastado');
                    if (i === 2) h.textContent = t('profile_favorites', 'Favoritos');
                });
                overview.querySelectorAll('.sales-info .h5').forEach((p, i) => {
                    if (i === 0) p.textContent = String(purchases.length);
                    if (i === 1) p.textContent = '$' + purchases.reduce((a, o) => a + (Number(o.total) || 0), 0).toFixed(2);
                    if (i === 2) p.textContent = String(favs.length);
                });
            }
        }
    }

    global.ProfileDashboard = { init, showSection };

    function boot() {
        setTimeout(init, 80);
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot);
    } else {
        boot();
    }
    document.addEventListener('app:ready', init, { once: true });
})(window);
