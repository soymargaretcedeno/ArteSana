class FooterComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
        this.setupEventListeners();
        this.updateI18nTexts();
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                /* Ensure proper display */
                * {
                    box-sizing: border-box !important;
                }

                /* Override any Bootstrap conflicts */
                .footer * {
                    box-sizing: border-box !important;
                }

                .footer-container * {
                    box-sizing: border-box !important;
                }

                /* Ensure proper font loading */
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&display=swap');

                /* Footer Styles */
                :host {
                    display: block;
                    width: 100%;
                    font-family: 'Playfair Display', serif !important;
                }

                .footer {
                    background: linear-gradient(135deg, #962626 0%, #800000 100%);
                    color: #FFFFFF;
                    padding: 60px 0 20px;
                    position: relative;
                    overflow: hidden;
                    width: 100%;
                }

                .decorative-pattern {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 4px;
                    background: linear-gradient(90deg, 
                        #FFD700 0%, #FF7F11 25%, #E63946 50%, #FFD700 75%, #FF7F11 100%);
                    animation: gradient 3s ease infinite;
                }

                @keyframes gradient {
                    0% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                    100% { background-position: 0% 50%; }
                }

                .footer-pattern-bottom {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    height: 3px;
                    background: linear-gradient(90deg, 
                        #FFD700 0%, #FF7F11 25%, #E63946 50%, #FFD700 75%, #FF7F11 100%);
                }

                /* First Row - 4 Columns */
                .footer-main {
                    padding-bottom: 40px;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                    margin-bottom: 30px;
                }

                .footer-main .row {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 30px;
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 0 20px;
                }

                .footer-section {
                    margin-bottom: 30px;
                    position: relative;
                    z-index: 2;
                }

                .footer-section:hover {
                    transform: translateY(-2px);
                    transition: transform 0.3s ease;
                }

                .footer-section h5 {
                    color: #FFD700;
                    font-size: 1.2rem;
                    font-weight: 600;
                    margin-bottom: 20px;
                    position: relative;
                }

                .footer-section h5::after {
                    content: '';
                    position: absolute;
                    bottom: -8px;
                    left: 0;
                    width: 30px;
                    height: 2px;
                    background: #FFD700;
                    border-radius: 1px;
                }

                .footer-brand h3 {
                    color: #FFFFFF;
                    font-size: 2rem;
                    font-weight: 700;
                    margin-bottom: 15px;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    transition: all 0.3s ease;
                }

                .footer-brand h3:hover {
                    transform: scale(1.05);
                    color: #FFD700;
                }

                .footer-brand .logo-img {
                    height: 40px;
                    width: 40px;
                    border-radius: 50%;
                    object-fit: cover;
                    border: 2px solid #FFFFFF;
                    background: #FFFFFF;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
                    transition: all 0.3s ease;
                }

                .footer-brand h3:hover .logo-img {
                    border-color: #FFD700;
                    box-shadow: 0 4px 12px rgba(255, 215, 0, 0.3);
                }

                .footer-feature {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    margin-bottom: 8px;
                    color: #FFFFFF;
                }

                .footer-feature .icon {
                    color: #FFD700;
                    width: 16px;
                    height: 16px;
                    fill: currentColor;
                }

                .social-links {
                    display: flex;
                    gap: 15px;
                    margin-top: 20px;
                }

                .social-link {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    width: 40px;
                    height: 40px;
                    background: rgba(255, 255, 255, 0.1);
                    color: #FFFFFF;
                    border-radius: 50%;
                    text-decoration: none;
                    transition: all 0.3s ease;
                    position: relative;
                    overflow: hidden;
                }

                .social-link::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
                    transition: left 0.5s ease;
                }

                .social-link:hover::before {
                    left: 100%;
                }

                .social-link:hover {
                    background: #FFD700;
                    color: #800000;
                    transform: translateY(-3px);
                    box-shadow: 0 5px 15px rgba(255, 215, 0, 0.3);
                }

                .social-link .icon {
                    width: 18px;
                    height: 18px;
                    fill: currentColor;
                }

                .footer-links {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                }

                .footer-links li {
                    margin-bottom: 12px;
                }

                .footer-links a {
                    color: #FFFFFF;
                    text-decoration: none;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    transition: all 0.3s ease;
                    padding: 5px 0;
                }

                .footer-links a .icon {
                    color: #FFD700;
                    width: 14px;
                    height: 14px;
                    fill: currentColor;
                    transition: transform 0.3s ease;
                }

                .footer-links a:hover {
                    color: #FFD700;
                    transform: translateX(5px);
                }

                .footer-links a:hover .icon {
                    transform: scale(1.2);
                }

                .newsletter-section {
                    text-align: left;
                }

                .newsletter-form .input-group {
                    background: rgba(255, 255, 255, 0.1) !important;
                    border-radius: 25px !important;
                    overflow: hidden !important;
                    border: 1px solid rgba(255, 255, 255, 0.2) !important;
                    display: flex !important;
                    align-items: center !important;
                }

                .newsletter-form .form-control {
                    background: transparent !important;
                    border: none !important;
                    color: #FFFFFF !important;
                    padding: 12px 20px !important;
                    flex: 1 !important;
                    outline: none !important;
                }

                .newsletter-email {
                    background: transparent !important;
                    border: none !important;
                    color: #FFFFFF !important;
                }

                .newsletter-form .form-control::placeholder {
                    color: rgba(255, 255, 255, 0.7) !important;
                }

                .newsletter-form .btn {
                    background: #FFD700 !important;
                    border: none !important;
                    color: #800000 !important;
                    padding: 12px 15px !important;
                    border-radius: 0 25px 25px 0 !important;
                    font-weight: 600 !important;
                    transition: all 0.3s ease !important;
                    cursor: pointer !important;
                    display: flex !important;
                    align-items: center !important;
                    justify-content: center !important;
                }

                .newsletter-form .btn:hover {
                    background: #FF7F11 !important;
                    transform: scale(1.05) !important;
                }

                .newsletter-form .btn .icon {
                    width: 16px !important;
                    height: 16px !important;
                    fill: currentColor !important;
                }

                /* Second Row - Copyright, Policies, Payments */
                .footer-bottom {
                    padding-top: 30px;
                    border-top: 1px solid rgba(255, 255, 255, 0.1);
                    margin-top: 20px;
                }

                .footer-bottom-content {
                    display: grid;
                    grid-template-columns: 1fr auto 1fr;
                    align-items: center;
                    gap: 20px;
                    max-width: 1200px;
                    margin: 0 auto;
                    padding: 0 20px;
                }

                .copyright {
                    color: rgba(255, 255, 255, 0.8);
                    font-size: 0.9rem;
                    text-align: left;
                }

                .footer-policies {
                    display: flex;
                    gap: 20px;
                    align-items: center;
                    justify-content: center;
                    flex-wrap: wrap;
                }

                .policy-link {
                    color: rgba(255, 255, 255, 0.8);
                    text-decoration: none;
                    font-size: 0.9rem;
                    transition: all 0.3s ease;
                    white-space: nowrap;
                }

                .policy-link:hover {
                    color: #FFD700;
                }

                .payment-methods {
                    display: flex;
                    gap: 10px;
                    align-items: center;
                    justify-content: flex-end;
                }

                .payment-method {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    width: 40px;
                    height: 25px;
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 5px;
                    color: #FFFFFF;
                    font-size: 0.8rem;
                    transition: all 0.3s ease;
                    position: relative;
                    overflow: hidden;
                }

                .payment-method::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
                    transition: left 0.5s ease;
                }

                .payment-method:hover::before {
                    left: 100%;
                }

                .payment-method:hover {
                    background: #FFD700;
                    color: #800000;
                    transform: translateY(-2px);
                }

                .payment-method .icon {
                    width: 20px;
                    height: 12px;
                    fill: currentColor;
                }

                /* Responsive Design */
                @media (max-width: 992px) {
                    .footer-main .row {
                        grid-template-columns: repeat(2, 1fr);
                        gap: 25px;
                        padding: 0 15px;
                    }

                    .footer-section {
                        text-align: center;
                    }

                    .footer-section h5::after {
                        left: 50%;
                        transform: translateX(-50%);
                    }

                    .social-links {
                        justify-content: center;
                    }

                    .newsletter-section {
                        text-align: center;
                    }

                    .newsletter-form .input-group {
                        justify-content: center !important;
                        margin: 0 auto !important;
                        max-width: 300px !important;
                    }

                    .footer-bottom-content {
                        grid-template-columns: 1fr;
                        text-align: center;
                        gap: 20px;
                        padding: 0 15px;
                    }

                    .copyright {
                        text-align: center;
                    }

                    .footer-policies {
                        justify-content: center;
                        order: 2;
                    }

                    .payment-methods {
                        justify-content: center;
                        order: 3;
                    }
                }

                @media (max-width: 768px) {
                    .footer {
                        padding: 40px 0 15px;
                    }

                    .footer-main .row {
                        grid-template-columns: 1fr;
                        gap: 30px;
                        padding: 0 20px;
                    }

                    .footer-section {
                        text-align: center;
                        margin-bottom: 25px;
                    }

                    .footer-section h5 {
                        font-size: 1.1rem;
                        margin-bottom: 15px;
                    }

                    .footer-brand h3 {
                        font-size: 1.8rem;
                        justify-content: center;
                    }

                    .footer-feature {
                        justify-content: center;
                    }

                    .social-links {
                        justify-content: center;
                        gap: 12px;
                    }

                    .social-link {
                        width: 35px;
                        height: 35px;
                    }

                    .social-link .icon {
                        width: 16px;
                        height: 16px;
                    }

                    .footer-links {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                    }

                    .footer-links a {
                        justify-content: center;
                        padding: 8px 0;
                    }

                    .newsletter-section {
                        text-align: center;
                    }

                    .newsletter-form .input-group {
                        max-width: 280px !important;
                        margin: 0 auto !important;
                    }

                    .footer-bottom-content {
                        grid-template-columns: 1fr;
                        text-align: center;
                        gap: 15px;
                        padding: 0 20px;
                    }

                    .footer-policies {
                        flex-direction: column;
                        gap: 8px;
                        order: 2;
                    }

                    .policy-link {
                        font-size: 0.85rem;
                    }

                    .payment-methods {
                        justify-content: center;
                        order: 3;
                        gap: 8px;
                    }

                    .payment-method {
                        width: 35px;
                        height: 22px;
                    }
                }

                @media (max-width: 576px) {
                    .footer {
                        padding: 30px 0 10px;
                    }

                    .footer-main .row {
                        gap: 25px;
                        padding: 0 15px;
                    }

                    .footer-section {
                        margin-bottom: 20px;
                    }

                    .footer-section h5 {
                        font-size: 1rem;
                        margin-bottom: 12px;
                    }

                    .footer-brand h3 {
                        font-size: 1.6rem;
                    }

                    .footer-brand .logo-img {
                        height: 35px;
                        width: 35px;
                    }

                    .social-links {
                        gap: 10px;
                    }

                    .social-link {
                        width: 32px;
                        height: 32px;
                    }

                    .social-link .icon {
                        width: 14px;
                        height: 14px;
                    }

                    .footer-links a {
                        font-size: 0.9rem;
                        padding: 6px 0;
                    }

                    .newsletter-form .input-group {
                        max-width: 250px !important;
                    }

                    .newsletter-form .form-control {
                        padding: 10px 15px !important;
                        font-size: 0.9rem !important;
                    }

                    .newsletter-form .btn {
                        padding: 10px 12px !important;
                        font-size: 0.9rem !important;
                    }

                    .footer-bottom-content {
                        gap: 12px;
                        padding: 0 15px;
                    }

                    .copyright {
                        font-size: 0.8rem;
                    }

                    .policy-link {
                        font-size: 0.8rem;
                    }

                    .payment-method {
                        width: 30px;
                        height: 20px;
                    }

                    .payment-method .icon {
                        width: 16px;
                        height: 10px;
                    }
                }

                @media (max-width: 480px) {
                    .footer {
                        padding: 25px 0 8px;
                    }

                    .footer-main .row {
                        gap: 20px;
                        padding: 0 10px;
                    }

                    .footer-section {
                        margin-bottom: 15px;
                    }

                    .footer-brand h3 {
                        font-size: 1.4rem;
                    }

                    .footer-brand .logo-img {
                        height: 30px;
                        width: 30px;
                    }

                    .social-links {
                        gap: 8px;
                    }

                    .social-link {
                        width: 28px;
                        height: 28px;
                    }

                    .social-link .icon {
                        width: 12px;
                        height: 12px;
                    }

                    .newsletter-form .input-group {
                        max-width: 220px !important;
                    }

                    .newsletter-form .form-control {
                        padding: 8px 12px !important;
                        font-size: 0.85rem !important;
                    }

                    .newsletter-form .btn {
                        padding: 8px 10px !important;
                        font-size: 0.85rem !important;
                    }

                    .footer-bottom-content {
                        padding: 0 10px;
                    }

                    .copyright {
                        font-size: 0.75rem;
                    }

                    .policy-link {
                        font-size: 0.75rem;
                    }

                    .payment-method {
                        width: 25px;
                        height: 18px;
                    }

                    .payment-method .icon {
                        width: 14px;
                        height: 8px;
                    }
                }
            </style>

            <!-- Enhanced Footer with 2 Rows -->
            <footer class="footer">
                <div class="decorative-pattern"></div>
                <div class="container">
                    <!-- First Row - 4 Columns -->
                    <div class="footer-main">
                        <div class="row">
                            <!-- Column 1: Brand & Social -->
                            <div class="col-lg-3 col-md-6 mb-4">
                                <div class="footer-section">
                                    <div class="footer-brand">
                                        <h3>
                                            <img src="assets/ArteSana_logo.png" alt="ArteSana" class="logo-img">
                                            <span>ArteSana</span>
                                        </h3>
                                        <p data-i18n="footer_brand_desc">Connecting traditional Panamanian art with the modern world.</p>
                                        <div class="footer-description mt-4">
                                            <div class="footer-feature">
                                                <svg class="icon" viewBox="0 0 24 24">
                                                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                                                </svg>
                                                <span data-i18n="footer_proudly_panama">Proudly made in Panama</span>
                                            </div>
                                            <div class="footer-feature">
                                                <svg class="icon" viewBox="0 0 24 24">
                                                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                                                </svg>
                                                <span data-i18n="footer_authentic_crafts">Authentic crafts</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="social-links mt-4">
                                        <a href="#" class="social-link" data-tooltip="Síguenos en Facebook">
                                            <svg class="icon" viewBox="0 0 24 24">
                                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                                            </svg>
                                        </a>
                                        <a href="#" class="social-link" data-tooltip="Síguenos en Instagram">
                                            <svg class="icon" viewBox="0 0 24 24">
                                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                                            </svg>
                                        </a>
                                        <a href="#" class="social-link" data-tooltip="Síguenos en Pinterest">
                                            <svg class="icon" viewBox="0 0 24 24">
                                                <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z"/>
                                            </svg>
                                        </a>
                                        <a href="#" class="social-link" data-tooltip="Síguenos en Twitter">
                                            <svg class="icon" viewBox="0 0 24 24">
                                                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                                            </svg>
                                        </a>
                                    </div>
                                </div>
                            </div>

                            <!-- Column 2: Quick Links -->
                            <div class="col-lg-3 col-md-6 mb-4">
                                <div class="footer-section">
                                    <h5 data-i18n="footer_quick_links">Quick Links</h5>
                                    <ul class="footer-links">
                                        <li><a href="index.html" data-i18n="footer_home">Home</a></li>
                                        <li><a href="store.html" data-i18n="footer_shop">Shop</a></li>
                                        <li><a href="explorar.html" data-i18n="footer_explore">Explore</a></li>
                                        <li><a href="contact.html" data-i18n="footer_contact">Contact</a></li>
                                    </ul>
                                </div>
                            </div>

                            <!-- Column 3: Categories -->
                            <div class="col-lg-3 col-md-6 mb-4">
                                <div class="footer-section">
                                    <h5 data-i18n="footer_categories">Categories</h5>
                                    <ul class="footer-links">
                                        <li><a href="textiles.html" data-i18n="footer_guna_molas">Guna Molas</a></li>
                                        <li><a href="jewelry.html" data-i18n="footer_polleras">Polleras & Tembleques</a></li>
                                        <li><a href="sculpture.html" data-i18n="footer_devil_masks">Devil Masks</a></li>
                                        <li><a href="ceramics.html" data-i18n="footer_painted_hats">Painted Hats</a></li>
                                    </ul>
                                </div>
                            </div>

                            <!-- Column 4: Newsletter -->
                            <div class="col-lg-3 col-md-6 mb-4">
                                <div class="footer-section newsletter-section">
                                    <h5 data-i18n="footer_newsletter">Newsletter</h5>
                                    <p data-i18n="footer_newsletter_desc">Subscribe to receive news about Panamanian crafts and special offers.</p>
                                    <div class="newsletter-form">
                                        <div class="input-group">
                                            <input type="email" class="form-control newsletter-email" placeholder="Your email address" data-i18n="footer_email_placeholder">
                                            <button class="btn" type="button" data-i18n="footer_subscribe">Subscribe</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Second Row - Copyright, Policies, Payments -->
                    <div class="footer-bottom">
                        <div class="footer-bottom-content">
                            <!-- Copyright -->
                            <div class="copyright">
                                <p data-i18n="footer_rights">&copy; 2024 ArteSana. All rights reserved.</p>
                            </div>

                            <!-- Policies -->
                            <div class="footer-policies">
                                <a href="#" class="policy-link" data-i18n="privacy_policy">Privacy Policy</a>
                                <a href="#" class="policy-link" data-i18n="terms_of_service">Terms of Service</a>
                                <a href="#" class="policy-link" data-i18n="shipping_policy">Shipping Policy</a>
                                <a href="#" class="policy-link" data-i18n="return_policy">Return Policy</a>
                            </div>

                            <!-- Payment Methods -->
                            <div class="payment-methods">
                                <div class="payment-method" title="Visa">
                                    <svg class="icon" viewBox="0 0 24 24">
                                        <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-5 14H4v-4h11v4zm0-5H4V9h11v4zm5 5h-4V9h4v9z"/>
                                    </svg>
                                </div>
                                <div class="payment-method" title="Mastercard">
                                    <svg class="icon" viewBox="0 0 24 24">
                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                                    </svg>
                                </div>
                                <div class="payment-method" title="PayPal">
                                    <svg class="icon" viewBox="0 0 24 24">
                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                                    </svg>
                                </div>
                                <div class="payment-method" title="American Express">
                                    <svg class="icon" viewBox="0 0 24 24">
                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="footer-pattern-bottom"></div>
            </footer>
        `;
        setTimeout(() => {
            const emailInput = this.shadowRoot.querySelector('.newsletter-email');
            if (emailInput && window.translations) {
                const lang = localStorage.getItem('lang') || 'es';
                emailInput.placeholder = window.translations[lang]["footer_email_placeholder"] || emailInput.placeholder;
            }
        }, 0);
    }

    setupEventListeners() {
        // Newsletter subscription
        const newsletterForm = this.shadowRoot.querySelector('.newsletter-form');
        if (newsletterForm) {
            const emailInput = newsletterForm.querySelector('.newsletter-email');
            const submitBtn = newsletterForm.querySelector('.btn');
            
            if (submitBtn) {
                submitBtn.addEventListener('click', () => {
                    this.handleNewsletterSubscription(emailInput.value);
                });
            }
        }

        // Social links tooltips
        const socialLinks = this.shadowRoot.querySelectorAll('.social-link');
        socialLinks.forEach(link => {
            link.addEventListener('mouseenter', (e) => {
                const tooltip = e.target.getAttribute('data-tooltip');
                if (tooltip) {
                    this.showTooltip(e.target, tooltip);
                }
            });
        });
    }

    handleNewsletterSubscription(email) {
        if (email && email.includes('@')) {
            // Here you would typically send the email to your backend
            console.log('Newsletter subscription:', email);
            alert('Thank you for subscribing to our newsletter!');
        } else {
            alert('Please enter a valid email address.');
        }
    }

    showTooltip(element, text) {
        // Create tooltip element
        const tooltip = document.createElement('div');
        tooltip.textContent = text;
        tooltip.style.cssText = `
            position: absolute;
            background: rgba(0,0,0,0.8);
            color: white;
            padding: 5px 10px;
            border-radius: 5px;
            font-size: 12px;
            z-index: 1000;
            pointer-events: none;
        `;
        
        document.body.appendChild(tooltip);
        
        // Position tooltip
        const rect = element.getBoundingClientRect();
        tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
        tooltip.style.top = rect.top - tooltip.offsetHeight - 5 + 'px';
        
        // Remove tooltip after delay
        setTimeout(() => {
            if (tooltip.parentNode) {
                tooltip.parentNode.removeChild(tooltip);
            }
        }, 2000);
    }

    updateI18nTexts() {
        const lang = localStorage.getItem('lang') || 'es';
        this.shadowRoot.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (window.translations[lang] && window.translations[lang][key]) {
                if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                    el.placeholder = window.translations[lang][key];
                } else {
                    el.textContent = window.translations[lang][key];
                }
            }
        });
    }
}

// Register the custom element
customElements.define('footer-component', FooterComponent); 