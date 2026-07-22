/**
 * Redirecciones según rol (cliente / vendedor).
 * Roles internos: customer = Cliente, artisan = Vendedor.
 */
(function (global) {
    'use strict';

    const RoleRouter = {
        isSeller(user) {
            return user && user.role === 'artisan';
        },

        isCustomer(user) {
            return user && user.role !== 'artisan';
        },

        needsRoleSelection(user) {
            return !!(user && user.roleSelected === false);
        },

        roleLabel(user, lang) {
            const isEs = (lang || localStorage.getItem('lang') || 'es') === 'es';
            if (!user) return '';
            if (user.role === 'artisan') return isEs ? 'Vendedor' : 'Seller';
            return isEs ? 'Cliente' : 'Customer';
        },

        hasStore(user) {
            if (!user) return false;
            if (global.storesDB && typeof global.storesDB.hasStore === 'function') {
                return global.storesDB.hasStore(user.id);
            }
            return !!(user.store);
        },

        /** Destino tras login o tras elegir rol */
        getHomeForUser(user) {
            if (!user) return 'index.html';
            if (this.needsRoleSelection(user)) return null; // el modal maneja la elección
            if (this.isSeller(user)) {
                if (!this.hasStore(user)) return 'crear-tienda.html';
                return 'perfil.html';
            }
            return 'explorar.html';
        },

        /** CTA “Crear tienda / Convertirme en vendedor” */
        goBecomeSeller() {
            const user = global.localDB && global.localDB.getCurrentUser();
            if (!user) {
                sessionStorage.setItem('artesana_intent_become_seller', '1');
                const authModal = document.querySelector('auth-modal');
                if (authModal && typeof authModal.open === 'function') {
                    authModal.open('register');
                } else {
                    window.location.href = 'index.html';
                }
                return;
            }
            if (this.isSeller(user) && this.hasStore(user)) {
                window.location.href = 'perfil.html#my-products';
                return;
            }
            if (global.localDB && typeof global.localDB.becomeSeller === 'function') {
                global.localDB.becomeSeller(user.id);
            }
            window.location.href = 'crear-tienda.html';
        },

        consumeBecomeSellerIntent() {
            const intent = sessionStorage.getItem('artesana_intent_become_seller');
            if (intent) sessionStorage.removeItem('artesana_intent_become_seller');
            return intent === '1';
        }
    };

    global.RoleRouter = RoleRouter;
})(window);
