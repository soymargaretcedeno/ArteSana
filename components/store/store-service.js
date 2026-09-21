/**
 * Servicio de tienda del vendedor — estadísticas, publicaciones y persistencia.
 */
(function (global) {
    'use strict';

    const CATEGORIES = [
        { value: 'jewelry', label: 'Joyas' },
        { value: 'ceramics', label: 'Cerámicas' },
        { value: 'textiles', label: 'Textiles' },
        { value: 'sculpture', label: 'Esculturas' }
    ];

    const CONDITIONS = [
        'Nuevo',
        'Manualidad',
        'Usado-Como nuevo',
        'Usado-Buen estado',
        'Usado-Aceptable'
    ];

    const PUBLICATION_STATUSES = {
        draft: 'Borrador',
        active: 'Activa',
        pending: 'Pendiente',
        inactive: 'Inactiva',
        deleted: 'Eliminada'
    };

    function t(key, fallback) {
        const lang = localStorage.getItem('lang') || 'es';
        return (global.translations && global.translations[lang] && global.translations[lang][key]) || fallback;
    }

    function getSellerProducts(userId) {
        if (!global.userProductsDB) return [];
        return global.userProductsDB.getUserOwnProducts(userId)
            .filter((p) => (p.publicationStatus || 'active') !== 'deleted')
            .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    }

    function buildArtisanFromUser(user, store, location) {
        return {
            id: user.id,
            name: user.name,
            avatar: user.avatar || store?.photo || '',
            store: store?.name || '',
            location: location || store?.location || user.location || '',
            rating: user.rating || 0
        };
    }

    function getStats(user, store) {
        const products = getSellerProducts(user.id);
        let chatsToAnswer = 0;

        if (global.PlatformServices) {
            chatsToAnswer = global.PlatformServices.getMessageThreads()
                .filter(thread => (thread.unread || 0) > 0).length;
        }

        const activePublications = products.filter(p =>
            (p.publicationStatus || 'active') === 'active'
        ).length;

        const toRenew = products.filter(p => p.needsRenewal === true).length;
        const clicks7d = products.reduce((sum, p) => sum + (Number(p.clicksLast7Days) || 0), 0);
        const reviewCount = products.reduce((sum, p) => sum + (Number(p.reviews) || 0), 0);
        const rating = user.rating || (products.length ? (
            products.reduce((s, p) => s + (Number(p.rating) || 0), 0) / products.length
        ).toFixed(1) : 0);

        return {
            chatsToAnswer,
            activePublications,
            toRenew,
            clicks7d,
            rating,
            reviewCount,
            followers7d: Number(user.followersLast7Days) || 0
        };
    }

    function getCategoryLabel(value) {
        return CATEGORIES.find(c => c.value === value)?.label || value;
    }

    function validatePublication(data) {
        const errors = [];
        if (!data.images || !data.images.length) {
            errors.push(t('store_err_photos', 'Agrega al menos una fotografía'));
        }
        if (!data.title || !data.title.trim()) {
            errors.push(t('store_err_title', 'El título es obligatorio'));
        }
        if (data.price === '' || data.price == null || isNaN(data.price) || Number(data.price) <= 0) {
            errors.push(t('store_err_price', 'El precio es obligatorio y debe ser mayor que 0'));
        }
        if (!data.category) {
            errors.push(t('store_err_category', 'Selecciona una categoría'));
        }
        if (!data.productCondition) {
            errors.push(t('store_err_condition', 'Selecciona un estado'));
        }
        if (!data.description || !data.description.trim()) {
            errors.push(t('store_err_description', 'La descripción es obligatoria'));
        }
        const loc = data.location && data.location.trim();
        if (!loc) {
            errors.push(t('store_err_location', 'La ubicación es obligatoria'));
        }
        return errors;
    }

    function normalizeOptionalFields(formData) {
        const materials = formData.materials?.trim();
        const technique = formData.technique?.trim();
        const elaborationTime = formData.elaborationTime?.trim();
        const dimensions = formData.dimensions?.trim();
        const culturalStory = formData.culturalStory?.trim();

        return {
            ...(materials ? { materials: [materials] } : {}),
            ...(technique ? { technique } : {}),
            ...(elaborationTime ? { elaborationTime } : {}),
            ...(dimensions ? { dimensions } : {}),
            ...(culturalStory ? { culturalStory } : {})
        };
    }

    function publishProduct(formData) {
        const user = global.RoleService?.getCurrentUser();
        const store = global.RoleService?.getStore();

        if (!user) {
            return { success: false, message: t('store_err_login', 'Debes iniciar sesión') };
        }
        if (!global.RoleService?.isArtisan(user) && user.role !== 'artisan') {
            return { success: false, message: t('store_err_seller_only', 'Solo vendedores pueden publicar') };
        }
        if (!store) {
            return { success: false, message: t('store_err_no_store', 'Debes tener una tienda creada') };
        }

        const location = (formData.location || store.location || user.location || '').trim();
        const optional = normalizeOptionalFields(formData);

        const payload = {
            name: formData.title.trim(),
            description: formData.description.trim(),
            price: Number(formData.price),
            currency: 'USD',
            category: formData.category,
            productCondition: formData.productCondition,
            location,
            publicationStatus: 'active',
            images: formData.images,
            mainImage: formData.images[0],
            stock: Math.max(1, Number(formData.stock) || 1),
            tags: formData.tags || [],
            sellerId: user.id,
            userId: user.id,
            artisan: buildArtisanFromUser(user, store, location),
            storeName: store.name,
            shipping: { estimatedDays: '5-7 business days' },
            rating: 0,
            reviews: 0,
            featured: false,
            ...optional
        };

        const errors = validatePublication({
            images: payload.images,
            title: payload.name,
            price: payload.price,
            category: payload.category,
            productCondition: payload.productCondition,
            description: payload.description,
            location: payload.location
        });

        if (errors.length) {
            return { success: false, errors };
        }

        if (!global.userProductsDB) {
            return { success: false, message: t('store_err_db', 'Sistema de productos no disponible') };
        }

        const product = global.userProductsDB.addUserProduct(payload);
        const count = getSellerProducts(user.id).length;

        if (global.localDB) {
            const users = JSON.parse(localStorage.getItem('artesana_users') || '[]');
            const idx = users.findIndex(u => String(u.id) === String(user.id));
            if (idx !== -1) {
                users[idx].products = count;
                localStorage.setItem('artesana_users', JSON.stringify(users));
            }
            global.localDB.saveCurrentUser({ ...user, products: count });
        }

        document.dispatchEvent(new CustomEvent('store:publication-created', { detail: { product } }));
        return { success: true, product };
    }

    function deletePublication(productId) {
        const user = global.RoleService?.getCurrentUser();
        if (!user || !global.userProductsDB) {
            return { success: false, message: t('store_err_login', 'Debes iniciar sesión') };
        }

        const product = global.userProductsDB.getUserProductById(productId);
        if (!product) {
            return { success: false, message: t('store_err_not_found', 'Publicación no encontrada') };
        }
        if (String(product.userId) !== String(user.id) && String(product.sellerId) !== String(user.id)) {
            return { success: false, message: t('store_err_forbidden', 'No puedes eliminar esta publicación') };
        }

        global.userProductsDB.softDeleteUserProduct(productId, user.id);
        document.dispatchEvent(new CustomEvent('store:publication-deleted', { detail: { productId } }));
        return { success: true };
    }

    function updatePublication(productId, formData) {
        const user = global.RoleService?.getCurrentUser();
        if (!user || !global.userProductsDB) {
            return { success: false, message: t('store_err_login', 'Debes iniciar sesión') };
        }

        const existing = global.userProductsDB.getUserProductById(productId);
        if (!existing || (String(existing.userId) !== String(user.id) && String(existing.sellerId) !== String(user.id))) {
            return { success: false, message: t('store_err_forbidden', 'No puedes editar esta publicación') };
        }

        const optional = normalizeOptionalFields(formData);
        const updates = {
            name: formData.title?.trim() || existing.name,
            description: formData.description?.trim() || existing.description,
            price: formData.price != null ? Number(formData.price) : existing.price,
            category: formData.category || existing.category,
            productCondition: formData.productCondition || existing.productCondition,
            location: (formData.location || existing.location || '').trim(),
            ...optional
        };

        if (formData.images?.length) {
            updates.images = formData.images;
            updates.mainImage = formData.images[0];
        }

        const errors = validatePublication({
            images: updates.images || existing.images,
            title: updates.name,
            price: updates.price,
            category: updates.category,
            productCondition: updates.productCondition,
            description: updates.description,
            location: updates.location
        });

        if (errors.length) {
            return { success: false, errors };
        }

        const product = global.userProductsDB.updateUserProduct(productId, updates, user.id);
        document.dispatchEvent(new CustomEvent('store:publication-updated', { detail: { product } }));
        return { success: true, product };
    }

    global.StoreService = {
        CATEGORIES,
        CONDITIONS,
        PUBLICATION_STATUSES,
        t,
        getStats,
        getSellerProducts,
        getCategoryLabel,
        validatePublication,
        publishProduct,
        updatePublication,
        deletePublication,
        buildArtisanFromUser
    };
})(window);
