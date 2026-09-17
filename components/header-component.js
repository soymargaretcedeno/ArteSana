/**
 * Detección de sección activa del navbar — ver también js/nav-active.js
 */
(function (global) {
    'use strict';
    if (global.NavActive) return;
    const SECTION_PAGES = {
        dashboard: ['index.html'],
        explore: ['explorar.html', 'product.html', 'compare.html', 'ceramics.html', 'textiles.html', 'jewelry.html', 'sculpture.html', 'add-product.html'],
        store: ['store.html', 'tienda.html'],
        contact: ['contact.html']
    };
    function getCurrentPage() {
        const path = global.location.pathname || '';
        let page = path.substring(path.lastIndexOf('/') + 1);
        return (page || 'index.html').split('?')[0].split('#')[0];
    }
    function getActiveNavSection(page) {
        const current = page || getCurrentPage();
        for (const [section, pages] of Object.entries(SECTION_PAGES)) {
            if (pages.includes(current)) return section;
        }
        return null;
    }
    global.NavActive = { SECTION_PAGES, getCurrentPage, getActiveNavSection };
})(window);

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
            <style>
                /* Ensure proper display */
                * {
                    box-sizing: border-box !important;
                }

                /* Override any Bootstrap conflicts */
                .header * {
                    box-sizing: border-box !important;
                }

                .header-container * {
                    box-sizing: border-box !important;
                }

                /* Ensure proper font loading */
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&display=swap');

                /* Modern Header Styles */
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
                    padding: 0;
                    position: fixed;
                    width: 100%;
                    top: 0;
                    z-index: 9999;
                    transition: all 0.3s ease;
                }

                [data-theme="dark"] .header {
                    background: rgba(34, 34, 34, 0.95);
                    border-bottom: 1px solid rgba(255, 215, 0, 0.2);
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

                /* Left Column - Logo */
                .header-left {
                    display: flex;
                    align-items: center;
                    flex: 1;
                }

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

                /* Center Column - Navigation */
                .header-center {
                    display: flex !important;
                    align-items: center;
                    justify-content: center;
                    flex: 2;
                    width: 100%;
                }

                .nav-menu {
                    display: flex !important;
                    list-style: none;
                    margin: 0;
                    padding: 0;
                    gap: 40px;
                    width: 100%;
                    justify-content: center;
                    flex-wrap: nowrap;
                }
                
                .nav-item {
                    white-space: nowrap;
                }

                .nav-item {
                    position: relative;
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

                .nav-link.active {
                    color: #FFD700;
                }

                .nav-link.active::after {
                    width: 100%;
                }

                /* Right Column - Actions */
                .header-right {
                    display: flex;
                    align-items: center;
                    gap: 20px;
                    flex: 1;
                    justify-content: flex-end;
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

                /* Login/Register Button */
                .auth-btn {
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

                .auth-btn::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
                    transition: left 0.5s ease;
                }

                .auth-btn:hover::before {
                    left: 100%;
                }

                .auth-btn:hover {
                    background: linear-gradient(135deg, #800000 0%, #600000 100%);
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(150, 38, 38, 0.4);
                }

                .auth-btn .icon {
                    width: 18px;
                    height: 18px;
                    fill: currentColor;
                    transition: all 0.3s ease;
                }

                .auth-btn:hover .icon {
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

                .mobile-menu-link.active {
                    color: #FFD700;
                    background: rgba(255, 255, 255, 0.05);
                }

                .mobile-menu-link.active::before {
                    transform: scaleY(1);
                }
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

                /* Responsive Design */
                @media (max-width: 992px) {
                    .header-center {
                        display: none !important;
                    }
                    
                    .mobile-menu-btn {
                        display: flex;
                    }

                    /* Ocultar elementos innecesarios en móviles/tabletas */
                    .theme-toggle,
                    .cart-btn,
                    .lang-selector,
                    .auth-btn {
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

                    .header-right {
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

                    .header-right {
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
                }

                /* Dark Theme Adjustments */
                [data-theme="dark"] .mobile-menu {
                    background: rgba(34, 34, 34, 0.98);
                    border-bottom: 1px solid rgba(255, 215, 0, 0.2);
                }

                [data-theme="dark"] .mobile-menu-link {
                    color: var(--text-color);
                }

                [data-theme="dark"] .mobile-menu-link:hover {
                    color: var(--accent-color);
                    background: rgba(255, 215, 0, 0.1);
                }

                [data-theme="dark"] .mobile-action-btn {
                    background: rgba(255, 215, 0, 0.1);
                    color: var(--text-color);
                }

                [data-theme="dark"] .mobile-action-btn:hover {
                    background: rgba(255, 215, 0, 0.2);
                    color: var(--accent-color);
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

            <!-- Header Structure -->
            <header class="header">
                <div class="header-container">
                    <!-- Left Column - Logo -->
                    <div class="header-left">
                        <a href="index.html" class="logo">
                            <img src="assets/ArteSana_logo.png" alt="ArteSana" class="logo-img">
                            <span>ArteSana</span>
                        </a>
                    </div>

                    <!-- Center Column - Navigation -->
                    <div class="header-center">
                        <nav style="width: 100%;">
                            <ul class="nav-menu">
                                <li class="nav-item">
                                    <a href="index.html" class="nav-link" data-nav-section="dashboard" data-i18n="dashboard">Inicio</a>
                                </li>
                                <li class="nav-item">
                                    <a href="explorar.html" class="nav-link" data-nav-section="explore" data-i18n="explore">Explorar</a>
                                </li>
                                <li class="nav-item">
                                    <a href="store.html" class="nav-link" data-nav-section="store" data-i18n="store">Tienda</a>
                                </li>
                                <li class="nav-item">
                                    <a href="contact.html" class="nav-link" data-nav-section="contact" data-i18n="contact">Contacto</a>
                                </li>
                            </ul>
                        </nav>
                    </div>
                    <!-- Right Column - Actions -->
                    <div class="header-right">
                        <!-- Theme Toggle -->
                        <button class="theme-toggle">
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

                        <!-- Login/Register Button -->
                        <button class="auth-btn" onclick="handleAuth()">
                            <svg class="icon" viewBox="0 0 24 24">
                                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                            </svg>
                            <span data-i18n="login_register">Login / Register</span>
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
                    <ul class="mobile-menu-list">
                        <li class="mobile-menu-item">
                            <a href="index.html" class="mobile-menu-link" data-nav-section="dashboard" data-i18n="dashboard">Inicio</a>
                        </li>
                        <li class="mobile-menu-item">
                            <a href="explorar.html" class="mobile-menu-link" data-nav-section="explore" data-i18n="explore">Explorar</a>
                        </li>
                        <li class="mobile-menu-item">
                            <a href="store.html" class="mobile-menu-link" data-nav-section="store" data-i18n="store">Tienda</a>
                        </li>
                        <li class="mobile-menu-item">
                            <a href="contact.html" class="mobile-menu-link" data-nav-section="contact" data-i18n="contact">Contacto</a>
                        </li>
                    </ul>
                    
                    <!-- Mobile Menu Actions -->
                    <div class="mobile-menu-actions">
                        <button class="mobile-action-btn" onclick="handleAuth()">
                            <svg class="icon" viewBox="0 0 24 24">
                                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                            </svg>
                            <span data-i18n="login_register">Login / Register</span>
                        </button>
                        
                        <button class="mobile-action-btn" id="mobileThemeToggle">
                            <svg class="icon" viewBox="0 0 24 24">
                                <path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-3.03 0-5.5-2.47-5.5-5.5 0-1.82.89-3.42 2.26-4.4-.44-.06-.9-.1-1.36-.1z"/>
                            </svg>
                            <span data-i18n="change_theme">Cambiar Tema</span>
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

        // Mobile theme toggle functionality
        const mobileThemeToggle = this.shadowRoot.querySelector('#mobileThemeToggle');
        if (mobileThemeToggle) {
            mobileThemeToggle.addEventListener('click', () => {
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

        // Auth button functionality
        const authBtn = this.shadowRoot.querySelector('.auth-btn');
        if (authBtn) {
            authBtn.addEventListener('click', () => {
                this.handleAuth();
            });
        }



        // Selector de idioma
        const langSelector = this.shadowRoot.getElementById('langSelector');
        if (langSelector) {
            langSelector.value = localStorage.getItem('lang') || 'es';
            langSelector.addEventListener('change', (e) => {
                window.setLanguage(e.target.value, { notify: true });
                // Actualizar los textos dentro del shadow DOM
                this.updateI18nTexts();
            });
        }

        // Mobile Language Selector
        const mobileLangSelector = this.shadowRoot.getElementById('mobileLangSelector');
        if (mobileLangSelector) {
            mobileLangSelector.value = localStorage.getItem('lang') || 'es';
            mobileLangSelector.addEventListener('change', (e) => {
                window.setLanguage(e.target.value, { notify: true });
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
        // Call the global toggleTheme function
        if (window.toggleTheme) {
            window.toggleTheme();
        }
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
        const activeSection = window.NavActive?.getActiveNavSection();
        const navLinks = this.shadowRoot.querySelectorAll('.nav-link, .mobile-menu-link');

        navLinks.forEach(link => link.classList.remove('active'));

        if (!activeSection) return;

        navLinks.forEach(link => {
            if (link.dataset.navSection === activeSection) {
                link.classList.add('active');
            }
        });
    }

    handleAuth() {
        const authModal = document.querySelector('auth-modal');
        if (authModal && typeof authModal.open === 'function') {
            authModal.open('login');
        }
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
customElements.define('header-component', HeaderComponent);

// Global functions for onclick handlers
// Note: toggleTheme is already defined in theme.js, so we don't redefine it here

window.toggleMobileMenu = function() {
    const headerComponent = document.querySelector('header-component');
    if (headerComponent) {
        headerComponent.toggleMobileMenu();
    }
};

window.handleAuth = function() {
    const headerComponent = document.querySelector('header-component');
    if (headerComponent) {
        headerComponent.handleAuth();
    }
}; 

window.toggleLanguage = function(event) {
    const currentLang = localStorage.getItem('lang') || 'es';
    const newLang = currentLang === 'es' ? 'en' : 'es';
    
    // Guardar el nuevo idioma en localStorage
    localStorage.setItem('lang', newLang);
    
    // Aplicar el cambio de idioma
    if (window.setLanguage) {
        window.setLanguage(newLang, { notify: true });
    }
};

window.renderHeader = function() {
    const container = document.querySelector('header-component, header-user-component');
    if (container) container.remove();
    const isLoggedIn = window.localDB && window.localDB.isLoggedIn && window.localDB.isLoggedIn();
    const headerTag = isLoggedIn ? 'header-user-component' : 'header-component';
    const header = document.createElement(headerTag);
    document.body.insertBefore(header, document.body.firstChild);
    
    // Update cart count after header is rendered
    setTimeout(() => {
        if (window.productsDB) {
            const headerComponent = document.querySelector('header-component, header-user-component');
            if (headerComponent && headerComponent.updateCartCount) {
                headerComponent.updateCartCount();
            }
        }
    }, 100);
};

document.addEventListener('DOMContentLoaded', function() {
    window.renderHeader();
}); 