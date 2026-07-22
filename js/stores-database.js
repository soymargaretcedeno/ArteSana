/**
 * Tiendas de vendedores (localStorage).
 * Una tienda por usuario vendedor; visibles en Explore / Store.
 */
(function (global) {
    'use strict';

    const STORAGE_KEY = 'artesana_stores';

    function defaultSampleStores() {
        return [
            {
                id: 'store_1',
                ownerId: 1,
                ownerName: 'Ana Diaz',
                name: "Ana's Handcrafts",
                location: 'Guna Yala',
                photo: 'https://randomuser.me/api/portraits/women/1.jpg',
                desc: 'Molas y textiles tradicionales',
                createdAt: '2024-01-15'
            },
            {
                id: 'store_3',
                ownerId: 3,
                ownerName: 'Maria Gonzalez',
                name: "Maria's Traditional Crafts",
                location: 'Emberá-Wounaan',
                photo: 'https://randomuser.me/api/portraits/women/2.jpg',
                desc: 'Joyería y artesanía Emberá',
                createdAt: '2024-01-10'
            },
            {
                id: 'store_5',
                ownerId: 5,
                ownerName: 'Isabella Torres',
                name: "Isabella's Art Gallery",
                location: 'Ciudad de Panamá',
                photo: 'https://randomuser.me/api/portraits/women/3.jpg',
                desc: 'Galería de arte artesanal',
                createdAt: '2024-01-25'
            }
        ];
    }

    function loadStores() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) return JSON.parse(raw);
            const samples = defaultSampleStores();
            localStorage.setItem(STORAGE_KEY, JSON.stringify(samples));
            return samples;
        } catch {
            return defaultSampleStores();
        }
    }

    function saveStores(stores) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(stores));
    }

    /** Migra tienda legacy `myStore` al usuario actual si aplica */
    function migrateLegacyStore() {
        try {
            const legacy = JSON.parse(localStorage.getItem('myStore') || 'null');
            const user = global.localDB && global.localDB.getCurrentUser();
            if (!legacy || !legacy.name || !user) return;
            const stores = loadStores();
            if (stores.some(s => s.ownerId === user.id)) return;
            stores.push({
                id: 'store_' + user.id,
                ownerId: user.id,
                ownerName: user.name,
                name: legacy.name,
                location: legacy.location || '',
                photo: legacy.photo || '',
                desc: legacy.desc || '',
                createdAt: new Date().toISOString()
            });
            saveStores(stores);
            if (user.role !== 'artisan') {
                global.localDB.updateProfile(user.id, { role: 'artisan', store: legacy.name });
            }
        } catch { /* ignore */ }
    }

    const StoresDatabase = {
        getAllStores() {
            migrateLegacyStore();
            return loadStores();
        },

        getStoreById(id) {
            return this.getAllStores().find(s => String(s.id) === String(id));
        },

        getStoreByOwner(ownerId) {
            migrateLegacyStore();
            return loadStores().find(s => s.ownerId === ownerId) || null;
        },

        hasStore(ownerId) {
            return !!this.getStoreByOwner(ownerId);
        },

        createStore(ownerId, data) {
            const stores = loadStores();
            const existing = stores.find(s => s.ownerId === ownerId);
            if (existing) {
                return { success: false, message: 'already_exists', store: existing };
            }

            const user = global.localDB ? global.localDB.getUserById(ownerId) : null;
            const store = {
                id: 'store_' + ownerId + '_' + Date.now(),
                ownerId,
                ownerName: (user && user.name) || data.ownerName || '',
                name: (data.name || '').trim(),
                location: (data.location || '').trim(),
                photo: (data.photo || '').trim(),
                desc: (data.desc || '').trim(),
                createdAt: new Date().toISOString()
            };

            if (!store.name || !store.location) {
                return { success: false, message: 'missing_fields' };
            }

            stores.unshift(store);
            saveStores(stores);

            if (global.localDB) {
                global.localDB.updateProfile(ownerId, {
                    role: 'artisan',
                    store: store.name,
                    roleSelected: true
                });
            }

            // Compatibilidad con código que lee myStore
            localStorage.setItem('myStore', JSON.stringify({
                name: store.name,
                location: store.location,
                photo: store.photo,
                desc: store.desc,
                id: store.id,
                ownerId: store.ownerId
            }));

            return { success: true, store };
        },

        updateStore(storeId, updates) {
            const stores = loadStores();
            const idx = stores.findIndex(s => s.id === storeId);
            if (idx === -1) return { success: false, message: 'not_found' };
            stores[idx] = { ...stores[idx], ...updates, updatedAt: new Date().toISOString() };
            saveStores(stores);
            const store = stores[idx];
            if (global.localDB && store.ownerId) {
                global.localDB.updateProfile(store.ownerId, { store: store.name });
            }
            return { success: true, store };
        },

        getStoreProducts(store) {
            if (!store || !global.userProductsDB) return [];
            return global.userProductsDB.getUserOwnProducts(store.ownerId) || [];
        }
    };

    global.storesDB = StoresDatabase;
})(window);
