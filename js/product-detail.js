/**
 * Product Detail Page — reutiliza userProductsDB, productsDB y ecommerce-confirmation.
 */
(function () {
    'use strict';

    const CATEGORY_LABELS = {
        jewelry: 'Joyas',
        ceramics: 'Cerámicas',
        textiles: 'Textiles',
        sculpture: 'Esculturas'
    };

    let currentProduct = null;

    function esc(value) {
        if (window.SecurityUtils?.escapeHtml) return window.SecurityUtils.escapeHtml(value);
        const n = document.createElement('div');
        n.textContent = String(value ?? '');
        return n.innerHTML;
    }

    function t(key, fallback) {
        const lang = localStorage.getItem('lang') || 'es';
        return window.translations?.[lang]?.[key] || fallback || key;
    }

    function productUrl(id) {
        return `product.html#${encodeURIComponent(String(id))}`;
    }

    function formatPrice(price, currency) {
        const sym = currency === 'USD' ? 'B/. ' : '$';
        return `${sym}${Number(price).toFixed(2)}`;
    }

    function getCategoryLabel(category) {
        if (window.StoreService?.getCategoryLabel) {
            return window.StoreService.getCategoryLabel(category);
        }
        return CATEGORY_LABELS[category] || (category ? category.charAt(0).toUpperCase() + category.slice(1) : '');
    }

    function getAvailability(product) {
        if (product.stock === 0) {
            return { text: t('product_out_of_stock', 'Agotado'), class: 'product-detail-availability--out' };
        }
        if (product.stock <= 5) {
            return {
                text: t('product_low_stock', 'Pocas unidades') + ` (${product.stock})`,
                class: 'product-detail-availability--in'
            };
        }
        return { text: t('product_available', 'Disponible'), class: 'product-detail-availability--in' };
    }

    function getConditionLabel(product) {
        if (product.productCondition) return product.productCondition;
        if (product.tags?.includes('new')) return t('product_cond_new', 'Nuevo');
        if (product.tags?.includes('handmade')) return t('product_cond_handmade', 'Manualidad');
        return null;
    }

    function buildMetaItems(product) {
        const items = [];
        if (product.location) {
            items.push({ label: t('product_location', 'Ubicación'), value: product.location });
        }
        if (product.materials?.length) {
            items.push({ label: t('product_material', 'Material'), value: product.materials.join(', ') });
        }
        if (product.dimensions) {
            items.push({ label: t('product_dimensions', 'Dimensiones'), value: product.dimensions });
        }
        if (product.weight) {
            items.push({ label: t('product_weight', 'Peso'), value: product.weight });
        }
        if (product.elaborationTime) {
            items.push({ label: t('product_elaboration', 'Elaboración'), value: product.elaborationTime });
        }
        if (product.technique) {
            items.push({ label: t('product_technique', 'Técnica'), value: product.technique });
        }
        return items;
    }

    function getRelatedProducts(product) {
        const all = window.userProductsDB.getPublicProducts();
        const related = [];
        const seen = new Set([String(product.id)]);

        all.forEach((p) => {
            if (seen.has(String(p.id))) return;
            const sameCat = p.category === product.category;
            const sameArtisan = product.artisan && p.artisan && p.artisan.id === product.artisan.id;
            if (sameCat || sameArtisan) {
                related.push(p);
                seen.add(String(p.id));
            }
        });

        return related.slice(0, 4);
    }

    function isOwnProduct(product) {
        const user = window.localDB?.getCurrentUser();
        if (!user || !product) return false;
        return String(product.userId) === String(user.id) || String(product.sellerId) === String(user.id);
    }

    function showCartModal(productName) {
        document.querySelector('.cart-options-modal')?.remove();
        document.body.style.overflow = 'hidden';

        const modal = document.createElement('div');
        modal.className = 'cart-options-modal';
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-modal', 'true');
        modal.setAttribute('aria-labelledby', 'cartAddedTitle');
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h4 id="cartAddedTitle">${esc(t('dash_cart_added', 'Product Added!'))}</h4>
                    <button type="button" class="close-btn" aria-label="Close">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <p>"${esc(productName)}" ${esc(t('product_added_cart_desc', 'has been added to cart!'))}</p>
                    <div class="cart-options">
                        <button type="button" class="btn btn-primary cart-modal-view">
                            <i class="fas fa-shopping-cart"></i> ${esc(t('view_cart', 'View Cart'))}
                        </button>
                        <button type="button" class="btn btn-outline-primary cart-modal-continue">
                            <i class="fas fa-shopping-bag"></i> ${esc(t('dash_continue_shopping', 'Continue Shopping'))}
                        </button>
                    </div>
                </div>
            </div>`;
        document.body.appendChild(modal);

        const close = () => {
            modal.remove();
            document.body.style.overflow = '';
        };
        modal.querySelector('.close-btn').onclick = close;
        modal.querySelector('.cart-modal-view').onclick = () => { window.location.href = 'cart.html'; };
        modal.querySelector('.cart-modal-continue').onclick = close;
        modal.addEventListener('click', (e) => { if (e.target === modal) close(); });
    }

    function addToCart(redirectAfter) {
        if (!currentProduct) return false;
        const qty = parseInt(document.getElementById('productQty')?.value || '1', 10);
        const success = window.productsDB.addToCart(currentProduct.id, qty);
        if (!success) return false;

        window.productsDB.updateCartCount();
        window.ecommerceConfirmation?.updateCartBadge();

        if (redirectAfter === 'checkout') {
            window.location.href = 'checkout.html';
        } else if (redirectAfter === 'cart') {
            showCartModal(currentProduct.name);
        }
        return true;
    }

    function renderNotFound(container) {
        container.innerHTML = `
            <div class="product-detail-not-found">
                <i class="fas fa-box-open fa-3x mb-3" style="color:rgba(43,33,24,0.3)"></i>
                <h2>${esc(t('product_not_found', 'Producto no encontrado'))}</h2>
                <p class="text-muted mb-3">${esc(t('product_not_found_desc', 'El producto que buscas no existe o fue removido.'))}</p>
                <a href="explorar.html" class="btn btn-primary">${esc(t('product_back_explore', 'Volver a explorar'))}</a>
            </div>`;
    }

    function renderProduct(product) {
        currentProduct = product;
        const container = document.getElementById('productContainer');
        const availability = getAvailability(product);
        const condition = getConditionLabel(product);
        const metaItems = buildMetaItems(product);
        const images = product.images?.length ? product.images : (product.mainImage ? [product.mainImage] : []);
        const culturalStory = product.culturalStory || product.story || product.culturalHistory || null;

        const ratingBlock = product.rating
            ? `<div class="product-detail-rating" aria-label="${esc(t('product_rating', 'Calificación'))}">
                    <i class="fas fa-star"></i> ${product.rating}
                    ${product.reviews ? `<span>(${product.reviews} ${esc(t('product_reviews', 'reseñas'))})</span>` : ''}
               </div>`
            : '';

        const thumbsBlock = images.length > 1
            ? `<div class="product-detail-thumbs">${images.map((img, i) =>
                `<img src="${esc(img)}" alt="" class="product-detail-thumb${i === 0 ? ' is-active' : ''}" data-thumb="${esc(img)}" loading="lazy">`
            ).join('')}</div>`
            : '';

        const metaBlock = metaItems.length
            ? `<div class="product-detail-meta">${metaItems.map((m) =>
                `<div class="product-detail-meta-item"><strong>${esc(m.label)}</strong><span>${esc(m.value)}</span></div>`
            ).join('')}</div>`
            : '';

        const artisanStore = product.artisan && window.PublicStoreService
            ? window.PublicStoreService.getStoreByArtisan(product.artisan.id)
            : null;
        const artisanHref = artisanStore ? window.PublicStoreService.storeUrl(artisanStore.id) : 'store.html';
        const artisanBlock = product.artisan
            ? `<a class="product-detail-artisan" href="${esc(artisanHref)}">
                    ${product.artisan.avatar ? `<img src="${esc(product.artisan.avatar)}" alt="" class="product-detail-artisan__avatar" loading="lazy">` : ''}
                    <div>
                        <p class="product-detail-artisan__name">${esc(product.artisan.name)}</p>
                        <p class="product-detail-artisan__meta">
                            ${product.artisan.store ? esc(product.artisan.store) + ' · ' : ''}${esc(product.artisan.location || '')}
                        </p>
                    </div>
               </a>`
            : '';

        const ownProduct = isOwnProduct(product);
        const purchaseBlock = ownProduct ? `
                    <div class="product-detail-actions">
                        <button type="button" class="btn btn-outline-secondary" id="btnFavorite" aria-pressed="false">
                            <i class="fas fa-heart" id="favoriteIcon"></i>
                        </button>
                    </div>` : `
                    <div class="product-detail-qty">
                        <label for="productQty" style="font-weight:600">${esc(t('product_quantity', 'Cantidad'))}:</label>
                        <div class="product-detail-qty-controls">
                            <button type="button" class="product-detail-qty-btn" id="qtyMinus" aria-label="Menos">−</button>
                            <input type="number" id="productQty" class="product-detail-qty-input" value="1" min="1" max="${Math.max(product.stock, 1)}" aria-label="${esc(t('product_quantity', 'Cantidad'))}">
                            <button type="button" class="product-detail-qty-btn" id="qtyPlus" aria-label="Más">+</button>
                        </div>
                    </div>
                    <div class="product-detail-actions">
                        <button type="button" class="btn btn-add-cart" id="btnAddCart" ${product.stock === 0 ? 'disabled' : ''}>
                            <i class="fas fa-shopping-cart"></i> ${esc(t('product_add_cart', 'Add to Cart'))}
                        </button>
                        <button type="button" class="btn btn-buy-now" id="btnBuyNow" ${product.stock === 0 ? 'disabled' : ''}>
                            ${esc(t('product_buy_now', 'Comprar ahora'))}
                        </button>
                        <button type="button" class="btn btn-outline-secondary" id="btnFavorite" aria-pressed="false">
                            <i class="fas fa-heart" id="favoriteIcon"></i>
                        </button>
                    </div>`;

        container.innerHTML = `
            <a href="explorar.html" class="product-detail-back">
                <i class="fas fa-arrow-left" aria-hidden="true"></i>
                ${esc(t('product_back_explore', 'Volver a explorar'))}
            </a>
            <div class="product-detail-grid">
                <div class="product-detail-gallery">
                    <img src="${esc(images[0] || product.mainImage)}" alt="${esc(product.name)}" class="product-detail-gallery__main" id="productMainImage" loading="eager">
                    ${thumbsBlock}
                </div>
                <div class="product-detail-panel">
                    <span class="product-detail-category">${esc(getCategoryLabel(product.category))}</span>
                    <div class="product-detail-badges">
                        ${condition ? `<span class="product-detail-badge product-detail-badge--condition">${esc(condition)}</span>` : ''}
                        ${(product.tags || []).filter((tag) => !['featured', 'new', 'handmade'].includes(tag)).slice(0, 3).map((tag) =>
                            `<span class="product-detail-badge">${esc(tag)}</span>`
                        ).join('')}
                    </div>
                    <h1 class="product-detail-title">${esc(product.name)}</h1>
                    ${ratingBlock}
                    <p class="product-detail-availability ${availability.class}">${esc(availability.text)}</p>
                    <div class="product-detail-price">
                        ${formatPrice(product.price, product.currency)}
                        ${product.originalPrice > product.price ? `<s>${formatPrice(product.originalPrice, product.currency)}</s>` : ''}
                    </div>
                    ${product.description ? `<p class="product-detail-description">${esc(product.description)}</p>` : ''}
                    ${metaBlock}
                    ${purchaseBlock}
                    ${artisanBlock}
                </div>
            </div>
            ${culturalStory ? `
            <section class="product-detail-story" aria-labelledby="storyTitle">
                <h2 id="storyTitle">${esc(t('product_cultural_story', 'La historia detrás de esta creación'))}</h2>
                <p>${esc(culturalStory)}</p>
            </section>` : ''}
            <section class="product-detail-related" aria-labelledby="relatedTitle">
                <h2 id="relatedTitle">${esc(t('product_related_title', 'También te puede gustar'))}</h2>
                <div class="product-detail-related-grid" id="relatedProductsGrid"></div>
            </section>`;

        document.title = `${product.name} - ArteSana`;
        bindEvents(product);
        renderRelated(product);
        updateFavoriteButton(product.id);
    }

    function bindEvents(product) {
        document.getElementById('qtyMinus')?.addEventListener('click', () => changeQty(-1, product.stock));
        document.getElementById('qtyPlus')?.addEventListener('click', () => changeQty(1, product.stock));
        document.getElementById('btnAddCart')?.addEventListener('click', () => addToCart('cart'));
        document.getElementById('btnBuyNow')?.addEventListener('click', () => addToCart('checkout'));
        document.getElementById('btnFavorite')?.addEventListener('click', () => toggleFavorite(product.id));

        document.querySelectorAll('.product-detail-thumb').forEach((thumb) => {
            thumb.addEventListener('click', () => {
                document.getElementById('productMainImage').src = thumb.dataset.thumb;
                document.querySelectorAll('.product-detail-thumb').forEach((t) => t.classList.remove('is-active'));
                thumb.classList.add('is-active');
            });
        });
    }

    function changeQty(delta, max) {
        const input = document.getElementById('productQty');
        if (!input) return;
        const val = parseInt(input.value, 10) + delta;
        if (val >= 1 && val <= max) input.value = val;
    }

    function toggleFavorite(productId) {
        const inFav = window.userProductsDB.isInFavorites(productId);
        if (inFav) {
            window.userProductsDB.removeFromFavorites(productId);
            window.ecommerceConfirmation?.showFavoriteConfirmation(productId, false);
        } else {
            window.userProductsDB.addToFavorites(productId);
            window.ecommerceConfirmation?.showFavoriteConfirmation(productId, true);
        }
        updateFavoriteButton(productId);
    }

    function updateFavoriteButton(productId) {
        const btn = document.getElementById('btnFavorite');
        const icon = document.getElementById('favoriteIcon');
        if (!btn || !icon) return;
        const inFav = window.userProductsDB.isInFavorites(productId);
        btn.setAttribute('aria-pressed', inFav ? 'true' : 'false');
        icon.style.color = inFav ? '#8F1111' : '';
    }

    function renderRelated(product) {
        const grid = document.getElementById('relatedProductsGrid');
        if (!grid) return;
        const related = getRelatedProducts(product);
        if (!related.length) {
            grid.innerHTML = `<p class="text-muted">${esc(t('product_no_related', 'No hay productos relacionados por ahora.'))}</p>`;
            return;
        }
        grid.innerHTML = related.map((p) => `
            <a href="${productUrl(p.id)}" class="product-detail-related-card">
                <img src="${esc(p.mainImage)}" alt="${esc(p.name)}" loading="lazy">
                <div class="product-detail-related-card__body">
                    <div class="product-detail-related-card__name">${esc(p.name)}</div>
                    <div class="product-detail-related-card__price">${formatPrice(p.price, p.currency)}</div>
                </div>
            </a>`).join('');
    }

    function readProductId() {
        const fromQuery = new URLSearchParams(window.location.search).get('id');
        if (fromQuery) return fromQuery;
        const hash = window.location.hash.replace(/^#/, '');
        if (!hash) return null;
        if (hash.startsWith('id=')) return decodeURIComponent(hash.slice(3));
        return decodeURIComponent(hash);
    }

    function init() {
        const productId = readProductId();
        const container = document.getElementById('productContainer');

        if (!productId || !window.userProductsDB) {
            renderNotFound(container);
            return;
        }

        const product = window.userProductsDB.getProductById(productId)
            || window.PublicStoreService?.getProductById(productId);
        if (!product) {
            renderNotFound(container);
            return;
        }

        renderProduct(product);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
