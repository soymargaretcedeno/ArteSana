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
        // Obtener usuario actual
        const user = window.localDB && window.localDB.getCurrentUser ? window.localDB.getCurrentUser() : null;
        const avatar = user && user.avatar ? user.avatar : 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png';
        const name = user && user.name ? user.name : 'User';
        const cartCount = localStorage.getItem('cartCount') || 0;

        this.shadowRoot.innerHTML = `
            <style>
                * { box-sizing: border-box !important; }
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&display=swap');
                
                :host {
                    display: block;
                    position: fixed;
                    top: 0;
                    width: 100%;
                    z-index: 9999;
                    font-family: 'Playfair Display', serif !important;
                }
                
                .header {
                    background: rgba(128, 0, 0, 0.95);
                    backdrop-filter: blur(10px);
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                    width: 100%;
                    position: fixed;
                    top: 0;
                    z-index: 9999;
                }
                
                .header-container {
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 0 20px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    height: 70px;
                }

                /* Logo */
                .logo {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    text-decoration: none;
                    color: #FFFFFF;
                    font-weight: 700;
                    font-size: 1.8rem;
                    transition: all 0.3s ease;
                }

                .logo:hover {
                    transform: scale(1.05);
                    color: #FFD700;
                }

                .logo-img {
                    height: 40px;
                    width: 40px;
                    border-radius: 50%;
                    object-fit: cover;
                    border: 2px solid #FFFFFF;
                    background: #FFFFFF;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
                    transition: all 0.3s ease;
                }

                .logo:hover .logo-img {
                    border-color: #FFD700;
                    box-shadow: 0 4px 12px rgba(255, 215, 0, 0.3);
                }
                
                /* Navigation Menu */
                .nav-menu {
                    display: flex;
                    list-style: none;
                    margin: 0;
                    padding: 0;
                    gap: 40px;
                    align-items: center;
                }
                
                .nav-link {
                    color: #FFFFFF;
                    text-decoration: none;
                    font-weight: 600;
                    font-size: 1.3rem;
                    transition: all 0.3s ease;
                    padding: 10px 0;
                    position: relative;
                }

                .nav-link:hover {
                    color: #FFD700;
                }

                .nav-link::after {
                    content: '';
                    position: absolute;
                    bottom: -2px;
                    left: 0;
                    width: 0;
                    height: 2px;
                    background: #FFD700;
                    transition: width 0.3s ease;
                }

                .nav-link:hover::after {
                    width: 100%;
                }

                /* User Menu */
                .user-menu {
                    display: flex;
                    align-items: center;
                    gap: 20px;
                }

                .user-avatar {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    border: 2px solid #FFFFFF;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .user-avatar:hover {
                    border-color: #FFD700;
                    transform: scale(1.1);
                }

                /* Theme Toggle */
                .theme-toggle {
                    background: none;
                    border: none;
                    color: #FFFFFF;
                    font-size: 1.5rem;
                    cursor: pointer;
                    padding: 12px;
                    border-radius: 50%;
                    transition: all 0.3s ease;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    position: relative;
                    overflow: hidden;
                    width: 50px;
                    height: 50px;
                }

                .theme-toggle:hover {
                    background: rgba(255, 255, 255, 0.1);
                    color: #FFD700;
                    transform: scale(1.1);
                }

                .theme-toggle .icon {
                    width: 28px;
                    height: 28px;
                    fill: currentColor;
                    transition: all 0.3s ease;
                }

                .theme-toggle:hover .icon {
                    transform: rotate(180deg);
                }

                /* Cart Button */
                .cart-btn {
                    background: none;
                    border: none;
                    color: #FFFFFF;
                    font-size: 1.2rem;
                    cursor: pointer;
                    padding: 8px;
                    border-radius: 50%;
                    transition: all 0.3s ease;
                    position: relative;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .cart-btn:hover {
                    background: rgba(255, 255, 255, 0.1);
                    color: #FFD700;
                    transform: scale(1.1);
                }

                .cart-btn .icon {
                    width: 20px;
                    height: 20px;
                    fill: currentColor;
                    transition: all 0.3s ease;
                }

                .cart-btn:hover .icon {
                    transform: scale(1.1);
                }

                .cart-count {
                    position: absolute;
                    top: -5px;
                    right: -5px;
                    background: #FFD700;
                    color: #000;
                    border-radius: 50%;
                    width: 20px;
                    height: 20px;
                    font-size: 0.8rem;
                    font-weight: 700;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border: 2px solid #800000;
                    transition: all 0.3s ease;
                    animation: pulse 2s infinite;
                }

                @keyframes pulse {
                    0% {
                        transform: scale(1);
                    }
                    50% {
                        transform: scale(1.1);
                    }
                    100% {
                        transform: scale(1);
                    }
                }

                /* Logout Button */
                .logout-btn {
                    background: linear-gradient(135deg, #962626 0%, #800000 100%);
                    color: #FFFFFF;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 25px;
                    font-weight: 600;
                    font-size: 0.9rem;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    text-decoration: none;
                    box-shadow: 0 2px 8px rgba(150, 38, 38, 0.3);
                    position: relative;
                    overflow: hidden;
                }

                .logout-btn::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
                    transition: left 0.5s ease;
                }

                .logout-btn:hover::before {
                    left: 100%;
                }

                .logout-btn:hover {
                    background: linear-gradient(135deg, #800000 0%, #600000 100%);
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(150, 38, 38, 0.4);
                }

                .logout-btn .icon {
                    width: 18px;
                    height: 18px;
                    fill: currentColor;
                    transition: all 0.3s ease;
                }

                .logout-btn:hover .icon {
                    transform: scale(1.1);
                }

                /* Mobile Menu Button */
                .mobile-menu-btn {
                    display: none;
                    background: none;
                    border: none;
                    color: #FFFFFF;
                    cursor: pointer;
                    padding: 8px;
                    border-radius: 50%;
                    transition: all 0.3s ease;
                    position: relative;
                    width: 40px;
                    height: 40px;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                }

                .mobile-menu-btn:hover {
                    background: rgba(255, 255, 255, 0.1);
                    color: #FFD700;
                }

                .mobile-menu-btn .hamburger-line {
                    width: 24px;
                    height: 3px;
                    background: currentColor;
                    margin: 2px 0;
                    transition: all 0.3s ease;
                    border-radius: 2px;
                }

                .mobile-menu-btn.active .hamburger-line:nth-child(1) {
                    transform: rotate(45deg) translate(5px, 5px);
                }

                .mobile-menu-btn.active .hamburger-line:nth-child(2) {
                    opacity: 0;
                }

                .mobile-menu-btn.active .hamburger-line:nth-child(3) {
                    transform: rotate(-45deg) translate(7px, -6px);
                }

                /* Mobile Menu */
                .mobile-menu {
                    display: none;
                    position: fixed;
                    top: 70px;
                    left: 0;
                    width: 100%;
                    background: rgba(128, 0, 0, 0.98);
                    backdrop-filter: blur(15px);
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                    padding: 0;
                    transform: translateY(-100%);
                    transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
                    z-index: 9998;
                    max-height: calc(100vh - 70px);
                    overflow-y: auto;
                }

                .mobile-menu.active {
                    transform: translateY(0);
                    display: block;
                }

                .mobile-menu-list {
                    list-style: none;
                    margin: 0;
                    padding: 20px 0;
                    display: flex;
                    flex-direction: column;
                }

                .mobile-menu-item {
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                }

                .mobile-menu-item:last-child {
                    border-bottom: none;
                }

                .mobile-menu-link {
                    color: #FFFFFF;
                    text-decoration: none;
                    font-weight: 500;
                    font-size: 1.2rem;
                    transition: all 0.3s ease;
                    display: block;
                    padding: 20px 30px;
                    position: relative;
                }

                .mobile-menu-link:hover {
                    color: #FFD700;
                    background: rgba(255, 255, 255, 0.05);
                }

                .mobile-menu-link::before {
                    content: '';
                    position: absolute;
                    left: 0;
                    top: 0;
                    width: 4px;
                    height: 100%;
                    background: #FFD700;
                    transform: scaleY(0);
                    transition: transform 0.3s ease;
                }

                .mobile-menu-link:hover::before {
                    transform: scaleY(1);
                }

                /* Mobile Menu Actions */
                .mobile-menu-actions {
                    padding: 20px 30px;
                    border-top: 1px solid rgba(255, 255, 255, 0.1);
                    display: flex;
                    flex-direction: column;
                    gap: 15px;
                }

                .mobile-action-btn {
                    background: rgba(255, 255, 255, 0.1);
                    color: #FFFFFF;
                    border: none;
                    padding: 15px 20px;
                    border-radius: 12px;
                    font-weight: 600;
                    font-size: 1rem;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                }

                .mobile-action-btn:hover {
                    background: rgba(255, 255, 255, 0.2);
                    color: #FFD700;
                    transform: translateY(-2px);
                }

                .mobile-action-btn .icon {
                    width: 20px;
                    height: 20px;
                    fill: currentColor;
                }

                /* User Info in Mobile Menu */
                .mobile-user-info {
                    padding: 20px 30px;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                    display: flex;
                    align-items: center;
                    gap: 15px;
                }

                .mobile-user-avatar {
                    width: 50px;
                    height: 50px;
                    border-radius: 50%;
                    border: 2px solid #FFFFFF;
                }

                .mobile-user-details {
                    flex: 1;
                }

                .mobile-user-name {
                    color: #FFFFFF;
                    font-weight: 600;
                    font-size: 1.1rem;
                    margin: 0;
                }

                .mobile-user-email {
                    color: rgba(255, 255, 255, 0.8);
                    font-size: 0.9rem;
                    margin: 2px 0 0 0;
                }

                /* Responsive Design */
                @media (max-width: 992px) {
                    .nav-menu {
                        display: none !important;
                    }
                    
                    .mobile-menu-btn {
                        display: flex;
                    }

                    /* Ocultar elementos innecesarios en móviles/tabletas */
                    .theme-toggle,
                    .cart-btn,
                    .lang-selector,
                    .logout-btn,
                    .user-avatar {
                        display: none !important;
                    }

                    .header-container {
                        padding: 0 15px;
                    }

                    .logo {
                        font-size: 1.5rem;
                    }

                    .logo-img {
                        height: 35px;
                        width: 35px;
                    }

                    .user-menu {
                        gap: 15px;
                        justify-content: flex-end;
                    }

                    /* Mostrar cart button y language selector en móviles */
                    .mobile-cart-btn {
                        display: flex !important;
                    }

                    .mobile-lang-selector {
                        display: block !important;
                    }
                }

                @media (max-width: 576px) {
                    .header-container {
                        padding: 0 10px;
                    }

                    .logo {
                        font-size: 1.3rem;
                    }

                    .logo-img {
                        height: 30px;
                        width: 30px;
                    }

                    .user-menu {
                        gap: 10px;
                    }

                    .mobile-menu-btn .hamburger-line {
                        width: 20px;
                        height: 2px;
                    }

                    .mobile-menu-link {
                        padding: 18px 25px;
                        font-size: 1.1rem;
                    }

                    .mobile-menu-actions {
                        padding: 15px 25px;
                    }

                    .mobile-user-info {
                        padding: 15px 25px;
                    }
                }

                /* Dark Theme Adjustments */
                [data-theme="dark"] .mobile-menu {
                    background: rgba(34, 34, 34, 0.98);
                    border-bottom: 1px solid rgba(255, 215, 0, 0.2);
                }

                .lang-selector {
                    margin-left: 10px;
                    border-radius: 8px;
                    padding: 4px 10px;
                    font-size: 1rem;
                    background: #fff;
                    color: #800000;
                    border: 1px solid #FFD700;
                    font-family: inherit;
                    cursor: pointer;
                    transition: border 0.2s;
                }
                .lang-selector:focus {
                    outline: none;
                    border: 2px solid #FFD700;
                }

                /* Mobile Language Selector */
                .mobile-lang-selector {
                    display: none;
                    margin-left: 10px;
                    border-radius: 8px;
                    padding: 4px 10px;
                    font-size: 1rem;
                    background: #fff;
                    color: #800000;
                    border: 1px solid #FFD700;
                    font-family: inherit;
                    cursor: pointer;
                    transition: border 0.2s;
                }

                .mobile-lang-selector:focus {
                    outline: none;
                    border: 2px solid #FFD700;
                }

                /* Mobile Cart Button */
                .mobile-cart-btn {
                    display: none;
                    background: none;
                    border: none;
                    color: #FFFFFF;
                    font-size: 1.2rem;
                    cursor: pointer;
                    padding: 8px;
                    border-radius: 50%;
                    transition: all 0.3s ease;
                    position: relative;
                    align-items: center;
                    justify-content: center;
                }

                .mobile-cart-btn:hover {
                    background: rgba(255, 255, 255, 0.1);
                    color: #FFD700;
                    transform: scale(1.1);
                }

                .mobile-cart-btn .icon {
                    width: 20px;
                    height: 20px;
                    fill: currentColor;
                    transition: all 0.3s ease;
                }

                .mobile-cart-btn:hover .icon {
                    transform: scale(1.1);
                }

                .mobile-cart-count {
                    position: absolute;
                    top: -5px;
                    right: -5px;
                    background: #FFD700;
                    color: #000;
                    border-radius: 50%;
                    width: 20px;
                    height: 20px;
                    font-size: 0.8rem;
                    font-weight: 700;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border: 2px solid #800000;
                    transition: all 0.3s ease;
                    animation: pulse 2s infinite;
                }
            </style>

            <header class="header">
                <div class="header-container">
                    <!-- Logo -->
                    <div class="header-left">
                        <a href="index.html" class="logo">
                            <img src="assets/ArteSana_logo.png" alt="ArteSana" class="logo-img">
                            <span>ArteSana</span>
                        </a>
                    </div>

                    <!-- Navigation Menu -->
                    <nav class="nav-menu">
                        <a href="index.html" class="nav-link" data-i18n="dashboard">Inicio</a>
                        <a href="explorar.html" class="nav-link" data-i18n="explore">Explorar</a>
                        <a href="store.html" class="nav-link" data-i18n="store">Tienda</a>
                        <a href="contact.html" class="nav-link" data-i18n="contact">Contacto</a>
                    </nav>

                    <!-- User Menu -->
                    <div class="user-menu">
                        <!-- Theme Toggle -->
                        <button class="theme-toggle" onclick="toggleTheme()">
                            <svg class="icon" viewBox="0 0 24 24">
                                <path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-3.03 0-5.5-2.47-5.5-5.5 0-1.82.89-3.42 2.26-4.4-.44-.06-.9-.1-1.36-.1z"/>
                            </svg>
                        </button>

                        <!-- Cart Button -->
                        <button class="cart-btn" onclick="window.location.href='cart.html'">
                            <svg class="icon" viewBox="0 0 24 24">
                                <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12L8.1 13h7.45c.75 0 1.41-.41 1.75-1.03L21.7 4H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
                            </svg>
                            <span class="cart-count">0</span>
                        </button>

                        <!-- Language Selector -->
                        <select id="langSelector" class="lang-selector">
                            <option value="es">ES</option>
                            <option value="en">EN</option>
                        </select>

                        <!-- User Avatar -->
                        <img src="${avatar}" alt="${name}" class="user-avatar" onclick="window.location.href='perfil.html'">

                        <!-- Logout Button -->
                        <button class="logout-btn" onclick="handleLogout()">
                            <svg class="icon" viewBox="0 0 24 24">
                                <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
                            </svg>
                            <span>Cerrar Sesión</span>
                        </button>

                        <!-- Mobile Language Selector -->
                        <select id="mobileLangSelector" class="mobile-lang-selector">
                            <option value="es">ES</option>
                            <option value="en">EN</option>
                        </select>

                        <!-- Mobile Cart Button -->
                        <button class="mobile-cart-btn" onclick="window.location.href='cart.html'">
                            <svg class="icon" viewBox="0 0 24 24">
                                <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12L8.1 13h7.45c.75 0 1.41-.41 1.75-1.03L21.7 4H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z"/>
                            </svg>
                            <span class="mobile-cart-count">0</span>
                        </button>

                        <!-- Mobile Menu Button -->
                        <button class="mobile-menu-btn" id="mobileMenuBtn">
                            <div class="hamburger-line"></div>
                            <div class="hamburger-line"></div>
                            <div class="hamburger-line"></div>
                        </button>
                    </div>
                </div>

                <!-- Mobile Menu -->
                <div class="mobile-menu" id="mobileMenu">
                    <!-- User Info -->
                    <div class="mobile-user-info">
                        <img src="${avatar}" alt="${name}" class="mobile-user-avatar">
                        <div class="mobile-user-details">
                            <h4 class="mobile-user-name">${name}</h4>
                            <p class="mobile-user-email">${user ? user.email : 'user@example.com'}</p>
                        </div>
                    </div>

                    <!-- Navigation Links -->
                    <ul class="mobile-menu-list">
                        <li class="mobile-menu-item">
                            <a href="index.html" class="mobile-menu-link" data-i18n="dashboard">Inicio</a>
                        </li>
                        <li class="mobile-menu-item">
                            <a href="explorar.html" class="mobile-menu-link" data-i18n="explore">Explorar</a>
                        </li>
                        <li class="mobile-menu-item">
                            <a href="store.html" class="mobile-menu-link" data-i18n="store">Tienda</a>
                        </li>
                        <li class="mobile-menu-item">
                            <a href="contact.html" class="mobile-menu-link" data-i18n="contact">Contacto</a>
                        </li>
                        <li class="mobile-menu-item">
                            <a href="perfil.html" class="mobile-menu-link">Mi Perfil</a>
                        </li>
                    </ul>
                    
                    <!-- Mobile Menu Actions -->
                    <div class="mobile-menu-actions">
                        <button class="mobile-action-btn" onclick="window.location.href='perfil.html'">
                            <svg class="icon" viewBox="0 0 24 24">
                                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                            </svg>
                            <span data-i18n="my_profile">Mi Perfil</span>
                        </button>
                        
                        <button class="mobile-action-btn" onclick="toggleTheme()">
                            <svg class="icon" viewBox="0 0 24 24">
                                <path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-3.03 0-5.5-2.47-5.5-5.5 0-1.82.89-3.42 2.26-4.4-.44-.06-.9-.1-1.36-.1z"/>
                            </svg>
                            <span data-i18n="change_theme">Cambiar Tema</span>
                        </button>

                        <button class="mobile-action-btn" onclick="handleLogout()">
                            <svg class="icon" viewBox="0 0 24 24">
                                <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
                            </svg>
                            <span data-i18n="logout">Cerrar Sesión</span>
                        </button>
                    </div>
                </div>
            </header>
        `;
    }

    setupEventListeners() {
        // Theme toggle functionality
        const themeToggle = this.shadowRoot.querySelector('.theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                this.toggleTheme();
            });
        }

        // Mobile menu functionality
        const mobileMenuBtn = this.shadowRoot.querySelector('#mobileMenuBtn');
        if (mobileMenuBtn) {
            mobileMenuBtn.addEventListener('click', () => {
                this.toggleMobileMenu();
            });
        }

        // Close mobile menu when clicking on links
        const mobileMenuLinks = this.shadowRoot.querySelectorAll('.mobile-menu-link');
        mobileMenuLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.closeMobileMenu();
            });
        });



        // Selector de idioma
        const langSelector = this.shadowRoot.getElementById('langSelector');
        if (langSelector) {
            langSelector.value = localStorage.getItem('lang') || 'es';
            langSelector.addEventListener('change', (e) => {
                window.setLanguage(e.target.value);
                // Actualizar los textos dentro del shadow DOM
                this.updateI18nTexts();
            });
        }

        // Mobile Language Selector
        const mobileLangSelector = this.shadowRoot.getElementById('mobileLangSelector');
        if (mobileLangSelector) {
            mobileLangSelector.value = localStorage.getItem('lang') || 'es';
            mobileLangSelector.addEventListener('change', (e) => {
                window.setLanguage(e.target.value);
                // Actualizar los textos dentro del shadow DOM
                this.updateI18nTexts();
            });
        }

        // Actualizar textos al cargar
        this.updateI18nTexts();

        // Update cart count
        this.updateCartCount();

        // Set active link
        this.setActiveLink();
    }

    toggleMobileMenu() {
        this.isMobileMenuOpen = !this.isMobileMenuOpen;
        const mobileMenu = this.shadowRoot.querySelector('#mobileMenu');
        const menuBtn = this.shadowRoot.querySelector('#mobileMenuBtn');
        
        if (mobileMenu) {
            if (this.isMobileMenuOpen) {
                mobileMenu.style.display = 'block';
                setTimeout(() => {
                    mobileMenu.classList.add('active');
                }, 10);
            } else {
                mobileMenu.classList.remove('active');
                setTimeout(() => {
                    mobileMenu.style.display = 'none';
                }, 400);
            }
        }
        
        if (menuBtn) {
            menuBtn.classList.toggle('active');
        }

        // Prevent body scroll when menu is open
        document.body.style.overflow = this.isMobileMenuOpen ? 'hidden' : '';
    }

    closeMobileMenu() {
        this.isMobileMenuOpen = false;
        const mobileMenu = this.shadowRoot.querySelector('#mobileMenu');
        const menuBtn = this.shadowRoot.querySelector('#mobileMenuBtn');
        
        if (mobileMenu) {
            mobileMenu.classList.remove('active');
            setTimeout(() => {
                mobileMenu.style.display = 'none';
            }, 400);
        }
        
        if (menuBtn) {
            menuBtn.classList.remove('active');
        }

        document.body.style.overflow = '';
    }

    toggleTheme() {
        const html = document.documentElement;
        const currentTheme = html.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        // Smooth transition
        html.style.transition = 'all 0.3s ease';
        html.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Update theme toggle icon with animation
        const themeToggle = this.shadowRoot.querySelector('.theme-toggle .icon');
        if (themeToggle) {
            // Add rotation animation
            themeToggle.style.transform = 'rotate(180deg)';
            setTimeout(() => {
                // Change the SVG path for sun/moon
                const path = themeToggle.querySelector('path');
                if (path) {
                    if (newTheme === 'dark') {
                        // Sun icon
                        path.setAttribute('d', 'M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0 .39-.39.39-1.03 0-1.41l-1.06-1.06zm1.06-10.96c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.36c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06z');
                    } else {
                        // Moon icon
                        path.setAttribute('d', 'M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-3.03 0-5.5-2.47-5.5-5.5 0-1.82.89-3.42 2.26-4.4-.44-.06-.9-.1-1.36-.1z');
                    }
                }
                themeToggle.style.transform = 'rotate(0deg)';
            }, 150);
        }

        // Remove transition after animation
        setTimeout(() => {
            html.style.transition = '';
        }, 300);
    }

    updateCartCount() {
        const cartCount = this.shadowRoot.querySelector('.cart-count');
        const mobileCartCount = this.shadowRoot.querySelector('.mobile-cart-count');
        if (cartCount || mobileCartCount) {
            // Get cart count from products database
            const count = window.productsDB ? window.productsDB.getCartCount() : 0;
            
            // Update desktop cart count
            if (cartCount) {
                // Add animation if count changes
                if (cartCount.textContent !== count.toString()) {
                    cartCount.style.transform = 'scale(1.3)';
                    setTimeout(() => {
                        cartCount.textContent = count;
                        cartCount.style.transform = 'scale(1)';
                        cartCount.style.display = count > 0 ? 'inline' : 'none';
                    }, 150);
                } else {
                    cartCount.textContent = count;
                    cartCount.style.display = count > 0 ? 'inline' : 'none';
                }
            }
            
            // Update mobile cart count
            if (mobileCartCount) {
                mobileCartCount.textContent = count;
                mobileCartCount.style.display = count > 0 ? 'inline' : 'none';
            }
        }
    }



    setActiveLink() {
        const currentPath = window.location.pathname;
        const navLinks = this.shadowRoot.querySelectorAll('.nav-link');
        const mobileLinks = this.shadowRoot.querySelectorAll('.mobile-menu-link');
        
        // Remove active class from all links
        [...navLinks, ...mobileLinks].forEach(link => {
            link.classList.remove('active');
        });

        // Add active class to current page link
        [...navLinks, ...mobileLinks].forEach(link => {
            if (link.getAttribute('href') === currentPath.split('/').pop() || 
                (currentPath.endsWith('/') && link.getAttribute('href') === 'index.html')) {
                link.classList.add('active');
            }
        });
    }

    updateI18nTexts() {
        const lang = localStorage.getItem('lang') || 'es';
        this.shadowRoot.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (window.translations[lang] && window.translations[lang][key]) {
                el.textContent = window.translations[lang][key];
            }
        });
    }
}

// Register the component
customElements.define('header-user-component', HeaderUserComponent);

// Global functions for onclick handlers
window.toggleTheme = function() {
    const headerComponent = document.querySelector('header-user-component');
    if (headerComponent) {
        headerComponent.toggleTheme();
    }
};

window.handleLogout = function() {
    if (window.localDB && window.localDB.logout) {
        window.localDB.logout();
        if (window.renderHeader) window.renderHeader();
        window.location.href = 'index.html';
    }
};

window.toggleLanguage = function(event) {
    const currentLang = localStorage.getItem('lang') || 'es';
    const newLang = currentLang === 'es' ? 'en' : 'es';
    
    // Guardar el nuevo idioma en localStorage
    localStorage.setItem('lang', newLang);
    
    // Aplicar el cambio de idioma
    if (window.setLanguage) {
        window.setLanguage(newLang);
    }
}; 