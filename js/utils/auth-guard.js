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
        if (isAuthenticated()) {
            sessionStorage.removeItem('artesana_redirect_after_login');
            return;
        }

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

    function handlePendingLoginRedirect() {
        const pending = sessionStorage.getItem('artesana_redirect_after_login');
        if (!pending) return;

        if (isAuthenticated()) {
            const url = getPostLoginRedirect();
            if (!url) return;
            try {
                const target = new URL(url, window.location.origin);
                const current = new URL(window.location.href);
                if (target.pathname !== current.pathname || target.search !== current.search) {
                    window.location.href = url;
                }
            } catch (e) {
                /* key already cleared */
            }
            return;
        }

        /* index.html maneja la apertura del modal en su propio DOMContentLoaded */
    }

    global.AuthGuard = {
        guardPrivateRoutes,
        isAuthenticated,
        redirectToLogin,
        getPostLoginRedirect,
        handlePendingLoginRedirect,
        PRIVATE_ROUTES
    };

    document.addEventListener('DOMContentLoaded', () => {
        guardPrivateRoutes();
        handlePendingLoginRedirect();
    });
})(window);
