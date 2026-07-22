/**
 * Protección de rutas privadas (client-side).
 * En producción, validar sesión/token también en el servidor.
 */
(function (global) {
    'use strict';

    const PRIVATE_ROUTES = [
        'perfil.html',
        'checkout.html',
        'add-product.html',
        'order-confirmation.html'
    ];

    const AUTH_OPTIONAL_ROUTES = ['cart.html'];

    function getCurrentPage() {
        const path = window.location.pathname;
        return path.substring(path.lastIndexOf('/') + 1) || 'index.html';
    }

    function isAuthenticated() {
        return global.localDB && typeof global.localDB.isLoggedIn === 'function' && global.localDB.isLoggedIn();
    }

    function redirectToLogin(returnUrl) {
        const url = returnUrl || window.location.href;
        sessionStorage.setItem('artesana_redirect_after_login', url);
        const authModal = document.querySelector('auth-modal');
        if (authModal && typeof authModal.open === 'function') {
            authModal.open('login');
        } else {
            window.location.href = 'index.html';
        }
    }

    function guardPrivateRoutes() {
        const page = getCurrentPage();

        if (PRIVATE_ROUTES.includes(page) && !isAuthenticated()) {
            sessionStorage.setItem('artesana_redirect_after_login', window.location.href);
            window.location.replace('index.html');
            return false;
        }

        if (AUTH_OPTIONAL_ROUTES.includes(page) && !isAuthenticated()) {
            document.dispatchEvent(new CustomEvent('auth:guest-mode', { detail: { page } }));
        }

        return true;
    }

    function getPostLoginRedirect() {
        const url = sessionStorage.getItem('artesana_redirect_after_login');
        sessionStorage.removeItem('artesana_redirect_after_login');
        return url;
    }

    global.AuthGuard = {
        guardPrivateRoutes,
        isAuthenticated,
        redirectToLogin,
        getPostLoginRedirect,
        PRIVATE_ROUTES
    };

    document.addEventListener('DOMContentLoaded', guardPrivateRoutes);
})(window);
