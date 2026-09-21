/**
 * Servicio central de roles: Cliente (customer) y Vendedor (artisan).
 * Reutiliza localStorage y perfiles existentes sin modificar APIs.
 */
(function (global) {
    'use strict';

    const ROLES = {
        CUSTOMER: 'customer',
        ARTISAN: 'artisan'
    };

    const ROLE_LABELS = {
        es: { customer: 'Cliente', artisan: 'Vendedor' },
        en: { customer: 'Customer', artisan: 'Seller' }
    };

    function t(key, fallback) {
        const lang = localStorage.getItem('lang') || 'es';
        return (global.translations && global.translations[lang] && global.translations[lang][key]) || fallback;
    }

    function getRoleLabel(role) {
        const lang = localStorage.getItem('lang') || 'es';
        return (ROLE_LABELS[lang] || ROLE_LABELS.es)[role] || role;
    }

    function getCurrentUser() {
        return global.localDB ? global.localDB.getCurrentUser() : null;
    }

    function hasRoleSelected(user) {
        if (!user) return false;
        if (user.roleSelected === true) return true;
        if (user.roleSelected === false) return false;
        return user.role === ROLES.ARTISAN || user.role === ROLES.CUSTOMER;
    }

    function isArtisan(user) {
        user = user || getCurrentUser();
        if (!user) return false;
        if (user.activeMode === ROLES.CUSTOMER) return false;
        if (user.activeMode === ROLES.ARTISAN) return true;
        return user.role === ROLES.ARTISAN || !!user.store;
    }

    function isCustomer(user) {
        return !isArtisan(user);
    }

    function getActiveMode(user) {
        user = user || getCurrentUser();
        if (!user) return ROLES.CUSTOMER;
        if (user.activeMode === ROLES.ARTISAN || user.activeMode === ROLES.CUSTOMER) {
            return user.activeMode;
        }
        return isArtisan(user) ? ROLES.ARTISAN : ROLES.CUSTOMER;
    }

    function needsRoleSelection(user) {
        return user && !hasRoleSelected(user);
    }

    async function syncRoleToSupabase(role) {
        if (!global.supabaseAuth || !global.supabaseAuth.client) return;
        try {
            const { data: { session } } = await global.supabaseAuth.client.auth.getSession();
            if (!session?.user) return;
            await global.supabaseAuth.client.from('profiles').upsert({
                id: session.user.id,
                role,
                role_selected: true,
                updated_at: new Date().toISOString()
            });
        } catch (e) {
            console.warn('[RoleService] Supabase sync:', e.message);
        }
    }

    function persistUserUpdates(userId, updates) {
        if (!global.localDB) return null;

        const users = JSON.parse(localStorage.getItem('artesana_users') || '[]');
        const idx = users.findIndex(u => String(u.id) === String(userId));

        if (idx !== -1) {
            users[idx] = { ...users[idx], ...updates };
            localStorage.setItem('artesana_users', JSON.stringify(users));
        }

        const current = global.localDB.getCurrentUser();
        if (current && String(current.id) === String(userId)) {
            const updated = { ...current, ...updates };
            global.localDB.saveCurrentUser(updated);
            return updated;
        }

        if (idx !== -1) {
            const { password, twoFactorCode, ...safe } = users[idx];
            global.localDB.saveCurrentUser(safe);
            return safe;
        }
        return null;
    }

    async function selectRole(role) {
        const user = getCurrentUser();
        if (!user) return { success: false, message: 'No hay sesión activa' };

        const validRole = role === ROLES.ARTISAN ? ROLES.ARTISAN : ROLES.CUSTOMER;
        const updates = {
            role: validRole,
            roleSelected: true,
            activeMode: validRole
        };

        if (validRole === ROLES.ARTISAN) {
            updates.products = user.products || 0;
            updates.rating = user.rating || 0;
        }

        const updated = persistUserUpdates(user.id, updates);
        await syncRoleToSupabase(validRole);

        document.dispatchEvent(new CustomEvent('role:selected', { detail: { role: validRole, user: updated } }));
        return { success: true, user: updated, role: validRole };
    }

    function getStore(userId) {
        const user = userId ? null : getCurrentUser();
        const id = userId || (user && user.id);
        if (!id) return null;

        try {
            const myStore = JSON.parse(localStorage.getItem('myStore') || 'null');
            if (myStore && myStore.userId && String(myStore.userId) === String(id)) return myStore;
        } catch { /* noop */ }

        const current = getCurrentUser();
        if (current && String(current.id) === String(id) && current.store) {
            return typeof current.store === 'string' ? JSON.parse(current.store) : current.store;
        }

        const users = JSON.parse(localStorage.getItem('artesana_users') || '[]');
        const stored = users.find(u => String(u.id) === String(id));
        if (stored?.store) {
            return typeof stored.store === 'string' ? JSON.parse(stored.store) : stored.store;
        }
        return null;
    }

    async function createStore(storeData) {
        const user = getCurrentUser();
        if (!user) return { success: false, message: 'Debes iniciar sesión' };

        const store = {
            name: (storeData.name || '').trim(),
            location: (storeData.location || '').trim(),
            photo: (storeData.photo || '').trim(),
            desc: (storeData.desc || '').trim(),
            userId: user.id,
            ownerName: user.name,
            createdAt: new Date().toISOString().split('T')[0]
        };

        if (!store.name || !store.location) {
            return { success: false, message: t('role_store_required', 'Nombre y ubicación son obligatorios') };
        }

        localStorage.setItem('myStore', JSON.stringify(store));

        const updates = {
            role: ROLES.ARTISAN,
            roleSelected: true,
            store,
            products: user.products || 0,
            rating: user.rating || 0
        };

        const updated = persistUserUpdates(user.id, updates);
        await syncRoleToSupabase(ROLES.ARTISAN);

        document.dispatchEvent(new CustomEvent('store:created', { detail: { store, user: updated } }));
        return { success: true, store, user: updated };
    }

    function getPostAuthRedirect() {
        const user = getCurrentUser();
        if (!user) return 'index.html';
        if (needsRoleSelection(user)) return 'seleccionar-rol.html';
        return getPostRoleRedirect(getActiveMode(user));
    }

    function getPostRoleRedirect(role) {
        const mode = role || getActiveMode();
        if (mode === ROLES.ARTISAN) {
            return getStore() ? 'perfil.html#my-store-section' : 'perfil.html#create-store';
        }
        return 'index.html';
    }

    global.RoleService = {
        ROLES,
        t,
        getRoleLabel,
        getCurrentUser,
        hasRoleSelected,
        isArtisan,
        isCustomer,
        getActiveMode,
        needsRoleSelection,
        selectRole,
        createStore,
        getStore,
        getPostAuthRedirect,
        getPostRoleRedirect
    };
})(window);
