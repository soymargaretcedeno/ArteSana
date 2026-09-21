// User Products Database for ArteSana
class UserProductsDatabase {
    constructor() {
        this.userProducts = this.loadUserProducts();
        this.comparisonList = this.loadComparisonList();
        this.favorites = this.loadFavorites();
    }

    // Initialize with sample user products
    loadUserProducts() {
        const storedProducts = localStorage.getItem('artesana_user_products');
        if (storedProducts) {
            const products = JSON.parse(storedProducts);
            if (this.upgradeLowResImages(products)) {
                localStorage.setItem('artesana_user_products', JSON.stringify(products));
            }
            return products;
        }

        // Sample user products
        const sampleUserProducts = [
            {
                id: 'user_1',
                name: "Mola Tradicional Guna",
                description: "Hermosa mola tradicional de la cultura Guna Yala, tejida a mano con técnicas ancestrales. Cada pieza es única y cuenta una historia.",
                price: 125.00,
                originalPrice: 150.00,
                currency: "USD",
                category: "textiles",
                artisan: {
                    id: 1,
                    name: "Ana Diaz",
                    avatar: "https://randomuser.me/api/portraits/women/1.jpg",
                    store: "Ana's Handcrafts",
                    rating: 4.8,
                    location: "Guna Yala"
                },
                images: [
                    "https://cdn.shopify.com/s/files/1/0575/5106/1081/products/05-M3.png?v=1677351029",
                    "https://cdn.shopify.com/s/files/1/0575/5106/1081/products/05-MC25.png?v=1677234839",
                    "https://cdn.shopify.com/s/files/1/0575/5106/1081/products/05-MP08.png?v=1677232083"
                ],
                mainImage: "https://cdn.shopify.com/s/files/1/0575/5106/1081/products/05-M3.png?v=1677351029",
                tags: ["featured", "traditional", "handmade", "guna"],
                stock: 3,
                dimensions: "50cm x 40cm",
                materials: ["Algodón", "Aplicación"],
                weight: "0.5kg",
                shipping: {
                    weight: 0.5,
                    dimensions: "55cm x 45cm x 2cm",
                    estimatedDays: "5-7 business days"
                },
                rating: 4.9,
                reviews: 15,
                createdAt: "2024-01-15",
                featured: true,
                isUserProduct: true,
                userId: 1
            },
            {
                id: 'user_2',
                name: "Collar Emberá con Chaquiras",
                description: "Collar tradicional Emberá elaborado con chaquiras de colores vibrantes. Cada cuenta es colocada manualmente siguiendo patrones ancestrales.",
                price: 98.00,
                originalPrice: 120.00,
                currency: "USD",
                category: "jewelry",
                artisan: {
                    id: 3,
                    name: "Maria Gonzalez",
                    avatar: "https://randomuser.me/api/portraits/women/2.jpg",
                    store: "Maria's Traditional Crafts",
                    rating: 4.9,
                    location: "Emberá-Wounaan"
                },
                images: [
                    "https://cdn.shopify.com/s/files/1/0575/5106/1081/products/01-CH01.png?v=1676483082",
                    "https://cdn.shopify.com/s/files/1/0575/5106/1081/products/01-CH14.png?v=1676495071",
                    "https://cdn.shopify.com/s/files/1/0575/5106/1081/products/05-MC01.png?v=1677234384"
                ],
                mainImage: "https://cdn.shopify.com/s/files/1/0575/5106/1081/products/01-CH01.png?v=1676483082",
                tags: ["new", "handmade", "cultural", "embera"],
                stock: 5,
                dimensions: "45cm length",
                materials: ["Chaquiras de vidrio", "Hilo de algodón"],
                weight: "0.2kg",
                shipping: {
                    weight: 0.2,
                    dimensions: "50cm x 10cm x 5cm",
                    estimatedDays: "3-5 business days"
                },
                rating: 4.7,
                reviews: 8,
                createdAt: "2024-02-20",
                featured: false,
                isUserProduct: true,
                userId: 3
            },
            {
                id: 'user_3',
                name: "Vasija Cerámica Coclé",
                description: "Vasija cerámica inspirada en la cultura precolombina de Coclé. Elaborada con arcilla natural y decorada con pigmentos tradicionales.",
                price: 95.00,
                originalPrice: 110.00,
                currency: "USD",
                category: "ceramics",
                artisan: {
                    id: 5,
                    name: "Isabella Torres",
                    avatar: "https://randomuser.me/api/portraits/women/3.jpg",
                    store: "Isabella's Art Gallery",
                    rating: 4.7,
                    location: "Coclé"
                },
                images: [
                    "https://cdn.shopify.com/s/files/1/0575/5106/1081/products/11-PC.png?v=1676496036",
                    "https://cdn.shopify.com/s/files/1/0575/5106/1081/products/08-OV1.png?v=1671828992",
                    "https://cdn.shopify.com/s/files/1/0575/5106/1081/products/vajilla.png?v=1673454473"
                ],
                mainImage: "https://cdn.shopify.com/s/files/1/0575/5106/1081/products/11-PC.png?v=1676496036",
                tags: ["featured", "traditional", "handmade", "cocle"],
                stock: 2,
                dimensions: "25cm x 20cm x 15cm",
                materials: ["Arcilla", "Pigmentos naturales"],
                weight: "1.2kg",
                shipping: {
                    weight: 1.5,
                    dimensions: "30cm x 25cm x 20cm",
                    estimatedDays: "7-10 business days"
                },
                rating: 4.8,
                reviews: 12,
                createdAt: "2024-01-10",
                featured: true,
                isUserProduct: true,
                userId: 5
            }
        ];

        // Save to localStorage
        localStorage.setItem('artesana_user_products', JSON.stringify(sampleUserProducts));
        return sampleUserProducts;
    }

    upgradeLowResImages(products) {
        if (!Array.isArray(products)) return false;
        const adp = 'https://cdn.shopify.com/s/files/1/0575/5106/1081';
        const packs = {
            user_1: [`${adp}/products/05-M3.png?v=1677351029`, `${adp}/products/05-MC25.png?v=1677234839`, `${adp}/products/05-MP08.png?v=1677232083`],
            user_2: [`${adp}/products/01-CH01.png?v=1676483082`, `${adp}/products/01-CH14.png?v=1676495071`, `${adp}/products/05-MC01.png?v=1677234384`],
            user_3: [`${adp}/products/11-PC.png?v=1676496036`, `${adp}/products/08-OV1.png?v=1671828992`, `${adp}/products/vajilla.png?v=1673454473`]
        };
        const byCategory = {
            textiles: packs.user_1,
            jewelry: packs.user_2,
            ceramics: packs.user_3
        };
        const isCatalog = (url) => typeof url === 'string' && url.includes('cdn.shopify.com/s/files/1/0575/5106/1081');
        const isProtected = (url) => typeof url === 'string' && /^(data:|blob:)/i.test(url);
        let changed = false;
        products.forEach((product) => {
            if (!product || isProtected(product.mainImage)) return;
            if (isCatalog(product.mainImage) && Array.isArray(product.images) && product.images.every(isCatalog)) return;
            const name = `${product.name || ''} ${product.id || ''}`.toLowerCase();
            let pack = packs[product.id];
            if (!pack) {
                if (/sombrero|hat|pintao|pinta/.test(name)) {
                    pack = [`${adp}/products/26-S07.png?v=1672257853`, `${adp}/products/26-S04.png?v=1672228746`];
                } else if (/bolso|bag|ngäbe|ngabe|iraca/.test(name)) {
                    pack = [`${adp}/products/31-CG10.png?v=1675868018`, `${adp}/products/02-TC01.png?v=1672263174`];
                } else if (/mola/.test(name)) {
                    pack = packs.user_1;
                } else {
                    pack = byCategory[product.category] || packs.user_1;
                }
            }
            product.mainImage = pack[0];
            product.images = pack.slice();
            changed = true;
        });
        return changed;
    }

    // Load comparison list from localStorage
    loadComparisonList() {
        const storedComparison = localStorage.getItem('artesana_comparison_list');
        return storedComparison ? JSON.parse(storedComparison) : [];
    }

    // Load favorites from localStorage
    loadFavorites() {
        const storedFavorites = localStorage.getItem('artesana_favorites');
        if (!storedFavorites) return [];
        try {
            const parsed = JSON.parse(storedFavorites);
            return Array.isArray(parsed) ? parsed.map((id) => String(id)) : [];
        } catch (e) {
            return [];
        }
    }

    // Save user products to localStorage
    saveUserProducts() {
        localStorage.setItem('artesana_user_products', JSON.stringify(this.userProducts));
    }

    // Save comparison list to localStorage
    saveComparisonList() {
        localStorage.setItem('artesana_comparison_list', JSON.stringify(this.comparisonList));
    }

    // Save favorites to localStorage
    saveFavorites() {
        localStorage.setItem('artesana_favorites', JSON.stringify(this.favorites));
    }

    // Get all user products
    getAllUserProducts() {
        return this.userProducts;
    }

    // Get user product by ID
    getUserProductById(id) {
        const sid = String(id);
        return this.userProducts.find(product => String(product.id) === sid);
    }

    // Add new user product
    addUserProduct(productData) {
        const currentUser = window.localDB?.getCurrentUser();
        const ownerId = productData.sellerId ?? productData.userId ?? currentUser?.id;

        const newProduct = {
            ...productData,
            id: productData.id || `user_${Date.now()}`,
            sellerId: ownerId,
            userId: ownerId,
            createdAt: productData.createdAt || new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            isUserProduct: true,
            publicationStatus: productData.publicationStatus || 'active',
            tags: Array.isArray(productData.tags) ? productData.tags : [],
            rating: productData.rating ?? 0,
            reviews: productData.reviews ?? 0,
            featured: productData.featured ?? false,
            stock: productData.stock ?? 1
        };

        this.userProducts.push(newProduct);
        this.saveUserProducts();
        return newProduct;
    }

    // Update user product
    updateUserProduct(id, updates, ownerId) {
        const productIndex = this.userProducts.findIndex(p => p.id === id);
        if (productIndex === -1) return null;

        if (ownerId != null && String(this.userProducts[productIndex].userId) !== String(ownerId)) {
            return null;
        }

        this.userProducts[productIndex] = {
            ...this.userProducts[productIndex],
            ...updates,
            updatedAt: new Date().toISOString()
        };
        this.saveUserProducts();
        return this.userProducts[productIndex];
    }

    // Soft-delete user product (marks as deleted, keeps cart referential integrity)
    softDeleteUserProduct(id, ownerId) {
        return this.updateUserProduct(id, { publicationStatus: 'deleted' }, ownerId);
    }

    // Hard delete user product
    deleteUserProduct(id, ownerId) {
        const product = this.getUserProductById(id);
        if (!product) return false;
        if (ownerId != null && String(product.userId) !== String(ownerId)) return false;

        this.userProducts = this.userProducts.filter(p => p.id !== id);
        this.saveUserProducts();
        this.removeFromComparison(id);
        this.removeFromFavorites(id);
        return true;
    }

    notifyFavoritesChanged() {
        try {
            window.dispatchEvent(new CustomEvent('artesana:favorites-changed', {
                detail: { count: this.favorites.length }
            }));
        } catch (e) { /* ignore */ }
    }

    /** Productos visibles públicamente en Explore (activos) */
    getPublicProducts() {
        const userPublic = this.userProducts.filter((p) => {
            const status = p.publicationStatus || 'active';
            return status === 'active';
        });
        const marketplace = (window.productsDB && window.productsDB.getAllProducts)
            ? window.productsDB.getAllProducts()
            : [];
        const all = [...userPublic, ...marketplace];
        return all.sort((a, b) => {
            const aFeatured = a.tags && a.tags.includes('featured') ? 1 : 0;
            const bFeatured = b.tags && b.tags.includes('featured') ? 1 : 0;
            if (bFeatured !== aFeatured) return bFeatured - aFeatured;
            return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        });
    }

    /** Comprueba si un producto es visible públicamente */
    isProductPublic(product) {
        if (!product) return false;
        if (!product.isUserProduct) return true;
        return (product.publicationStatus || 'active') === 'active';
    }

    // Get products by category
    getUserProductsByCategory(category) {
        return this.userProducts.filter(product => product.category === category);
    }

    // Get featured user products
    getFeaturedUserProducts() {
        return this.userProducts.filter(product => product.featured);
    }

    // Search user products
    searchUserProducts(query) {
        const searchTerm = query.toLowerCase();
        return this.userProducts.filter(product => 
            product.name.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm) ||
            (product.artisan && product.artisan.name.toLowerCase().includes(searchTerm)) ||
            (product.tags || []).some(tag => tag.toLowerCase().includes(searchTerm))
        );
    }

    // COMPARISON SYSTEM
    // Add to comparison
    addToComparison(productId) {
        if (!this.comparisonList.includes(productId)) {
            this.comparisonList.push(productId);
            this.saveComparisonList();
            return true;
        }
        return false;
    }

    // Remove from comparison
    removeFromComparison(productId) {
        this.comparisonList = this.comparisonList.filter(id => id !== productId);
        this.saveComparisonList();
    }

    // Get comparison products
    getComparisonProducts() {
        const allProducts = [...this.userProducts, ...window.productsDB.getAllProducts()];
        return this.comparisonList.map(id => allProducts.find(p => p.id === id)).filter(Boolean);
    }

    // Check if product is in comparison
    isInComparison(productId) {
        return this.comparisonList.includes(productId);
    }

    // Clear comparison list
    clearComparison() {
        this.comparisonList = [];
        this.saveComparisonList();
    }

    // FAVORITES SYSTEM
    // Add to favorites
    addToFavorites(productId) {
        const id = String(productId);
        if (!this.isInFavorites(id)) {
            this.favorites.push(id);
            this.saveFavorites();
            this.notifyFavoritesChanged();
            return true;
        }
        return false;
    }

    // Remove from favorites
    removeFromFavorites(productId) {
        const id = String(productId);
        this.favorites = this.favorites.filter(fav => String(fav) !== id);
        this.saveFavorites();
        this.notifyFavoritesChanged();
    }

    // Get favorite products
    getFavoriteProducts() {
        const marketplace = (window.productsDB && window.productsDB.getAllProducts)
            ? window.productsDB.getAllProducts()
            : [];
        const allProducts = [...this.userProducts, ...marketplace];
        return this.favorites
            .map(id => allProducts.find(p => String(p.id) === String(id)))
            .filter(Boolean);
    }

    // Check if product is in favorites
    isInFavorites(productId) {
        return this.favorites.some(id => String(id) === String(productId));
    }

    // Clear favorites
    clearFavorites() {
        this.favorites = [];
        this.saveFavorites();
    }

    // Get all products (user products + marketplace products)
    getAllProducts() {
        const all = [...this.userProducts, ...window.productsDB.getAllProducts()];
        return all.sort((a, b) => {
            const aFeatured = a.tags && a.tags.includes('featured') ? 1 : 0;
            const bFeatured = b.tags && b.tags.includes('featured') ? 1 : 0;
            return bFeatured - aFeatured;
        });
    }

    // Get product by ID (from both sources) — oculta eliminados/inactivos salvo uso interno
    getProductById(id, options = {}) {
        const userProduct = this.getUserProductById(id);
        if (userProduct) {
            if (!options.includeHidden && !this.isProductPublic(userProduct)) return null;
            return userProduct;
        }
        return window.productsDB.getProductById(id);
    }

    // Get products by category (from both sources)
    getProductsByCategory(category) {
        const userProducts = this.getUserProductsByCategory(category);
        const marketplaceProducts = window.productsDB.getProductsByCategory(category);
        return [...userProducts, ...marketplaceProducts];
    }

    // Get featured products (from both sources)
    getFeaturedProducts() {
        const userFeatured = this.getFeaturedUserProducts();
        const marketplaceFeatured = window.productsDB.getFeaturedProducts();
        return [...userFeatured, ...marketplaceFeatured];
    }

    // Search all products (from both sources)
    searchAllProducts(query) {
        const userResults = this.searchUserProducts(query);
        const marketplaceResults = window.productsDB.searchProducts(query);
        return [...userResults, ...marketplaceResults];
    }

    // Reset database to sample data
    resetToSampleData() {
        localStorage.removeItem('artesana_user_products');
        localStorage.removeItem('artesana_comparison_list');
        localStorage.removeItem('artesana_favorites');
        this.userProducts = this.loadUserProducts();
        this.comparisonList = this.loadComparisonList();
        this.favorites = this.loadFavorites();
    }

    // Get user's own products
    getUserOwnProducts(userId) {
        return this.userProducts.filter(product =>
            String(product.userId) === String(userId) || String(product.sellerId) === String(userId)
        );
    }

    // Get products by artisan
    getProductsByArtisan(artisanId) {
        return this.userProducts.filter(product => product.artisan.id === artisanId);
    }

    // Get recent products
    getRecentProducts(limit = 10) {
        return this.userProducts
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, limit);
    }

    // Get popular products (by rating)
    getPopularProducts(limit = 10) {
        return this.userProducts
            .sort((a, b) => b.rating - a.rating)
            .slice(0, limit);
    }

    // Get products by price range
    getProductsByPriceRange(minPrice, maxPrice) {
        return this.userProducts.filter(product => 
            product.price >= minPrice && product.price <= maxPrice
        );
    }

    // Get products by tags
    getProductsByTags(tags) {
        return this.userProducts.filter(product => 
            tags.some(tag => product.tags.includes(tag))
        );
    }
}

// Create global instance
window.userProductsDB = new UserProductsDatabase();
window.UserProductsDatabase = UserProductsDatabase;

(function bindFavoriteClicks() {
    const paintHeart = (btn, on) => {
        if (!btn) return;
        btn.classList.toggle('fav-on', on);
        const icon = btn.querySelector('.fa-heart') || btn;
        icon.classList.toggle('fav-on', on);
        if (icon.style) icon.style.color = on ? '#e74c3c' : '';
    };

    const resolveId = (btn) => {
        const icon = btn.querySelector('.fa-heart');
        return btn.getAttribute('data-fav-id')
            || btn.getAttribute('data-product-id')
            || (icon && icon.id ? icon.id.replace(/^favorite-/, '') : '');
    };

    document.addEventListener('click', (event) => {
        const btn = event.target.closest('.home-fav, .action-btn');
        if (!btn || btn.classList.contains('add-to-cart-btn')) return;
        if (!btn.classList.contains('home-fav') && !btn.querySelector('.fa-heart')) return;
        if (btn.querySelector('.fa-balance-scale')) return;
        if (!window.userProductsDB) return;

        const productId = resolveId(btn);
        if (!productId) return;

        event.preventDefault();
        event.stopPropagation();

        const wasOn = window.userProductsDB.isInFavorites(productId);
        if (wasOn) window.userProductsDB.removeFromFavorites(productId);
        else window.userProductsDB.addToFavorites(productId);
        const nowOn = window.userProductsDB.isInFavorites(productId);
        paintHeart(btn, nowOn);
        window.ecommerceConfirmation?.showFavoriteConfirmation?.(productId, nowOn);
    }, true);

    const syncHearts = () => {
        if (!window.userProductsDB) return;
        document.querySelectorAll('.home-fav[data-fav-id], .action-btn[data-fav-id]').forEach((btn) => {
            paintHeart(btn, window.userProductsDB.isInFavorites(resolveId(btn)));
        });
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', syncHearts);
    } else {
        syncHearts();
    }
    window.addEventListener('artesana:favorites-changed', syncHearts);
})(); 