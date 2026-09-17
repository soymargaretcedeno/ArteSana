/**
 * Adaptador dinámico del perfil según rol (Cliente / Vendedor).
 */
(function (global) {
    'use strict';

    const RS = () => global.RoleService;

    function t(key, fallback) {
        return RS().t(key, fallback);
    }

    function applyProfileRoleUI() {
        const user = RS().getCurrentUser();
        if (!user) return;

        if (RS().needsRoleSelection(user)) {
            window.location.href = 'seleccionar-rol.html';
            return;
        }

        const isSeller = user.role === RS().ROLES.ARTISAN || RS().isArtisan(user);
        const store = RS().getStore(user.id);
        const hasStore = !!store;
        const roleEl = document.getElementById('profileRole');
        const addProductBtn = document.getElementById('profileAddProductBtn');
        const statLabels = document.querySelectorAll('.profile-stats .stat .label');

        if (roleEl) {
            roleEl.textContent = RS().getRoleLabel(user.role);
        }

        document.body.dataset.userRole = user.role;
        document.body.classList.toggle('role-artisan', isSeller);
        document.body.classList.toggle('role-customer', !isSeller);

        document.querySelectorAll('[data-show-role="artisan"]').forEach(el => {
            const needsStore = el.dataset.requiresStore === 'true';
            const show = needsStore ? (isSeller && hasStore) : isSeller;
            el.classList.toggle('d-none', !show);
        });
        document.querySelector('[data-section="my-products"]')?.classList.toggle('d-none', isSeller && hasStore);
        document.querySelectorAll('[data-show-role="customer"]').forEach(el => {
            el.classList.toggle('d-none', isSeller);
        });

        bindAddProductBtn(isSeller, hasStore);

        const dashClientOrders = document.getElementById('dashClientOrders');
        const dashClientFavorites = document.getElementById('dashClientFavorites');
        if (dashClientOrders) dashClientOrders.textContent = user.orders || 0;
        if (dashClientFavorites) dashClientFavorites.textContent = user.favorites || 0;

        if (isSeller && hasStore) {
            renderStorePanel(store);
            if (statLabels.length >= 3) {
                statLabels[0].textContent = t('profile_products', 'Productos');
                statLabels[1].textContent = t('profile_sales', 'Ventas');
                statLabels[2].textContent = t('profile_rating', 'Calificación');
            }
            const productCount = global.StoreService
                ? global.StoreService.getSellerProducts(user.id).length
                : (user.products || 0);
            document.getElementById('stat-products').textContent = productCount;
            document.getElementById('stat-sales').textContent = '12';
            document.getElementById('stat-rating').textContent = user.rating || '4.8';
        } else if (isSeller && !hasStore) {
            renderStoreSetup();
            if (statLabels.length >= 3) {
                statLabels[0].textContent = t('profile_products', 'Productos');
                statLabels[1].textContent = t('profile_sales', 'Ventas');
                statLabels[2].textContent = t('profile_rating', 'Calificación');
            }
        } else {
            if (statLabels.length >= 3) {
                statLabels[0].textContent = t('profile_orders', 'Órdenes');
                statLabels[1].textContent = t('profile_favorites', 'Favoritos');
                statLabels[2].textContent = t('role_spending', 'Gastos');
            }
            document.getElementById('stat-products').textContent = user.orders || 0;
            document.getElementById('stat-rating').textContent = user.favorites || 0;
            document.getElementById('stat-sales').textContent = '$0';
        }

        renderDashboardContent(isSeller, hasStore);
        bindStoreForm(hasStore);
        handleDeepLinks(isSeller, hasStore);
    }

    function renderDashboardContent(isSeller, hasStore) {
        const dashTitle = document.getElementById('dashboardTitle');
        const dashClient = document.getElementById('dashboardClientCards');
        const dashSeller = document.getElementById('dashboardSellerCards');
        const productsSim = document.getElementById('myProductsSimSection');

        if (dashTitle) {
            dashTitle.textContent = isSeller && hasStore
                ? t('role_seller_dashboard', 'Panel de vendedor')
                : isSeller
                    ? t('role_setup_store', 'Configura tu tienda')
                    : t('role_client_dashboard', 'Panel de cliente');
        }

        if (dashClient) dashClient.classList.toggle('d-none', isSeller);
        if (dashSeller) dashSeller.classList.toggle('d-none', !(isSeller && hasStore));
        if (productsSim) productsSim.classList.toggle('d-none', !(isSeller && hasStore));
        const productsSection = document.getElementById('my-products-section');
        if (productsSection) productsSection.classList.toggle('d-none', !(isSeller && hasStore));
    }

    function renderStorePanel(storeData) {
        const setupWrap = document.getElementById('storeSetupWrap');
        const panelContainer = document.getElementById('storePanelContainer');

        if (setupWrap) setupWrap.classList.add('d-none');
        if (panelContainer && global.StorePanel) {
            panelContainer.classList.remove('d-none');
            global.StorePanel.init(panelContainer, storeData);
        }
    }

    function renderStoreSetup() {
        const setupWrap = document.getElementById('storeSetupWrap');
        const panelContainer = document.getElementById('storePanelContainer');
        if (setupWrap) setupWrap.classList.remove('d-none');
        if (panelContainer) panelContainer.classList.add('d-none');
    }

    function renderStoreInfo(store) {
        renderStorePanel(store);
    }

    function bindStoreForm(hasStore) {
        const form = document.getElementById('createStoreFormProfile');
        if (!form || hasStore || form.dataset.bound === 'true') return;
        form.dataset.bound = 'true';

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const fd = new FormData(form);
            const result = await RS().createStore({
                name: fd.get('name'),
                location: fd.get('location'),
                photo: fd.get('photo'),
                desc: fd.get('desc')
            });

            if (result.success) {
                applyProfileRoleUI();
                document.querySelector('[data-section="my-store"]')?.click();
                const successEl = document.getElementById('storeCreateSuccess');
                if (successEl) {
                    successEl.classList.remove('d-none');
                    setTimeout(() => successEl.classList.add('d-none'), 4000);
                }
            } else {
                alert(result.message);
            }
        });
    }

    function bindAddProductBtn(isSeller, hasStore) {
        const btn = document.getElementById('profileAddProductBtn');
        if (!btn) return;

        if (isSeller && hasStore) {
            btn.style.display = '';
            if (btn.dataset.bound !== 'true') {
                btn.dataset.bound = 'true';
                btn.addEventListener('click', openCreatePublication);
            }
        } else {
            btn.style.display = 'none';
        }
    }

    function openCreatePublication() {
        const storeNav = document.querySelector('[data-section="my-store"]');
        const navLinks = document.querySelectorAll('.profile-nav .nav-link');
        const sections = document.querySelectorAll('.dashboard-section');

        navLinks.forEach(l => l.classList.remove('active'));
        storeNav?.classList.add('active');

        sections.forEach(sec => {
            sec.classList.toggle('d-none', sec.id !== 'my-store-section');
        });

        if (global.StorePanel) {
            global.StorePanel.showView('create');
        }

        document.getElementById('my-store-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    function handleDeepLinks(isSeller, hasStore) {
        const hash = window.location.hash;
        if (hash === '#create-publication' && isSeller && hasStore) {
            openCreatePublication();
            return;
        }

        if (hash !== '#create-store' && hash !== '#my-store-section') return;

        if (isSeller) {
            const storeNav = document.querySelector('[data-section="my-store"]');
            storeNav?.click();
            if (hasStore && global.StorePanel) {
                global.StorePanel.showView('dashboard');
            }
            return;
        }

        document.querySelectorAll('.dashboard-section').forEach(s => s.classList.add('d-none'));
        document.getElementById('my-store-section')?.classList.remove('d-none');
        document.getElementById('myProductsSimSection')?.classList.add('d-none');
        document.querySelectorAll('.profile-nav .nav-link').forEach(l => l.classList.remove('active'));
    }

    function esc(str) {
        if (str == null) return '';
        const d = document.createElement('div');
        d.textContent = String(str);
        return d.innerHTML;
    }

    global.ProfileRoleAdapter = { apply: applyProfileRoleUI, openCreatePublication };

    document.addEventListener('DOMContentLoaded', () => {
        if (document.body.dataset.profileRoles === 'true') {
            applyProfileRoleUI();
        }
    });

    document.addEventListener('store:created', () => applyProfileRoleUI());
    document.addEventListener('role:selected', () => applyProfileRoleUI());
    document.addEventListener('store:publication-created', () => {
        if (global.StorePanel) global.StorePanel.refresh();
    });
    document.addEventListener('store:publication-deleted', () => {
        if (global.StorePanel) global.StorePanel.refresh();
    });
})(window);
