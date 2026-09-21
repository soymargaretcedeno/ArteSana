class AuthModal extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.currentForm = 'login';
        this.pendingLogin = null;
        this.selectedRole = 'customer';
        this.init();
    }

    init() {
        this.render();
        this.attachEventListeners();
        // Listen for language changes
        window.addEventListener('languageChanged', this._onLanguageChange);
        window.addEventListener('storage', this._onLanguageChange);
    }

    _onLanguageChange = () => {
        this.render();
        this.attachEventListeners();
    };

    render() {
        const lang = localStorage.getItem('lang') || 'es';
        const t = (key) => window.translations && window.translations[lang] && window.translations[lang][key] ? window.translations[lang][key] : key;
        
        this.shadowRoot.innerHTML = `
            <style>
                /* Modal Backdrop */
                .auth-modal-backdrop {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.6);
                    backdrop-filter: blur(8px);
                    display: none;
                    align-items: center;
                    justify-content: center;
                    z-index: 9999;
                    opacity: 0;
                    transition: opacity 0.3s ease;
                    padding: 20px;
                }

                .auth-modal-backdrop.show {
                    opacity: 1;
                }

                /* Modal Content */
                .auth-modal-content {
                    background: #ffffff;
                    border-radius: 24px;
                    width: 100%;
                    max-width: 450px;
                    height: auto;
                    position: relative;
                    transform: scale(0.8) translateY(20px);
                    transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1);
                    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
                    overflow: visible;
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    max-height: 90vh;
                    overflow-y: auto;
                }

                .auth-modal-backdrop.show .auth-modal-content {
                    transform: scale(1) translateY(0);
                }

                /* Close Button */
                .auth-modal-close {
                    position: absolute;
                    top: 20px;
                    right: 20px;
                    width: 40px;
                    height: 40px;
                    border: none;
                    background: rgba(255, 255, 255, 0.9);
                    border-radius: 50%;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.3s ease;
                    z-index: 10;
                    backdrop-filter: blur(10px);
                }

                .auth-modal-close:hover {
                    background: rgba(255, 255, 255, 1);
                    transform: scale(1.1);
                    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
                }

                .auth-modal-close svg {
                    width: 20px;
                    height: 20px;
                    fill: #333;
                }

                /* Header */
                .auth-modal-header {
                    text-align: center;
                    padding: 25px 40px 20px 40px;
                    background: linear-gradient(135deg, #8B5E3C 0%, #6B4423 100%);
                    color: white;
                    position: relative;
                    overflow: hidden;
                    border-radius: 24px 24px 0 0;
                }

                .auth-modal-header::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="75" cy="75" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="50" cy="10" r="0.5" fill="rgba(255,255,255,0.05)"/><circle cx="10" cy="60" r="0.5" fill="rgba(255,255,255,0.05)"/><circle cx="90" cy="40" r="0.5" fill="rgba(255,255,255,0.05)"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
                    opacity: 0.3;
                }

                .auth-modal-header h3 {
                    color: #ffffff;
                    font-size: 1.6rem;
                    font-weight: 700;
                    margin-bottom: 4px;
                    position: relative;
                    z-index: 1;
                    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
                }

                .auth-modal-header p {
                    color: rgba(255, 255, 255, 0.95);
                    font-size: 1rem;
                    position: relative;
                    z-index: 1;
                    font-weight: 400;
                    margin: 0;
                }

                /* Form Container */
                .auth-form {
                    padding: 20px 40px 25px 40px;
                    background: #ffffff;
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                    height: auto;
                    overflow: visible;
                    border-radius: 0 0 24px 24px;
                }

                .auth-form.hidden {
                    display: none;
                }

                /* Form Groups */
                .auth-form-group {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }

                .auth-form-group label {
                    font-weight: 600;
                    color: #333;
                    font-size: 0.95rem;
                    margin-bottom: 2px;
                }

                .auth-form-group input {
                    padding: 14px 16px;
                    border: 2px solid #e8e8e8;
                    border-radius: 12px;
                    font-size: 1rem;
                    transition: all 0.3s ease;
                    background: #ffffff;
                    width: 100%;
                    box-sizing: border-box;
                }

                .auth-form-group input:focus {
                    outline: none;
                    border-color: #8F1111;
                    box-shadow: 0 0 0 3px rgba(150, 38, 38, 0.1);
                }

                .auth-form-group input::placeholder {
                    color: #999;
                }

                .auth-role-picker {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                    margin-bottom: 4px;
                }

                .auth-role-label {
                    margin: 0;
                    font-weight: 600;
                    color: #5C3A21;
                    font-size: 0.9rem;
                }

                .auth-role-options {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 10px;
                }

                .auth-role-card {
                    border: 2px solid #eadfce;
                    background: #F6EFE3;
                    border-radius: 14px;
                    padding: 12px 10px;
                    cursor: pointer;
                    text-align: left;
                    font-family: inherit;
                    transition: border-color 0.2s ease, background 0.2s ease, transform 0.2s ease;
                }

                .auth-role-card strong {
                    display: block;
                    color: #5C3A21;
                    font-size: 0.95rem;
                }

                .auth-role-card span {
                    display: block;
                    color: #8B5E3C;
                    font-size: 0.75rem;
                    margin-top: 2px;
                }

                .auth-role-card.selected {
                    border-color: #8B5E3C;
                    background: #fff;
                    box-shadow: 0 0 0 3px rgba(139, 94, 60, 0.12);
                }

                .auth-role-card:hover {
                    transform: translateY(-1px);
                    border-color: #8B5E3C;
                }

                /* Submit Button */
                .auth-submit-btn {
                    background: linear-gradient(135deg, #8B5E3C 0%, #6B4423 100%);
                    color: white;
                    border: none;
                    padding: 16px 24px;
                    border-radius: 12px;
                    font-size: 1.1rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    margin-top: 8px;
                    position: relative;
                    overflow: hidden;
                    width: 100%;
                }

                .auth-submit-btn::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: -100%;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
                    transition: left 0.5s ease;
                }

                .auth-submit-btn:hover::before {
                    left: 100%;
                }

                .auth-submit-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 25px rgba(150, 38, 38, 0.3);
                }

                /* Links */
                .auth-links {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-top: 8px;
                    flex-wrap: wrap;
                    gap: 10px;
                }

                .auth-link {
                    color: #8F1111;
                    text-decoration: none;
                    font-weight: 600;
                    font-size: 0.95rem;
                    transition: all 0.3s ease;
                    padding: 8px 12px;
                    border-radius: 8px;
                    margin: 0 4px;
                }

                .auth-link:hover {
                    background: rgba(150, 38, 38, 0.1);
                    color: #8F1111;
                }

                /* Switch Section */
                .auth-switch {
                    text-align: center;
                    margin-top: 16px;
                    padding-top: 16px;
                    border-top: 1px solid #f0f0f0;
                }

                .auth-switch p {
                    color: #666;
                    font-size: 0.95rem;
                    margin-bottom: 12px;
                }

                .auth-switch-btn {
                    background: transparent;
                    color: #8F1111;
                    border: 2px solid #8F1111;
                    padding: 12px 24px;
                    border-radius: 12px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    font-size: 1rem;
                }

                .auth-switch-btn:hover {
                    background: #8F1111;
                    color: white;
                    transform: translateY(-2px);
                    box-shadow: 0 6px 20px rgba(150, 38, 38, 0.3);
                }

                /* Back to Login */
                .back-to-login {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    color: #8F1111;
                    cursor: pointer;
                    font-weight: 600;
                    font-size: 0.95rem;
                    padding: 8px 12px;
                    border-radius: 8px;
                    transition: all 0.3s ease;
                    margin-bottom: 16px;
                }

                .back-to-login:hover {
                    background: rgba(150, 38, 38, 0.1);
                }

                .back-to-login .icon {
                    width: 18px;
                    height: 18px;
                    fill: #8F1111;
                }

                /* Message System */
                .auth-message {
                    padding: 12px 16px;
                    border-radius: 8px;
                    margin-bottom: 16px;
                    font-weight: 500;
                    text-align: center;
                    opacity: 0;
                    transform: translateY(-10px);
                    transition: all 0.3s ease;
                }

                .auth-message.show {
                    opacity: 1;
                    transform: translateY(0);
                }

                .auth-message.success {
                    background: rgba(76, 175, 80, 0.1);
                    color: #2e7d32;
                    border: 1px solid rgba(76, 175, 80, 0.3);
                }

                .auth-message.error {
                    background: rgba(244, 67, 54, 0.1);
                    color: #c62828;
                    border: 1px solid rgba(244, 67, 54, 0.3);
                }

                /* Responsive Design */
                @media (max-width: 768px) {
                    .auth-modal-backdrop {
                        padding: 15px;
                        align-items: flex-start;
                        padding-top: 50px;
                    }

                    .auth-modal-content {
                        width: 100%;
                        max-width: 100%;
                        max-height: calc(100vh - 100px);
                        margin: 0;
                    }
                    
                    .auth-modal-header {
                        padding: 20px 25px 15px 25px;
                    }
                    
                    .auth-modal-header h3 {
                        font-size: 1.4rem;
                    }
                    
                    .auth-form {
                        padding: 15px 25px 20px 25px;
                        gap: 14px;
                    }

                    .auth-modal-close {
                        top: 15px;
                        right: 15px;
                        width: 35px;
                        height: 35px;
                    }

                    .auth-modal-close svg {
                        width: 18px;
                        height: 18px;
                    }
                    
                    .auth-links {
                        flex-direction: column;
                        gap: 10px;
                        align-items: center;
                    }

                    .auth-link {
                        min-width: 140px;
                        text-align: center;
                    }
                }

                @media (max-width: 576px) {
                    .auth-modal-backdrop {
                        padding: 10px;
                        padding-top: 30px;
                    }

                    .auth-modal-content {
                        max-height: calc(100vh - 60px);
                    }
                    
                    .auth-modal-header {
                        padding: 15px 20px 10px 20px;
                    }
                    
                    .auth-modal-header h3 {
                        font-size: 1.3rem;
                    }
                    
                    .auth-form {
                        padding: 12px 20px 15px 20px;
                        gap: 12px;
                    }

                    .auth-modal-close {
                        top: 10px;
                        right: 10px;
                        width: 30px;
                        height: 30px;
                    }

                    .auth-modal-close svg {
                        width: 16px;
                        height: 16px;
                    }
                    
                    .auth-link {
                        min-width: 120px;
                        padding: 10px 16px;
                        font-size: 0.9rem;
                    }

                    .auth-submit-btn {
                        padding: 14px 20px;
                        font-size: 1rem;
                    }

                    .auth-switch-btn {
                        padding: 10px 20px;
                        font-size: 0.95rem;
                    }
                }

                @media (max-width: 480px) {
                    .auth-modal-backdrop {
                        padding: 5px;
                        padding-top: 20px;
                    }

                    .auth-modal-content {
                        max-height: calc(100vh - 40px);
                    }

                    .auth-modal-header {
                        padding: 12px 15px 8px 15px;
                    }

                    .auth-modal-header h3 {
                        font-size: 1.2rem;
                    }

                    .auth-form {
                        padding: 10px 15px 12px 15px;
                        gap: 10px;
                    }

                    .auth-form-group input {
                        padding: 12px 14px;
                        font-size: 0.95rem;
                    }

                    .auth-submit-btn {
                        padding: 12px 18px;
                        font-size: 0.95rem;
                    }
                }

                /* Dark Theme Support */
                [data-theme="dark"] .auth-modal-content {
                    background: #2a2a2a;
                    color: #ffffff;
                }

                [data-theme="dark"] .auth-form-group label {
                    color: #ffffff;
                }

                [data-theme="dark"] .auth-form-group input {
                    background: #3a3a3a;
                    border-color: #555;
                    color: #ffffff;
                }

                [data-theme="dark"] .auth-form-group input::placeholder {
                    color: #aaa;
                }

                [data-theme="dark"] .auth-switch p {
                    color: #ccc;
                }

                [data-theme="dark"] .auth-switch {
                    border-top-color: #444;
                }

                [data-theme="dark"] .auth-modal-backdrop {
                    background: rgba(0, 0, 0, 0.8);
                }

                [data-theme="dark"] .auth-modal-header h3 {
                    color: #ffffff;
                }

                [data-theme="dark"] .auth-modal-header p {
                    color: #ccc;
                }

                [data-theme="dark"] .auth-submit-btn {
                    background: linear-gradient(135deg, #D4A017 0%, #B85C38 100%);
                    color: #1a0000;
                }

                [data-theme="dark"] .auth-submit-btn:hover {
                    background: linear-gradient(135deg, #B85C38 0%, #8F1111 100%);
                    color: #ffffff;
                }

                [data-theme="dark"] .auth-link {
                    color: #D4A017;
                }

                [data-theme="dark"] .auth-link:hover {
                    color: #B85C38;
                }

                [data-theme="dark"] .auth-switch-btn {
                    background: #D4A017;
                    color: #1a0000;
                }

                [data-theme="dark"] .auth-switch-btn:hover {
                    background: #B85C38;
                    color: #ffffff;
                }

                [data-theme="dark"] .auth-message {
                    background: rgba(255, 215, 0, 0.1);
                    border-color: #D4A017;
                    color: #ffffff;
                }

                [data-theme="dark"] .auth-message.error {
                    background: rgba(230, 57, 70, 0.1);
                    border-color: #8F1111;
                }

                [data-theme="dark"] .auth-message.success {
                    background: rgba(67, 185, 41, 0.1);
                    border-color: #43B929;
                }
            </style>

            <div class="auth-modal-backdrop" id="authModalBackdrop">
                <div class="auth-modal-content">
                    <button class="auth-modal-close" id="authModalClose">
                        <svg viewBox="0 0 24 24">
                            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                        </svg>
                    </button>

                    <!-- Login Form -->
                    <div class="auth-form" id="loginForm">
                        <div class="auth-modal-header">
                            <h3>${t('auth_welcome_back')}</h3>
                            <p>${t('auth_login_subtitle')}</p>
                        </div>
                        
                        <div class="auth-message" id="loginMessage"></div>
                        
                        <form>
                            <div class="auth-form-group">
                                <label for="loginEmail">${t('auth_email')}</label>
                                <input type="email" id="loginEmail" placeholder="${t('auth_email_placeholder')}" required>
                            </div>
                            <div class="auth-form-group">
                                <label for="loginPassword">${t('auth_password')}</label>
                                <input type="password" id="loginPassword" placeholder="${t('auth_password_placeholder')}" required>
                            </div>
                            <div class="auth-role-picker" data-role-group="login">
                                <p class="auth-role-label">${t('auth_how_enter')}</p>
                                <div class="auth-role-options">
                                    <button type="button" class="auth-role-card selected" data-role="customer">
                                        <strong>${t('auth_role_customer')}</strong>
                                        <span>${t('auth_role_customer_desc')}</span>
                                    </button>
                                    <button type="button" class="auth-role-card" data-role="artisan">
                                        <strong>${t('auth_role_artisan')}</strong>
                                        <span>${t('auth_role_artisan_desc')}</span>
                                    </button>
                                </div>
                            </div>
                            <button type="submit" class="auth-submit-btn">${t('auth_login_button')}</button>
                        </form>
                        
                        <div class="auth-links">
                            <a href="#" class="auth-link" id="forgotPasswordLink">${t('auth_forgot_password')}</a>
                            <a href="#" class="auth-link" id="createAccountLink">${t('auth_create_account')}</a>
                        </div>
                        
                        <div class="auth-switch">
                            <p>${t('auth_no_account')}</p>
                            <button class="auth-switch-btn" id="switchToRegisterBtn">${t('auth_register_button')}</button>
                        </div>
                    </div>

                    <!-- Register Form -->
                    <div class="auth-form hidden" id="registerForm">
                        <div class="auth-modal-header">
                            <h3>${t('auth_join_artesana')}</h3>
                            <p>${t('auth_register_subtitle')}</p>
                        </div>
                        
                        <div class="auth-message" id="registerMessage"></div>
                        
                        <form>
                            <div class="auth-form-group">
                                <label for="registerName">${t('auth_full_name')}</label>
                                <input type="text" id="registerName" placeholder="${t('auth_full_name_placeholder')}" required>
                            </div>
                            <div class="auth-form-group">
                                <label for="registerEmail">${t('auth_email')}</label>
                                <input type="email" id="registerEmail" placeholder="${t('auth_email_placeholder')}" required>
                            </div>
                            <div class="auth-form-group">
                                <label for="registerPassword">${t('auth_password')}</label>
                                <input type="password" id="registerPassword" placeholder="${t('auth_create_password_placeholder')}" required>
                            </div>
                            <div class="auth-form-group">
                                <label for="registerConfirmPassword">${t('auth_confirm_password')}</label>
                                <input type="password" id="registerConfirmPassword" placeholder="${t('auth_confirm_password_placeholder')}" required>
                            </div>
                            <div class="auth-role-picker" data-role-group="register">
                                <p class="auth-role-label">${t('auth_choose_account')}</p>
                                <div class="auth-role-options">
                                    <button type="button" class="auth-role-card selected" data-role="customer">
                                        <strong>${t('auth_role_customer')}</strong>
                                        <span>${t('auth_role_customer_desc')}</span>
                                    </button>
                                    <button type="button" class="auth-role-card" data-role="artisan">
                                        <strong>${t('auth_role_artisan')}</strong>
                                        <span>${t('auth_role_artisan_desc')}</span>
                                    </button>
                                </div>
                            </div>
                            <button type="submit" class="auth-submit-btn">${t('auth_create_account_button')}</button>
                        </form>
                        
                        <div class="auth-switch">
                            <p>${t('auth_already_account')}</p>
                            <button class="auth-switch-btn" id="switchToLoginBtn">${t('auth_login_button')}</button>
                        </div>
                    </div>

                    <!-- Forgot Password Form -->
                    <div class="auth-form hidden" id="forgotPasswordForm">
                        <div class="auth-modal-header">
                            <h3>${t('auth_reset_password')}</h3>
                            <p>${t('auth_reset_subtitle')}</p>
                        </div>
                        
                        <div class="auth-message" id="forgotPasswordMessage"></div>
                        
                        <div class="back-to-login" id="backToLoginBtn">
                            <svg class="icon" viewBox="0 0 24 24">
                                <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
                            </svg>
                            <span>${t('auth_back_to_login')}</span>
                        </div>
                        
                        <form>
                            <div class="auth-form-group">
                                <label for="forgotEmail">${t('auth_email')}</label>
                                <input type="email" id="forgotEmail" placeholder="${t('auth_email_placeholder')}" required autocomplete="email">
                            </div>
                            <button type="submit" class="auth-submit-btn">${t('auth_send_reset_link')}</button>
                        </form>
                        
                        <div class="auth-switch">
                            <p>${t('auth_remember_password')}</p>
                            <button class="auth-switch-btn" id="switchToLoginFromForgotBtn">${t('auth_login_button')}</button>
                        </div>
                    </div>

                    <!-- 2FA Verification (API: POST /api/auth/verify-2fa) -->
                    <div class="auth-form hidden" id="twoFactorForm">
                        <div class="auth-modal-header">
                            <h3>${t('auth_2fa_title') || 'Verificación en dos pasos'}</h3>
                            <p>${t('auth_2fa_subtitle') || 'Ingresa el código de 6 dígitos de tu app autenticadora'}</p>
                        </div>
                        <div class="auth-message" id="twoFactorMessage"></div>
                        <form>
                            <div class="auth-form-group">
                                <label for="twoFactorCode">${t('auth_2fa_code') || 'Código de verificación'}</label>
                                <input type="text" id="twoFactorCode" inputmode="numeric" pattern="[0-9]{6}" maxlength="6" placeholder="000000" required autocomplete="one-time-code" aria-describedby="twoFactorHint">
                            </div>
                            <small id="twoFactorHint" style="color:#666;display:block;margin-bottom:12px;">Demo: use 123456 for users with 2FA enabled.</small>
                            <button type="submit" class="auth-submit-btn">${t('auth_verify') || 'Verificar'}</button>
                        </form>
                        <div class="auth-switch">
                            <button class="auth-switch-btn" id="backToLoginFrom2FABtn">${t('auth_back_to_login')}</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    attachEventListeners() {
        // Close modal
        this.shadowRoot.getElementById('authModalClose').addEventListener('click', () => {
            this.close();
        });

        // Backdrop click to close
        this.shadowRoot.getElementById('authModalBackdrop').addEventListener('click', (e) => {
            if (e.target === e.currentTarget) {
                this.close();
            }
        });

        // Form switching
        this.shadowRoot.getElementById('switchToRegisterBtn').addEventListener('click', () => {
            this.switchToRegister();
        });

        this.shadowRoot.getElementById('switchToLoginBtn').addEventListener('click', () => {
            this.switchToLogin();
        });

        this.shadowRoot.getElementById('createAccountLink').addEventListener('click', (e) => {
            e.preventDefault();
            this.switchToRegister();
        });

        this.shadowRoot.getElementById('forgotPasswordLink').addEventListener('click', (e) => {
            e.preventDefault();
            this.showForgotPassword();
        });

        this.shadowRoot.getElementById('backToLoginBtn').addEventListener('click', () => {
            this.switchToLogin();
        });

        this.shadowRoot.getElementById('switchToLoginFromForgotBtn').addEventListener('click', () => {
            this.switchToLogin();
        });

        const back2fa = this.shadowRoot.getElementById('backToLoginFrom2FABtn');
        if (back2fa) back2fa.addEventListener('click', () => this.switchToLogin());

        // Form submissions
        this.shadowRoot.querySelector('#loginForm form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });

        this.shadowRoot.querySelector('#registerForm form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleRegister();
        });

        this.shadowRoot.querySelector('#forgotPasswordForm form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleForgotPassword();
        });

        const twoFactorForm = this.shadowRoot.querySelector('#twoFactorForm form');
        if (twoFactorForm) {
            twoFactorForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handle2FAVerify();
            });
        }

        this._setSubmitLoading = (formId, loading) => {
            const btn = this.shadowRoot.querySelector(`#${formId}Form .auth-submit-btn`);
            if (btn) {
                btn.disabled = loading;
                btn.style.opacity = loading ? '0.7' : '';
            }
        };

        this.shadowRoot.querySelectorAll('.auth-role-card').forEach(card => {
            card.addEventListener('click', () => {
                const group = card.closest('.auth-role-picker');
                group.querySelectorAll('.auth-role-card').forEach(c => c.classList.remove('selected'));
                card.classList.add('selected');
                this.selectedRole = card.dataset.role;
                this.shadowRoot.querySelectorAll('.auth-role-card[data-role="' + this.selectedRole + '"]').forEach(c => {
                    c.classList.add('selected');
                });
                this.shadowRoot.querySelectorAll('.auth-role-card:not([data-role="' + this.selectedRole + '"])').forEach(c => {
                    c.classList.remove('selected');
                });
            });
        });

        // Keyboard events
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen()) {
                this.close();
            }
        });
    }

    open(formType = 'login') {
        const isLoggedIn = (window.AuthGuard && window.AuthGuard.isAuthenticated())
            || (window.localDB && window.localDB.isLoggedIn && window.localDB.isLoggedIn());
        if (isLoggedIn) {
            sessionStorage.removeItem('artesana_redirect_after_login');
            return;
        }

        this.currentForm = formType;
        this.showForm(formType);
        
        const backdrop = this.shadowRoot.getElementById('authModalBackdrop');
        backdrop.style.display = 'flex';
        
        // Trigger animation
        setTimeout(() => {
            backdrop.classList.add('show');
        }, 10);

        // Focus on first input
        setTimeout(() => {
            const firstInput = this.shadowRoot.querySelector(`#${formType}Form input`);
            if (firstInput) {
                firstInput.focus();
            }
        }, 300);
    }

    close() {
        const backdrop = this.shadowRoot.getElementById('authModalBackdrop');
        backdrop.classList.remove('show');
        
        setTimeout(() => {
            backdrop.style.display = 'none';
        }, 300);
    }

    isOpen() {
        return this.shadowRoot.getElementById('authModalBackdrop').style.display === 'flex';
    }

    showForm(formType) {
        // Hide all forms
        this.shadowRoot.querySelectorAll('.auth-form').forEach(form => {
            form.classList.add('hidden');
        });

        // Show selected form
        const targetForm = this.shadowRoot.getElementById(`${formType}Form`);
        if (targetForm) {
            targetForm.classList.remove('hidden');
        }
    }

    switchToLogin() {
        this._pendingLogin = null;
        this.currentForm = 'login';
        this.showForm('login');
    }

    _t(key) {
        const lang = localStorage.getItem('lang') || 'es';
        return (window.translations && window.translations[lang] && window.translations[lang][key]) || key;
    }

    async _completeAuthSuccess(type) {
        const t = (key) => this._t(key);
        const role = this.selectedRole === 'artisan' ? 'artisan' : 'customer';
        this.showMessage(type === 'register' ? t('auth_register_success') : t('auth_login_success'), 'success');
        this.close();
        if (window.RoleService && window.RoleService.selectRole) {
            await window.RoleService.selectRole(role);
        } else if (window.localDB && window.localDB.getCurrentUser) {
            const user = window.localDB.getCurrentUser();
            if (user) {
                window.localDB.saveCurrentUser({
                    ...user,
                    role,
                    roleSelected: true,
                    activeMode: role
                });
            }
        }
        if (window.renderHeader) window.renderHeader();
        setTimeout(() => {
            const redirectUrl = window.AuthGuard?.getPostLoginRedirect?.();
            if (redirectUrl) {
                window.location.href = redirectUrl;
                return;
            }
            window.location.href = window.RoleService
                ? window.RoleService.getPostRoleRedirect(role)
                : (role === 'artisan' ? 'perfil.html#create-store' : 'index.html');
        }, 700);
    }

    async _runLogin(email, password, twoFactorCode) {
        if (window.supabaseAuth) {
            return window.supabaseAuth.login(email, password, twoFactorCode);
        }
        if (window.localDB) {
            const local = window.localDB.authenticate(email, password, twoFactorCode);
            if (local.success) return { success: true, user: local.user };
            if (local.requires2FA) return { success: false, requires2FA: true, userId: local.userId };
            return {
                success: false,
                message: this._t('auth_invalid_credentials') !== 'auth_invalid_credentials'
                    ? this._t('auth_invalid_credentials')
                    : (localStorage.getItem('lang') === 'es' ? 'Correo o contraseña incorrectos' : 'Invalid email or password')
            };
        }
        return {
            success: false,
            message: localStorage.getItem('lang') === 'es'
                ? 'No se pudo cargar el sistema de acceso. Recarga la página.'
                : 'Could not load sign-in. Please reload the page.'
        };
    }

    async _runRegister(name, email, password) {
        const role = this.selectedRole === 'artisan' ? 'artisan' : 'customer';
        if (window.supabaseAuth) {
            const result = await window.supabaseAuth.register(name, email, password);
            return result;
        }
        if (window.localDB) {
            const local = window.localDB.register({ name, email, password, role });
            return local.success
                ? { success: true, user: local.user }
                : {
                    success: false,
                    message: localStorage.getItem('lang') === 'es'
                        ? 'Este correo ya está registrado'
                        : 'This email is already registered'
                };
        }
        return {
            success: false,
            message: localStorage.getItem('lang') === 'es'
                ? 'No se pudo cargar el registro. Recarga la página.'
                : 'Could not load registration. Please reload the page.'
        };
    }

    switchToRegister() {
        this.currentForm = 'register';
        this.showForm('register');
    }

    showForgotPassword() {
        this.currentForm = 'forgotPassword';
        this.showForm('forgotPassword');
    }

    async ensureSupabase() {
        if (window.supabaseAuth) return true;

        await new Promise((resolve, reject) => {
            const deadline = Date.now() + 10000;
            const check = () => {
                if (window.supabaseAuth) {
                    resolve();
                } else if (Date.now() > deadline) {
                    reject(new Error('Supabase timeout'));
                } else {
                    setTimeout(check, 100);
                }
            };
            check();
        });

        return true;
    }

    async handleLogin() {
        const email = this.shadowRoot.getElementById('loginEmail').value.trim();
        const password = this.shadowRoot.getElementById('loginPassword').value;
        const t = (key) => this._t(key);
        
        if (!email || !password) {
            this.showMessage(t('auth_please_complete_fields'), 'error');
            return;
        }

        if (!window.supabaseAuth && !window.localDB) {
            try {
                await this.ensureSupabase();
            } catch {
                /* auth local como respaldo si Supabase no carga */
            }
        }

        this._setSubmitLoading('login', true);
        const result = await this._runLogin(email, password);
        this._setSubmitLoading('login', false);

        if (result.requires2FA) {
            this._pendingLogin = { email, password };
            this.currentForm = 'twoFactor';
            this.showForm('twoFactor');
            this.showMessage(
                t('auth_2fa_subtitle') !== 'auth_2fa_subtitle'
                    ? t('auth_2fa_subtitle')
                    : 'Ingresa el código de 6 dígitos (demo: 123456)',
                'success',
                'twoFactor'
            );
            return;
        }

        if (result.success) {
            await this._completeAuthSuccess('login');
        } else {
            this.showMessage(result.message, 'error');
        }
    }

    async handle2FAVerify() {
        const code = this.shadowRoot.getElementById('twoFactorCode')?.value.trim();
        const pending = this._pendingLogin;

        if (!pending || !code) {
            this.showMessage(this._t('auth_please_complete_fields'), 'error', 'twoFactor');
            return;
        }

        this._setSubmitLoading('twoFactor', true);
        const result = await this._runLogin(pending.email, pending.password, code);
        this._setSubmitLoading('twoFactor', false);

        if (result.success) {
            this._pendingLogin = null;
            await this._completeAuthSuccess('login');
            return;
        }

        this.showMessage(result.message, 'error', 'twoFactor');
    }

    async handleRegister() {
        const name = this.shadowRoot.getElementById('registerName').value.trim();
        const email = this.shadowRoot.getElementById('registerEmail').value.trim();
        const password = this.shadowRoot.getElementById('registerPassword').value;
        const confirmPassword = this.shadowRoot.getElementById('registerConfirmPassword').value;
        const lang = localStorage.getItem('lang') || 'es';
        const t = (key) => window.translations && window.translations[lang] && window.translations[lang][key] ? window.translations[lang][key] : key;
        
        if (!name || !email || !password || !confirmPassword) {
            this.showMessage(t('auth_please_complete_fields'), 'error');
            return;
        }

        if (password !== confirmPassword) {
            this.showMessage(t('auth_passwords_dont_match'), 'error');
            return;
        }

        if (password.length < 6) {
            this.showMessage(t('auth_password_min_length'), 'error');
            return;
        }

        if (!window.supabaseAuth && !window.localDB) {
            try {
                await this.ensureSupabase();
            } catch {
                /* auth local como respaldo si Supabase no carga */
            }
        }

        this._setSubmitLoading('register', true);
        const result = await this._runRegister(name, email.trim(), password);
        this._setSubmitLoading('register', false);
        
        if (result.success) {
            await this._completeAuthSuccess('register');
        } else {
            this.showMessage(result.message, 'error');
        }
    }

    async handleForgotPassword() {
        const email = this.shadowRoot.getElementById('forgotEmail').value;
        const lang = localStorage.getItem('lang') || 'es';
        const t = (key) => window.translations && window.translations[lang] && window.translations[lang][key] ? window.translations[lang][key] : key;
        
        if (!email) {
            this.showMessage(t('auth_please_enter_email'), 'error');
            return;
        }

        if (!window.supabaseAuth && !window.localDB) {
            try {
                await this.ensureSupabase();
            } catch {
                this.showMessage(t('auth_please_enter_email'), 'error');
                return;
            }
        }

        this._setSubmitLoading('forgotPassword', true);
        const result = window.supabaseAuth
            ? await window.supabaseAuth.resetPassword(email)
            : { success: true };
        this._setSubmitLoading('forgotPassword', false);

        if (result.success) {
            this.showMessage(t('auth_reset_link_sent'), 'success');
            this.switchToLogin();
        } else {
            this.showMessage(result.message, 'error');
        }
    }

    showMessage(message, type = 'success', formOverride) {
        const currentForm = formOverride || this.currentForm;
        const messageId = currentForm === 'forgotPassword' ? 'forgotPasswordMessage' : `${currentForm}Message`;
        const messageElement = this.shadowRoot.getElementById(messageId);
        
        if (messageElement) {
            messageElement.textContent = message;
            messageElement.className = `auth-message ${type} show`;
            
            // Auto-hide after 5 seconds
            setTimeout(() => {
                messageElement.classList.remove('show');
            }, 5000);
        }
    }
}

// Register the custom element
customElements.define('auth-modal', AuthModal);

// Export for use in other components
window.AuthModal = AuthModal; 