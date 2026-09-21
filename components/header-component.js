/**
 * Detección de sección activa del navbar — ver también js/nav-active.js
 */
(function (global) {
    'use strict';
    if (global.NavActive) return;
    const SECTION_PAGES = {
        dashboard: ['index.html'],
        artisans: ['store.html', 'tienda.html'],
        explore: ['explorar.html', 'product.html', 'compare.html', 'ceramics.html', 'textiles.html', 'jewelry.html', 'sculpture.html', 'add-product.html'],
        messages: ['mensajes.html'],
        contact: ['contact.html']
    };
    function getCurrentPage() {
        const path = global.location.pathname || '';
        let page = path.substring(path.lastIndexOf('/') + 1);
        return (page || 'index.html').split('?')[0].split('#')[0];
    }
    function getActiveNavSection(page) {
        const current = page || getCurrentPage();
        if (current === 'perfil.html') {
            const hash = (global.location.hash || '').replace('#', '');
            if (hash === 'create-publication') return 'publish';
            if (hash === 'my-store-section' || hash === 'create-store') return 'my-store';
            return 'profile';
        }
        if (current === 'index.html' || current === '') {
            const hash = (global.location.hash || '').replace('#', '');
            if (hash === 'about-section') return 'about';
            if (hash === 'historias') return 'stories';
            if (hash === 'regiones') return 'regions';
        }
        for (const [section, pages] of Object.entries(SECTION_PAGES)) {
            if (pages.includes(current)) return section;
        }
        return null;
    }
    global.NavActive = { SECTION_PAGES, getCurrentPage, getActiveNavSection };
})(window);

const BRAND_HEADER_ICONS = {
    search: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3-3"/></svg>',
    heart: '<svg viewBox="0 0 24 24"><path d="M20.8 5.6a5.4 5.4 0 0 0-7.6 0L12 6.8l-1.2-1.2a5.4 5.4 0 0 0-7.6 7.6l1.2 1.2L12 21l7.6-7.6 1.2-1.2a5.4 5.4 0 0 0 0-7.6z"/></svg>',
    cart: '<svg viewBox="0 0 24 24"><path d="M6 7h15l-1.5 9h-12z"/><path d="M6 7L5 4H2"/><circle cx="9" cy="20" r="1.4"/><circle cx="18" cy="20" r="1.4"/></svg>',
    messages: '<svg viewBox="0 0 24 24"><path d="M21 12a8.5 8.5 0 0 1-8.5 8.5H8l-5 3V12A8.5 8.5 0 0 1 16 4.6"/><path d="M8 10h8M8 14h5"/></svg>'
};

const BRAND_NAV_ITEMS = [
    { href: 'index.html', section: 'dashboard', label: 'Inicio', i18n: 'dashboard' },
    { href: 'store.html', section: 'artisans', label: 'Artesanos', i18n: 'artisans_nav' },
    { href: 'explorar.html', section: 'explore', label: 'Categorías', i18n: 'categories_nav' },
    { href: 'index.html#regiones', section: 'regions', label: 'Regiones', i18n: 'regions_nav' },
    { href: 'index.html#historias', section: 'stories', label: 'Historias', i18n: 'stories_nav' },
    { href: 'index.html#about-section', section: 'about', label: 'Sobre nosotros', i18n: 'about_nav' }
];

const BRAND_NAV_ARTISAN = [
    { href: 'index.html', section: 'dashboard', label: 'Inicio', i18n: 'dashboard' },
    { href: 'perfil.html#my-store-section', section: 'my-store', label: 'Mi tienda', i18n: 'my_store_nav' },
    { href: 'perfil.html#create-publication', section: 'publish', label: 'Publicar', i18n: 'publish_nav' },
    { href: 'explorar.html', section: 'explore', label: 'Explorar', i18n: 'explore_nav' },
    { href: 'store.html', section: 'artisans', label: 'Artesanos', i18n: 'artisans_nav' },
    { href: 'perfil.html', section: 'profile', label: 'Pedidos', i18n: 'orders_nav' }
];

function openArteSanaMessages(event) {
    if (event) {
        event.preventDefault();
        event.stopPropagation();
    }
    const onMessagesPage = /mensajes\.html$/i.test(location.pathname);
    const tryOpen = () => {
        const overlay = document.querySelector('messages-overlay');
        if (overlay && typeof overlay.open === 'function') {
            try {
                overlay.open();
                return true;
            } catch (err) {
                console.warn('ArteSana messages open failed', err);
            }
        }
        return false;
    };
    if (onMessagesPage) {
        if (tryOpen()) return;
        const boot = window.MessagesInit && window.MessagesInit.init
            ? window.MessagesInit.init()
            : Promise.resolve();
        Promise.resolve(boot).then(() => tryOpen());
        return;
    }
    window.location.href = 'mensajes.html';
}
window.openArteSanaMessages = openArteSanaMessages;

function isArtisanUser() {
    const user = window.localDB && window.localDB.getCurrentUser ? window.localDB.getCurrentUser() : null;
    if (!user) return false;
    if (window.RoleService && window.RoleService.getActiveMode) {
        return window.RoleService.getActiveMode(user) === window.RoleService.ROLES.ARTISAN;
    }
    if (user.activeMode === 'customer') return false;
    if (user.activeMode === 'artisan') return true;
    return user.role === 'artisan' || !!user.store;
}

function brandLogoHTML() {
    return `
        <a href="index.html" class="brand-logo" aria-label="ArteSana">
            <img src="assets/artesana-badge-clear.png" alt="" class="brand-logo-mark">
            <span class="brand-logo-name">ArteSana</span>
        </a>`;
}

function brandSearchHTML() {
    return `
        <form class="brand-search" action="explorar.html" method="get">
            <input class="brand-search-input" type="search" name="q" placeholder="Buscar artesanías, artesanos..." data-i18n-placeholder="search_placeholder" data-i18n-aria="search_placeholder" aria-label="Buscar">
            <button class="brand-search-btn" type="submit" data-i18n-aria="search_placeholder" aria-label="Buscar">${BRAND_HEADER_ICONS.search}</button>
        </form>`;
}

function brandThemeToggleHTML() {
    return `
        <button type="button" class="theme-toggle" id="themeToggle" aria-label="Modo claro" data-i18n-aria="theme_light" title="Modo claro">
            <svg class="icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true">
                <circle cx="12" cy="12" r="4"></circle>
                <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"></path>
            </svg>
            <svg class="icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <path d="M21 14.3A8.5 8.5 0 1 1 9.7 3 7 7 0 0 0 21 14.3z"></path>
            </svg>
        </button>`;
}

function brandLangHTML() {
    return `
        <select id="langSelector" class="brand-lang" aria-label="Idioma" data-i18n-aria="change_language">
            <option value="es">ES</option>
            <option value="en">EN</option>
            <optgroup label="Lenguas indígenas" data-i18n="indigenous_group">
                <option value="guna">Guna (Dulegaya)</option>
                <option value="embera">Emberá</option>
                <option value="ngabere">Ngäbere</option>
                <option value="wounaan">Wounaan</option>
                <option value="naso">Naso</option>
            </optgroup>
        </select>`;
}

function bindLangSelector(shadowRoot, afterChange) {
    const langSelector = shadowRoot.getElementById('langSelector');
    if (!langSelector) return;
    const current = window.currentLang ? window.currentLang() : (localStorage.getItem('lang') || 'es');
    langSelector.value = current;
    langSelector.addEventListener('change', (e) => {
        const applied = window.setLanguage(e.target.value, { notify: true });
        if (applied === false) {
            e.target.value = window.currentLang ? window.currentLang() : 'es';
        }
        if (typeof afterChange === 'function') afterChange();
    });
}

function bindThemeToggle(shadowRoot) {
    const btn = shadowRoot.querySelector('.theme-toggle');
    if (!btn) return;
    const theme = localStorage.getItem('theme') === 'dark' ? 'dark' : 'light';
    btn.classList.toggle('is-dark', theme === 'dark');
    btn.addEventListener('click', () => {
        if (window.toggleTheme) window.toggleTheme();
    });
    if (window.updateThemeIcon) window.updateThemeIcon(theme);
}

function brandNavHTML() {
    const items = isArtisanUser() ? BRAND_NAV_ARTISAN : BRAND_NAV_ITEMS;
    const links = items.map(item =>
        `<a href="${item.href}" class="brand-nav-link nav-link" data-nav-section="${item.section}" data-i18n="${item.i18n}">${item.label}</a>`
    ).join('');
    return `<nav class="brand-nav"><div class="brand-nav-inner">${links}</div></nav>`;
}

function brandMobileNavHTML() {
    const items = isArtisanUser() ? BRAND_NAV_ARTISAN : BRAND_NAV_ITEMS;
    const links = items.map(item =>
        `<li class="mobile-menu-item"><a href="${item.href}" class="mobile-menu-link" data-nav-section="${item.section}" data-i18n="${item.i18n}">${item.label}</a></li>`
    ).join('');
    return `<ul class="mobile-menu-list">${links}</ul>`;
}

function syncHeaderFavorites(shadowRoot) {
    if (!shadowRoot) return;
    const count = Array.isArray(window.userProductsDB?.favorites) ? window.userProductsDB.favorites.length : 0;
    const btn = shadowRoot.querySelector('.favorites-btn');
    const badge = shadowRoot.querySelector('.fav-count');
    if (btn) {
        btn.classList.toggle('has-items', count > 0);
        const page = (window.location.pathname.split('/').pop() || '').split('?')[0];
        const params = new URLSearchParams(window.location.search);
        const onFavs = page === 'explorar.html' && (params.has('favoritos') || params.get('view') === 'favorites');
        btn.classList.toggle('is-active', onFavs);
    }
    if (badge) {
        badge.textContent = String(count);
        badge.style.display = count > 0 ? 'flex' : 'none';
    }
}

window.addEventListener('artesana:favorites-changed', () => {
    document.querySelectorAll('header-component, header-user-component').forEach((el) => {
        if (typeof el.updateFavoritesCount === 'function') el.updateFavoritesCount();
    });
});

class HeaderComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.isMobileMenuOpen = false;
    }

    connectedCallback() {
        this.render();
        this.setupEventListeners();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="css/brand-header.css">
            <header class="brand-header">
                <div class="brand-header-top">
                    ${brandLogoHTML()}
                    ${brandSearchHTML()}
                    <div class="brand-prefs">
                        ${brandThemeToggleHTML()}
                        ${brandLangHTML()}
                    </div>
                    <div class="brand-actions">
                        <a class="brand-icon-btn favorites-btn" href="explorar.html?favoritos=1" aria-label="Favoritos" data-i18n-aria="favorites_nav">
                            ${BRAND_HEADER_ICONS.heart}
                            <span class="brand-count fav-count">0</span>
                            <span data-i18n="favorites_nav">Favoritos</span>
                        </a>
                        <a class="brand-icon-btn" href="cart.html" aria-label="Carrito" data-i18n-aria="cart_nav">
                            ${BRAND_HEADER_ICONS.cart}
                            <span class="brand-count cart-count">0</span>
                            <span data-i18n="cart_nav">Carrito</span>
                        </a>
                        <a class="brand-icon-btn messages-btn" href="mensajes.html" aria-label="Mensajes" data-i18n-aria="messages_nav">
                            ${BRAND_HEADER_ICONS.messages}
                            <span class="visually-hidden" data-i18n="messages_nav">Mensajes</span>
                        </a>
                        <button type="button" class="brand-auth-btn auth-btn">
                            <span data-i18n="login_button">Iniciar sesión</span>
                        </button>
                        <button class="mobile-menu-btn" id="mobileMenuBtn" aria-label="Menú">
                            <div class="hamburger-line"></div>
                            <div class="hamburger-line"></div>
                            <div class="hamburger-line"></div>
                        </button>
                    </div>
                </div>
                ${brandNavHTML()}
                <div class="mobile-menu" id="mobileMenu">
                    <div class="mobile-search mobile-only">${brandSearchHTML()}</div>
                    ${brandMobileNavHTML()}
                    <div class="mobile-menu-actions">
                        <a class="mobile-action-btn messages-btn" href="mensajes.html">
                            <span data-i18n="messages_nav">Mensajes</span>
                        </a>
                        <button class="mobile-action-btn" onclick="handleAuth()">
                            <span data-i18n="login_register">Iniciar sesión</span>
                        </button>
                        <button class="mobile-action-btn" id="mobileThemeToggle">
                            <span data-i18n="change_theme">Cambiar tema</span>
                        </button>
                    </div>
                </div>
            </header>
        `;
    }

    setupEventListeners() {
        const mobileThemeToggle = this.shadowRoot.querySelector('#mobileThemeToggle');
        if (mobileThemeToggle) {
            mobileThemeToggle.addEventListener('click', () => this.toggleTheme());
        }

        const mobileMenuBtn = this.shadowRoot.querySelector('#mobileMenuBtn');
        if (mobileMenuBtn) {
            mobileMenuBtn.addEventListener('click', () => this.toggleMobileMenu());
        }

        this.shadowRoot.querySelectorAll('.mobile-menu-link').forEach(link => {
            link.addEventListener('click', () => this.closeMobileMenu());
        });

        const authBtn = this.shadowRoot.querySelector('.auth-btn');
        if (authBtn) {
            authBtn.addEventListener('click', () => this.handleAuth());
        }

        this.shadowRoot.querySelectorAll('.messages-btn, [data-nav-section="messages"]').forEach(btn => {
            btn.addEventListener('click', () => this.closeMobileMenu());
        });

        bindThemeToggle(this.shadowRoot);
        bindLangSelector(this.shadowRoot, () => this.updateI18nTexts());

        this.updateI18nTexts();
        this.updateCartCount();
        this.updateFavoritesCount();
        this.setActiveLink();

        this.shadowRoot.querySelectorAll('.favorites-btn').forEach((btn) => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                window.location.href = 'explorar.html?favoritos=1';
            });
        });
    }

    toggleMobileMenu() {
        this.isMobileMenuOpen = !this.isMobileMenuOpen;
        const mobileMenu = this.shadowRoot.querySelector('#mobileMenu');
        const menuBtn = this.shadowRoot.querySelector('#mobileMenuBtn');

        if (mobileMenu) {
            if (this.isMobileMenuOpen) {
                mobileMenu.style.display = 'block';
                setTimeout(() => mobileMenu.classList.add('active'), 10);
            } else {
                mobileMenu.classList.remove('active');
                setTimeout(() => { mobileMenu.style.display = 'none'; }, 200);
            }
        }

        if (menuBtn) menuBtn.classList.toggle('active');
        document.body.style.overflow = this.isMobileMenuOpen ? 'hidden' : '';
    }

    closeMobileMenu() {
        this.isMobileMenuOpen = false;
        const mobileMenu = this.shadowRoot.querySelector('#mobileMenu');
        const menuBtn = this.shadowRoot.querySelector('#mobileMenuBtn');
        if (mobileMenu) {
            mobileMenu.classList.remove('active');
            mobileMenu.style.display = 'none';
        }
        if (menuBtn) menuBtn.classList.remove('active');
        document.body.style.overflow = '';
    }

    toggleTheme() {
        if (window.toggleTheme) window.toggleTheme();
    }

    updateCartCount() {
        const cartCount = this.shadowRoot.querySelector('.cart-count');
        const mobileCartCount = this.shadowRoot.querySelector('.mobile-cart-count');
        const count = window.productsDB ? window.productsDB.getCartCount() : 0;
        [cartCount, mobileCartCount].forEach(el => {
            if (!el) return;
            el.textContent = count;
            el.style.display = count > 0 ? 'flex' : 'none';
        });
    }

    updateFavoritesCount() {
        syncHeaderFavorites(this.shadowRoot);
    }

    setActiveLink() {
        const activeSection = window.NavActive?.getActiveNavSection();
        const navLinks = this.shadowRoot.querySelectorAll('.nav-link, .mobile-menu-link');
        navLinks.forEach(link => link.classList.remove('active'));
        if (!activeSection) return;
        navLinks.forEach(link => {
            if (link.dataset.navSection === activeSection) link.classList.add('active');
        });
    }

    handleAuth() {
        const authModal = document.querySelector('auth-modal');
        if (authModal && typeof authModal.open === 'function') {
            authModal.open('login');
        }
    }

    updateI18nTexts() {
        const lang = window.currentLang ? window.currentLang() : 'es';
        if (window.applyI18nToRoot) window.applyI18nToRoot(this.shadowRoot, lang);
        const theme = localStorage.getItem('theme') === 'dark' ? 'dark' : 'light';
        if (window.updateThemeIcon) window.updateThemeIcon(theme);
    }
}

customElements.define('header-component', HeaderComponent);

window.toggleMobileMenu = function() {
    const headerComponent = document.querySelector('header-component');
    if (headerComponent) headerComponent.toggleMobileMenu();
};

window.handleAuth = function() {
    const headerComponent = document.querySelector('header-component');
    if (headerComponent) headerComponent.handleAuth();
};

window.toggleLanguage = function() {
    const currentLang = localStorage.getItem('lang') || 'es';
    const newLang = currentLang === 'es' ? 'en' : 'es';
    localStorage.setItem('lang', newLang);
    if (window.setLanguage) window.setLanguage(newLang, { notify: true });
};

window.renderHeader = function() {
    const container = document.querySelector('header-component, header-user-component');
    if (container) container.remove();
    const isLoggedIn = window.localDB && window.localDB.isLoggedIn && window.localDB.isLoggedIn();
    const headerTag = isLoggedIn ? 'header-user-component' : 'header-component';
    const header = document.createElement(headerTag);
    document.body.insertBefore(header, document.body.firstChild);

    setTimeout(() => {
        const headerComponent = document.querySelector('header-component, header-user-component');
        if (headerComponent && headerComponent.updateCartCount) {
            headerComponent.updateCartCount();
        }
        if (headerComponent && headerComponent.updateFavoritesCount) {
            headerComponent.updateFavoritesCount();
        }
    }, 100);
};

document.addEventListener('DOMContentLoaded', function() {
    window.renderHeader();
});
