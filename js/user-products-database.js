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
            return JSON.parse(storedProducts);
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
                    "https://i.pinimg.com/236x/3c/b4/34/3cb43405e2743c559af87e7f52a45e9b.jpg",
                    "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&crop=center",
                    "https://www.gunayala.org/wp-content/uploads/2019/07/mola-guna.jpg"
                ],
                mainImage: "https://i.pinimg.com/236x/3c/b4/34/3cb43405e2743c559af87e7f52a45e9b.jpg",
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
                    "https://i.etsystatic.com/19591055/r/il/9d752b/3083844437/il_fullxfull.3083844437_eh8s.jpg",
                                    "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop&crop=center",
                "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&crop=center"
                ],
                mainImage: "https://i.etsystatic.com/19591055/r/il/9d752b/3083844437/il_fullxfull.3083844437_eh8s.jpg",
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
                    "https://th.bing.com/th/id/R.1b32c1b2827ba4e4c84550d131b11ce4?rik=j8%2fbx0mUWFBkdw&riu=http%3a%2f%2fwww.diaadia.com.pa%2fsites%2fdefault%2ffiles%2f2022-01%2fvidreadas+1.jpg&ehk=Mp0CZwpLdt5L8v3kKSB4zV92l4DI310G73oTkUgtWRA%3d&risl=&pid=ImgRaw&r=0",
                                    "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop&crop=center",
                "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&crop=center"
                ],
                mainImage: "https://th.bing.com/th/id/R.1b32c1b2827ba4e4c84550d131b11ce4?rik=j8%2fbx0mUWFBkdw&riu=http%3a%2f%2fwww.diaadia.com.pa%2fsites%2fdefault%2ffiles%2f2022-01%2fvidreadas+1.jpg&ehk=Mp0CZwpLdt5L8v3kKSB4zV92l4DI310G73oTkUgtWRA%3d&risl=&pid=ImgRaw&r=0",
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

    // Load comparison list from localStorage
    loadComparisonList() {
        const storedComparison = localStorage.getItem('artesana_comparison_list');
        return storedComparison ? JSON.parse(storedComparison) : [];
    }

    // Load favorites from localStorage
    loadFavorites() {
        const storedFavorites = localStorage.getItem('artesana_favorites');
        return storedFavorites ? JSON.parse(storedFavorites) : [];
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
        return this.userProducts.find(product => product.id === id);
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

    /** Productos visibles públicamente en Explore (activos) */
    getPublicProducts() {
        const userPublic = this.userProducts.filter((p) => {
            const status = p.publicationStatus || 'active';
            return status === 'active';
        });
        const marketplace = window.productsDB.getAllProducts();
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
        if (!this.favorites.includes(productId)) {
            this.favorites.push(productId);
            this.saveFavorites();
            return true;
        }
        return false;
    }

    // Remove from favorites
    removeFromFavorites(productId) {
        this.favorites = this.favorites.filter(id => id !== productId);
        this.saveFavorites();
    }

    // Get favorite products
    getFavoriteProducts() {
        const allProducts = [...this.userProducts, ...window.productsDB.getAllProducts()];
        return this.favorites.map(id => allProducts.find(p => p.id === id)).filter(Boolean);
    }

    // Check if product is in favorites
    isInFavorites(productId) {
        return this.favorites.includes(productId);
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

// Export for use in other modules
window.UserProductsDatabase = UserProductsDatabase; 