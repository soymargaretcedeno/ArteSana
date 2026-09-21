class HeaderUserComponent extends HTMLElement {
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
        const user = window.localDB && window.localDB.getCurrentUser ? window.localDB.getCurrentUser() : null;
        const avatar = user && user.avatar ? user.avatar : 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png';
        const name = user && user.name ? user.name.split(' ')[0] : 'User';
        const firstLetter = (name || 'U').charAt(0).toUpperCase();

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
                        <div class="brand-account">
                            <a class="brand-user" href="perfil.html">
                                <img src="${avatar}" alt="${name}">
                                <span class="brand-user-meta">
                                    <span class="brand-user-hello" data-i18n="hello_prefix">Hola,</span>
                                    <span class="brand-user-name">${name}</span>
                                </span>
                            </a>
                            <button type="button" class="brand-logout-btn" id="headerLogoutBtn">
                                <span data-i18n="logout">Cerrar sesión</span>
                            </button>
                        </div>
                        <button class="mobile-menu-btn" id="mobileMenuBtn" aria-label="Menú">
                            <div class="hamburger-line"></div>
                            <div class="hamburger-line"></div>
                            <div class="hamburger-line"></div>
                        </button>
                    </div>
                </div>
                ${brandNavHTML()}
                <div class="mobile-menu" id="mobileMenu">
                    <div class="mobile-user-info">
                        <img src="${avatar}" alt="${name}" class="mobile-user-avatar">
                        <div class="mobile-user-details">
                            <h4 class="mobile-user-name">${name}</h4>
                            <p class="mobile-user-email">${user ? (user.email || '') : ''}</p>
                        </div>
                    </div>
                    <div class="mobile-search mobile-only">${brandSearchHTML()}</div>
                    ${brandMobileNavHTML()}
                    <div class="mobile-menu-actions">
                        <a class="mobile-action-btn messages-btn" href="mensajes.html">
                            <span data-i18n="messages_nav">Mensajes</span>
                        </a>
                        <button class="mobile-action-btn" onclick="window.location.href='perfil.html'">
                            <span data-i18n="my_profile">Mi Perfil</span>
                        </button>
                        <button class="mobile-action-btn" id="mobileThemeToggle">
                            <span data-i18n="change_theme">Cambiar tema</span>
                        </button>
                        <button class="mobile-action-btn" onclick="handleLogout()">
                            <span data-i18n="logout">Cerrar sesión</span>
                        </button>
                    </div>
                </div>
            </header>
        `;
        this._userInitial = firstLetter;
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

        this.shadowRoot.querySelectorAll('.messages-btn, [data-nav-section="messages"]').forEach(btn => {
            btn.addEventListener('click', () => this.closeMobileMenu());
        });

        this.shadowRoot.querySelector('#headerLogoutBtn')?.addEventListener('click', (event) => {
            event.preventDefault();
            window.handleLogout();
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
        const count = window.productsDB ? window.productsDB.getCartCount() : 0;
        if (cartCount) {
            cartCount.textContent = count;
            cartCount.style.display = count > 0 ? 'flex' : 'none';
        }
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

    updateI18nTexts() {
        const lang = window.currentLang ? window.currentLang() : 'es';
        if (window.applyI18nToRoot) window.applyI18nToRoot(this.shadowRoot, lang);
        const theme = localStorage.getItem('theme') === 'dark' ? 'dark' : 'light';
        if (window.updateThemeIcon) window.updateThemeIcon(theme);
    }
}

customElements.define('header-user-component', HeaderUserComponent);

window.handleLogout = async function() {
    if (window.supabaseAuth) {
        await window.supabaseAuth.logout();
    } else if (window.localDB && window.localDB.logout) {
        window.localDB.logout();
    }
    if (window.renderHeader) window.renderHeader();
    window.location.href = 'index.html';
};
