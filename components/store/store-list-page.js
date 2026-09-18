/**
 * Lista pública de tiendas en store.html.
 */
(function (global) {
    'use strict';

    function render() {
        const grid = document.getElementById('storesGrid');
        const svc = global.PublicStoreService;
        if (!grid || !svc) return;

        const stores = svc.getStores();
        grid.innerHTML = '';

        stores.forEach((store, idx) => {
            const col = document.createElement('div');
            col.className = 'col-md-6 col-lg-4';
            col.setAttribute('data-aos', 'fade-up');
            col.setAttribute('data-aos-delay', String(Math.min(idx * 80, 480)));

            const preview = (store.products || []).slice(0, 3);
            const avatarHtml = store.avatar
                ? `<img src="${svc.esc(store.avatar)}" alt="${svc.esc(store.name)}" class="artisan-avatar">`
                : `<div class="avatar-fallback">${svc.esc(svc.initials(store.name))}</div>`;

            col.innerHTML = `
                <a class="store-card-link" href="${svc.esc(svc.storeUrl(store.id))}" aria-label="${svc.esc(store.name)}">
                    <div class="store-card shadow-sm">
                        <div class="artisan-header" style="display:flex;align-items:center;gap:14px;margin-bottom:12px;">
                            ${avatarHtml}
                            <div class="artisan-details" style="flex:1;">
                                <h3 class="store-name">${svc.esc(store.name)}</h3>
                                <p class="store-desc">${svc.esc(store.desc)}</p>
                            </div>
                        </div>
                        <div class="popular-products" style="display:grid;grid-template-columns:repeat(3, 1fr);gap:10px;margin-top:8px;">
                            ${preview.map((p) => `
                                <div class="product-mini" style="background:#fff;border-radius:10px;box-shadow:0 2px 8px rgba(80,0,0,0.08);overflow:hidden;display:flex;flex-direction:column;align-items:center;text-align:center;">
                                    <img src="${svc.esc(p.mainImage || p.img)}" alt="${svc.esc(p.name)}" style="width:100%;height:90px;object-fit:cover;">
                                    <span style="padding:6px 8px;font-size:0.9rem;color:#575443;">${svc.esc(p.name)}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </a>`;
            grid.appendChild(col);
        });

        if (global.AOS) {
            global.AOS.init({ duration: 800, once: true, offset: 60 });
        }
    }

    function init() {
        render();
    }

    global.StoreListPage = { init, render };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})(window);
