/**
 * Perfil público de tienda: vendedor, chat y publicaciones.
 */
(function (global) {
    'use strict';

    function t(key, fallback) {
        return global.PublicStoreService?.t(key, fallback) || fallback;
    }

    function esc(value) {
        return global.PublicStoreService?.esc(value) ?? String(value ?? '');
    }

    function productIdJs(id) {
        return `'${String(id).replace(/'/g, "\\'")}'`;
    }

    function isOwnProduct(product) {
        const user = global.localDB?.getCurrentUser();
        if (!user || !product) return false;
        return String(product.userId) === String(user.id) || String(product.sellerId) === String(user.id);
    }

    function goToProductDetail(productId) {
        window.location.href = 'product.html#' + encodeURIComponent(String(productId));
    }

    function handleProductClick(productId, event) {
        if (event.target.closest('.action-btn') || event.target.closest('.view-product-link')) return;
        goToProductDetail(productId);
    }

    function toggleFavorite(productId) {
        if (!global.userProductsDB) return;
        const isInFavorites = global.userProductsDB.isInFavorites(productId);
        const heartIcon = document.getElementById(`favorite-${productId}`);
        if (isInFavorites) {
            global.userProductsDB.removeFromFavorites(productId);
            if (heartIcon) heartIcon.style.color = '#fff';
            global.ecommerceConfirmation?.showFavoriteConfirmation(productId, false);
        } else {
            global.userProductsDB.addToFavorites(productId);
            if (heartIcon) heartIcon.style.color = '#e74c3c';
            global.ecommerceConfirmation?.showFavoriteConfirmation(productId, true);
        }
    }

    function toggleComparison(productId) {
        if (!global.userProductsDB) return;
        const isInComparison = global.userProductsDB.isInComparison(productId);
        const compareIcon = document.getElementById(`compare-${productId}`);
        if (isInComparison) {
            global.userProductsDB.removeFromComparison(productId);
            if (compareIcon) compareIcon.style.color = '#fff';
            global.ecommerceConfirmation?.showComparisonConfirmation(productId, false);
        } else {
            global.userProductsDB.addToComparison(productId);
            if (compareIcon) compareIcon.style.color = '#a22a22';
            global.ecommerceConfirmation?.showComparisonConfirmation(productId, true);
        }
    }

    function renderProductCard(product, index) {
        const ownProduct = isOwnProduct(product);
        const inFav = global.userProductsDB?.isInFavorites(product.id);
        const inCmp = global.userProductsDB?.isInComparison(product.id);
        const cartBtn = ownProduct ? '' : `
            <button class="action-btn add-to-cart-btn" type="button" onclick="addToCartFromCard(${productIdJs(product.id)}, event)" title="Add to Cart" aria-label="${esc(t('product_add_cart', 'Añadir al carrito'))}">
                <i class="fas fa-shopping-cart"></i>
            </button>`;
        const desc = String(product.description || '');
        return `
            <div class="col-md-6 col-lg-4" data-aos="fade-up" data-aos-delay="${index * 80}">
                <div class="product-card-explore" onclick="handleProductClick(${productIdJs(product.id)}, event)" role="button" tabindex="0" aria-label="${esc(product.name)}" onkeydown="if(event.key==='Enter')handleProductClick(${productIdJs(product.id)}, event)">
                    <div class="product-image">
                        <img src="${esc(product.mainImage)}" alt="${esc(product.name)}" loading="lazy">
                        <div class="product-actions">
                            <button class="action-btn" type="button" aria-label="${esc(t('product_favorite', 'Favorito'))}" onclick="event.stopPropagation(); toggleFavorite(${productIdJs(product.id)})">
                                <i class="fas fa-heart" id="favorite-${esc(product.id)}" style="color: ${inFav ? '#e74c3c' : '#fff'}"></i>
                            </button>
                            <button class="action-btn" type="button" aria-label="${esc(t('product_compare', 'Comparar'))}" onclick="event.stopPropagation(); toggleComparison(${productIdJs(product.id)})">
                                <i class="fas fa-balance-scale" id="compare-${esc(product.id)}" style="color: ${inCmp ? '#a22a22' : '#fff'}"></i>
                            </button>
                            ${cartBtn}
                        </div>
                    </div>
                    <div class="product-info">
                        <h3 onclick="event.stopPropagation(); goToProductDetail(${productIdJs(product.id)})">${esc(product.name)}</h3>
                        <p class="description">${esc(desc.substring(0, 100))}${desc.length > 100 ? '...' : ''}</p>
                        <div class="product-meta">
                            <span class="price">B/. ${Number(product.price || 0).toFixed(2)}</span>
                            <div class="rating">
                                <i class="fas fa-star" aria-hidden="true"></i>
                                <span>${product.rating || '—'}</span>
                            </div>
                        </div>
                        <a href="product.html#${encodeURIComponent(String(product.id))}" class="view-product-link" onclick="event.stopPropagation()">
                            <i class="fas fa-eye" aria-hidden="true"></i>
                            <span data-i18n="product_view_product">${esc(t('product_view_product', 'Ver producto'))}</span>
                        </a>
                    </div>
                </div>
            </div>`;
    }

    function openSellerChat(store) {
        const user = global.RoleService?.getCurrentUser?.() || global.localDB?.getCurrentUser?.();
        if (!user) {
            document.querySelector('auth-modal')?.open('login');
            return;
        }

        const artisan = {
            id: store.sellerId,
            name: store.sellerName || store.name,
            avatar: store.sellerAvatar || store.avatar || ''
        };
        const chat = global.PlatformServices?.startChatWithArtisan(artisan);
        const openOverlay = () => {
            const overlay = document.querySelector('messages-overlay');
            if (overlay?.open) overlay.open(chat?.id);
        };

        if (document.querySelector('messages-overlay')) {
            openOverlay();
        } else {
            document.addEventListener('messages:ready', openOverlay, { once: true });
            global.AppCore?.init?.({ auth: false });
        }
    }

    function renderNotFound(root) {
        root.innerHTML = `
            <a class="public-store-back" href="store.html"><i class="fas fa-arrow-left"></i> ${esc(t('public_store_back', 'Volver a tiendas'))}</a>
            <div class="public-store-empty">${esc(t('public_store_not_found', 'No encontramos esta tienda.'))}</div>`;
    }

    function renderStore(store, root) {
        const avatar = store.avatar || store.sellerAvatar
            ? `<img class="public-store-avatar" src="${esc(store.avatar || store.sellerAvatar)}" alt="${esc(store.name)}">`
            : `<div class="public-store-avatar-fallback">${esc(global.PublicStoreService.initials(store.name))}</div>`;

        const rating = store.rating
            ? `<span><i class="fas fa-star"></i> ${esc(store.rating)}</span>`
            : '';

        const products = store.products || [];
        const grid = products.length
            ? `<div class="row g-4">${products.map((p, i) => renderProductCard(p, i)).join('')}</div>`
            : `<div class="public-store-empty">${esc(t('public_store_no_posts', 'Esta tienda aún no tiene publicaciones.'))}</div>`;

        root.innerHTML = `
            <a class="public-store-back" href="store.html"><i class="fas fa-arrow-left"></i> ${esc(t('public_store_back', 'Volver a tiendas'))}</a>
            <section class="public-store-hero" id="sellerProfile">
                ${avatar}
                <div>
                    <h1>${esc(store.name)}</h1>
                    <p class="public-store-seller">${esc(t('public_store_seller', 'Vendedor'))}: ${esc(store.sellerName || store.name)}</p>
                    <div class="public-store-meta">
                        ${store.location ? `<span><i class="fas fa-map-marker-alt"></i>${esc(store.location)}</span>` : ''}
                        ${rating}
                        <span><i class="fas fa-store"></i>${products.length} ${esc(t('public_store_publications', 'publicaciones'))}</span>
                    </div>
                    <p class="public-store-desc">${esc(store.desc || '')}</p>
                    <div class="public-store-actions">
                        <button type="button" class="btn btn-primary" id="publicStoreMessageBtn">
                            <i class="fas fa-envelope"></i> ${esc(t('public_store_write', 'Escribirle'))}
                        </button>
                    </div>
                </div>
            </section>
            <section>
                <h2 class="mb-4" style="font-family:'Playfair Display',serif;color:#8F1111;">${esc(t('tienda_products_title', 'Productos de la tienda'))}</h2>
                ${grid}
            </section>`;

        document.getElementById('publicStoreMessageBtn')?.addEventListener('click', () => openSellerChat(store));
        document.title = `${store.name} | ArteSana`;
        if (global.AOS) global.AOS.init({ duration: 800, once: true });
        if (global.setLanguage) global.setLanguage(localStorage.getItem('lang') || 'es');
    }

    function readStoreId() {
        const fromQuery = new URLSearchParams(window.location.search).get('id');
        if (fromQuery) return fromQuery;
        const hash = window.location.hash.replace(/^#/, '');
        if (!hash) return null;
        if (hash.startsWith('id=')) return decodeURIComponent(hash.slice(3));
        return decodeURIComponent(hash);
    }

    function init() {
        const root = document.getElementById('publicStoreRoot');
        if (!root || !global.PublicStoreService) return;

        const id = readStoreId();
        const store = global.PublicStoreService.getStoreById(id);
        if (!store) {
            renderNotFound(root);
            return;
        }
        renderStore(store, root);
    }

    global.handleProductClick = handleProductClick;
    global.goToProductDetail = goToProductDetail;
    global.toggleFavorite = toggleFavorite;
    global.toggleComparison = toggleComparison;
    global.PublicStorePage = { init, openSellerChat };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})(window);
