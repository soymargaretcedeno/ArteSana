// Products Database for ArteSana
class ProductsDatabase {
    constructor() {
        this.products = this.loadProducts();
        this.cart = this.loadCart();
        this.wishlist = this.loadWishlist();
    }

    // Initialize with sample products
    loadProducts() {
        const storedProducts = localStorage.getItem('artesana_products');
        if (storedProducts) {
            const products = JSON.parse(storedProducts);
            if (this.upgradeLowResImages(products)) {
                localStorage.setItem('artesana_products', JSON.stringify(products));
            }
            return products;
        }

        // Sample products with rich data
        const sampleProducts = [
            {
                id: 1,
                name: "Traditional Guna Mola",
                description: "Handcrafted Guna mola with intricate traditional patterns representing the culture and heritage of Guna Yala. Each piece is unique and tells a story.",
                price: 120.00,
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
                    "https://cdn.shopify.com/s/files/1/0575/5106/1081/products/05-M1.png?v=1676999151",
                    "https://cdn.shopify.com/s/files/1/0575/5106/1081/products/05-M3.png?v=1677351029",
                    "https://cdn.shopify.com/s/files/1/0575/5106/1081/products/05-MP15.png?v=1677232737"
                ],
                mainImage: "https://cdn.shopify.com/s/files/1/0575/5106/1081/products/05-M1.png?v=1676999151",
                tags: ["featured", "traditional", "handmade"],
                stock: 5,
                dimensions: "50cm x 40cm",
                materials: ["Cotton", "Appliqué"],
                weight: "0.5kg",
                shipping: {
                    weight: 0.5,
                    dimensions: "55cm x 45cm x 2cm",
                    estimatedDays: "5-7 business days"
                },
                rating: 4.9,
                reviews: 23,
                createdAt: "2024-01-15",
                featured: true
            },
            {
                id: 2,
                name: "Emberá Beaded Necklace",
                description: "Traditional Emberá beaded necklace with cultural symbols and vibrant colors. Each bead is carefully handcrafted and arranged.",
                price: 95.00,
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
                    "https://cdn.shopify.com/s/files/1/0575/5106/1081/products/01-CH11.png?v=1676494770",
                    "https://cdn.shopify.com/s/files/1/0575/5106/1081/products/01-CH01.png?v=1676483082",
                    "https://cdn.shopify.com/s/files/1/0575/5106/1081/products/01-CH08.png?v=1676490522"
                ],
                mainImage: "https://cdn.shopify.com/s/files/1/0575/5106/1081/products/01-CH11.png?v=1676494770",
                tags: ["new", "handmade", "cultural"],
                stock: 8,
                dimensions: "45cm length",
                materials: ["Glass beads", "Cotton thread"],
                weight: "0.2kg",
                shipping: {
                    weight: 0.2,
                    dimensions: "50cm x 10cm x 5cm",
                    estimatedDays: "3-5 business days"
                },
                rating: 4.7,
                reviews: 15,
                createdAt: "2024-02-20",
                featured: false
            },
            {
                id: 3,
                name: "Traditional Ceramic Vessel",
                description: "Handcrafted ceramic vessel with traditional Panamanian designs inspired by pre-Columbian culture. Perfect for decoration or practical use.",
                price: 85.00,
                originalPrice: 100.00,
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
                    "https://cdn.shopify.com/s/files/1/0575/5106/1081/products/08-OV1.png?v=1671828992",
                    "https://cdn.shopify.com/s/files/1/0575/5106/1081/products/11-PC.png?v=1676496036",
                    "https://cdn.shopify.com/s/files/1/0575/5106/1081/products/08-OV2.png?v=1677095060"
                ],
                mainImage: "https://cdn.shopify.com/s/files/1/0575/5106/1081/products/08-OV1.png?v=1671828992",
                tags: ["featured", "traditional", "handmade"],
                stock: 3,
                dimensions: "25cm x 20cm x 15cm",
                materials: ["Clay", "Natural pigments"],
                weight: "1.2kg",
                shipping: {
                    weight: 1.5,
                    dimensions: "30cm x 25cm x 20cm",
                    estimatedDays: "7-10 business days"
                },
                rating: 4.8,
                reviews: 31,
                createdAt: "2024-01-10",
                featured: true
            },
            {
                id: 4,
                name: "Pintao Hat from Veraguas",
                description: "Traditional Pintao hat handcrafted in Veraguas using natural fibers and traditional techniques passed down through generations.",
                price: 65.00,
                originalPrice: 80.00,
                currency: "USD",
                category: "textiles",
                artisan: {
                    id: 6,
                    name: "Roberto Silva",
                    avatar: "https://randomuser.me/api/portraits/men/2.jpg",
                    store: "Veraguas Handcrafts",
                    rating: 4.6,
                    location: "Veraguas"
                },
                images: [
                    "https://cdn.shopify.com/s/files/1/0575/5106/1081/products/26-S07.png?v=1672257853",
                    "https://cdn.shopify.com/s/files/1/0575/5106/1081/products/26-S04.png?v=1672228746",
                    "https://cdn.shopify.com/s/files/1/0575/5106/1081/products/26-S10.png?v=1672247150"
                ],
                mainImage: "https://cdn.shopify.com/s/files/1/0575/5106/1081/products/26-S07.png?v=1672257853",
                tags: ["traditional", "handmade", "limited"],
                stock: 2,
                dimensions: "One size fits most",
                materials: ["Natural fibers", "Palm leaves"],
                weight: "0.3kg",
                shipping: {
                    weight: 0.4,
                    dimensions: "35cm x 35cm x 15cm",
                    estimatedDays: "5-7 business days"
                },
                rating: 4.6,
                reviews: 12,
                createdAt: "2024-03-05",
                featured: false
            },
            {
                id: 5,
                name: "Ngäbe Beadwork Bag",
                description: "Traditional Ngäbe beadwork bag with intricate patterns and cultural significance. Each bead is carefully placed by hand.",
                price: 150.00,
                originalPrice: 180.00,
                currency: "USD",
                category: "textiles",
                artisan: {
                    id: 7,
                    name: "Carlos Perez",
                    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
                    store: "Ngäbe-Buglé Creations",
                    rating: 4.9,
                    location: "Ngäbe-Buglé"
                },
                images: [
                    "https://cdn.shopify.com/s/files/1/0575/5106/1081/products/31-CG10.png?v=1675868018",
                    "https://cdn.shopify.com/s/files/1/0575/5106/1081/products/31-CG01.png?v=1675868822",
                    "https://cdn.shopify.com/s/files/1/0575/5106/1081/products/02-TC01.png?v=1672263174"
                ],
                mainImage: "https://cdn.shopify.com/s/files/1/0575/5106/1081/products/31-CG10.png?v=1675868018",
                tags: ["featured", "traditional", "handmade", "limited"],
                stock: 1,
                dimensions: "30cm x 25cm",
                materials: ["Glass beads", "Cotton fabric"],
                weight: "0.8kg",
                shipping: {
                    weight: 1.0,
                    dimensions: "35cm x 30cm x 10cm",
                    estimatedDays: "5-7 business days"
                },
                rating: 4.9,
                reviews: 8,
                createdAt: "2024-02-15",
                featured: true
            },
            {
                id: 6,
                name: "Congo Mask from Colón",
                description: "Traditional Congo mask with Afro-Antillean influence, handcrafted in Colón. Each mask is unique and represents cultural heritage.",
                price: 200.00,
                originalPrice: 250.00,
                currency: "USD",
                category: "sculpture",
                artisan: {
                    id: 8,
                    name: "Lisa Perez",
                    avatar: "https://randomuser.me/api/portraits/women/4.jpg",
                    store: "Colón Afroart",
                    rating: 4.8,
                    location: "Colón"
                },
                images: [
                    "https://cdn.shopify.com/s/files/1/0575/5106/1081/products/27-CT04.png?v=1671742287",
                    "https://cdn.shopify.com/s/files/1/0575/5106/1081/products/27-CT02.png?v=1671739373",
                    "https://cdn.shopify.com/s/files/1/0575/5106/1081/products/17-MT01.png?v=1672180240"
                ],
                mainImage: "https://cdn.shopify.com/s/files/1/0575/5106/1081/products/27-CT04.png?v=1671742287",
                tags: ["featured", "traditional", "handmade", "cultural"],
                stock: 2,
                dimensions: "40cm x 30cm x 15cm",
                materials: ["Wood", "Natural pigments"],
                weight: "1.5kg",
                shipping: {
                    weight: 2.0,
                    dimensions: "45cm x 35cm x 20cm",
                    estimatedDays: "7-10 business days"
                },
                rating: 4.8,
                reviews: 5,
                createdAt: "2024-01-25",
                featured: true
            }
        ];

        // Save to localStorage
        localStorage.setItem('artesana_products', JSON.stringify(sampleProducts));
        return sampleProducts;
    }

    upgradeLowResImages(products) {
        if (!Array.isArray(products)) return false;
        const adp = 'https://cdn.shopify.com/s/files/1/0575/5106/1081';
        const packs = {
            1: [`${adp}/products/05-M1.png?v=1676999151`, `${adp}/products/05-M3.png?v=1677351029`, `${adp}/products/05-MP15.png?v=1677232737`],
            2: [`${adp}/products/01-CH11.png?v=1676494770`, `${adp}/products/01-CH01.png?v=1676483082`, `${adp}/products/01-CH08.png?v=1676490522`],
            3: [`${adp}/products/08-OV1.png?v=1671828992`, `${adp}/products/11-PC.png?v=1676496036`, `${adp}/products/08-OV2.png?v=1677095060`],
            4: [`${adp}/products/26-S07.png?v=1672257853`, `${adp}/products/26-S04.png?v=1672228746`, `${adp}/products/26-S10.png?v=1672247150`],
            5: [`${adp}/products/31-CG10.png?v=1675868018`, `${adp}/products/31-CG01.png?v=1675868822`, `${adp}/products/02-TC01.png?v=1672263174`],
            6: [`${adp}/products/27-CT04.png?v=1671742287`, `${adp}/products/27-CT02.png?v=1671739373`, `${adp}/products/17-MT01.png?v=1672180240`]
        };
        const byCategory = { textiles: packs[1], jewelry: packs[2], ceramics: packs[3], sculpture: packs[6] };
        const isCatalog = (url) => typeof url === 'string' && url.includes('cdn.shopify.com/s/files/1/0575/5106/1081');
        const isProtected = (url) => typeof url === 'string' && /^(data:|blob:)/i.test(url);
        let changed = false;
        products.forEach((product) => {
            if (!product || isProtected(product.mainImage)) return;
            if (isCatalog(product.mainImage) && Array.isArray(product.images) && product.images.every(isCatalog)) return;
            const name = `${product.name || ''} ${product.id || ''}`.toLowerCase();
            let pack = packs[product.id];
            if (!pack) {
                if (/sombrero|hat|pintao|pinta/.test(name)) pack = packs[4];
                else if (/bolso|bag|ngäbe|ngabe|iraca|chácara|chacara|tulo/.test(name)) pack = packs[5];
                else if (/mola/.test(name)) pack = packs[1];
                else pack = byCategory[product.category] || packs[1];
            }
            product.mainImage = pack[0];
            product.images = pack.slice();
            changed = true;
        });
        return changed;
    }

    // Load cart from localStorage
    loadCart() {
        const storedCart = localStorage.getItem('artesana_cart');
        return storedCart ? JSON.parse(storedCart) : [];
    }

    // Load wishlist from localStorage
    loadWishlist() {
        const storedWishlist = localStorage.getItem('artesana_wishlist');
        return storedWishlist ? JSON.parse(storedWishlist) : [];
    }

    // Save cart to localStorage
    saveCart() {
        localStorage.setItem('artesana_cart', JSON.stringify(this.cart));
        this.updateCartCount();
    }

    // Save wishlist to localStorage
    saveWishlist() {
        localStorage.setItem('artesana_wishlist', JSON.stringify(this.wishlist));
    }

    // Get all products
    getAllProducts() {
        return this.products;
    }

    // Get product by ID (marketplace + publicaciones de vendedores)
    getProductById(id) {
        if (window.userProductsDB) {
            const userProduct = window.userProductsDB.getUserProductById(id);
            if (userProduct) return userProduct;
        }
        if (window.PublicStoreService && String(id).indexOf('storeprod-') === 0) {
            const fromStore = window.PublicStoreService.getProductById(id);
            if (fromStore) return fromStore;
        }
        const numId = parseInt(id, 10);
        if (Number.isNaN(numId)) {
            return window.PublicStoreService?.getProductById(id) || undefined;
        }
        return this.products.find(product => product.id === numId);
    }

    // Get products by category
    getProductsByCategory(category) {
        return this.products.filter(product => product.category === category);
    }

    // Get featured products
    getFeaturedProducts() {
        return this.products.filter(product => product.featured);
    }

    // Search products
    searchProducts(query) {
        const searchTerm = query.toLowerCase();
        return this.products.filter(product => 
            product.name.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm) ||
            product.artisan.name.toLowerCase().includes(searchTerm) ||
            product.tags.some(tag => tag.toLowerCase().includes(searchTerm))
        );
    }

    // Add to cart
    addToCart(productId, quantity = 1) {
        const product = this.getProductById(productId);
        if (!product) return false;

        const existingItem = this.cart.find(item => String(item.productId) === String(productId));
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.cart.push({
                productId: productId,
                quantity: quantity,
                addedAt: new Date().toISOString()
            });
        }

        this.saveCart();
        return true;
    }

    // Remove from cart
    removeFromCart(productId) {
        this.cart = this.cart.filter(item => String(item.productId) !== String(productId));
        this.saveCart();
    }

    // Update cart item quantity
    updateCartQuantity(productId, quantity) {
        const item = this.cart.find(item => String(item.productId) === String(productId));
        if (item) {
            if (quantity <= 0) {
                this.removeFromCart(productId);
            } else {
                item.quantity = quantity;
                this.saveCart();
            }
        }
    }

    // Get cart items with product details
    getCartItems() {
        return this.cart.map(item => {
            const product = this.getProductById(item.productId);
            return {
                ...item,
                product: product
            };
        }).filter(item => item.product); // Remove items with invalid products
    }

    // Get cart total
    getCartTotal() {
        return this.getCartItems().reduce((total, item) => {
            return total + (item.product.price * item.quantity);
        }, 0);
    }

    // Get cart count
    getCartCount() {
        return this.cart.reduce((count, item) => count + item.quantity, 0);
    }

    // Clear cart
    clearCart() {
        this.cart = [];
        this.saveCart();
    }

    // Add to wishlist
    addToWishlist(productId) {
        if (!this.wishlist.includes(productId)) {
            this.wishlist.push(productId);
            this.saveWishlist();
        }
    }

    // Remove from wishlist
    removeFromWishlist(productId) {
        this.wishlist = this.wishlist.filter(id => id !== productId);
        this.saveWishlist();
    }

    // Check if product is in wishlist
    isInWishlist(productId) {
        return this.wishlist.includes(productId);
    }

    // Get wishlist items
    getWishlistItems() {
        return this.wishlist.map(id => this.getProductById(id)).filter(Boolean);
    }

    // Update cart count in header
    updateCartCount() {
        const cartCount = this.getCartCount();
        const cartBadges = document.querySelectorAll('.cart-count, .nav-buttons .badge');
        cartBadges.forEach(badge => {
            badge.textContent = cartCount;
            badge.style.display = cartCount > 0 ? 'inline' : 'none';
        });
        document.querySelectorAll('header-user-component, header-component').forEach((el) => {
            if (typeof el.updateCartCount === 'function') el.updateCartCount();
        });
    }

    // Calculate shipping cost
    calculateShipping(cartItems, country = 'Panamá') {
        const totalWeight = cartItems.reduce((weight, item) => {
            return weight + ((Number(item.product?.shipping?.weight) || 0.5) * item.quantity);
        }, 0);

        let baseShipping = 12; // Default shipping cost

        if (country === 'Panamá') {
            baseShipping = 8;
        } else if (country === 'Costa Rica') {
            baseShipping = 15;
        } else if (country === 'Colombia') {
            baseShipping = 20;
        } else {
            baseShipping = 25; // International
        }

        // Add weight-based cost
        const weightCost = Math.ceil(totalWeight) * 2;
        
        return baseShipping + weightCost;
    }

    // Apply discount
    applyDiscount(code, subtotal) {
        const validCodes = {
            'ARTESANA10': 10,
            'WELCOME20': 20,
            'PANAMA15': 15
        };

        const discount = validCodes[code.toUpperCase()];
        if (discount) {
            return (subtotal * discount) / 100;
        }
        return 0;
    }

    // Create order
    createOrder(cartItems, shippingInfo, paymentInfo) {
        const currentUser = window.localDB?.getCurrentUser?.();
        const order = {
            id: Date.now(),
            userId: currentUser?.id ?? null,
            items: cartItems,
            subtotal: this.getCartTotal(),
            shipping: this.calculateShipping(cartItems, shippingInfo.country),
            tax: this.getCartTotal() * 0.07, // 7% tax
            total: 0,
            shippingInfo: shippingInfo,
            paymentInfo: paymentInfo,
            status: 'pending',
            statusLabel: 'Pendiente',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString().slice(0, 10),
            estimatedDelivery: this.calculateEstimatedDelivery(shippingInfo.country)
        };

        order.total = order.subtotal + order.shipping + order.tax;

        // Save order to localStorage
        const orders = JSON.parse(localStorage.getItem('artesana_orders') || '[]');
        orders.push(order);
        localStorage.setItem('artesana_orders', JSON.stringify(orders));

        // Clear cart after successful order
        this.clearCart();

        return order;
    }

    // Calculate estimated delivery
    calculateEstimatedDelivery(country) {
        const today = new Date();
        let daysToAdd = 7; // Default

        if (country === 'Panamá') {
            daysToAdd = 3;
        } else if (country === 'Costa Rica') {
            daysToAdd = 5;
        } else if (country === 'Colombia') {
            daysToAdd = 7;
        } else {
            daysToAdd = 14; // International
        }

        const deliveryDate = new Date(today);
        deliveryDate.setDate(today.getDate() + daysToAdd);
        return deliveryDate.toISOString();
    }

    // Get user orders
    getUserOrders() {
        const orders = JSON.parse(localStorage.getItem('artesana_orders') || '[]');
        return orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    // Reset database to sample data
    resetToSampleData() {
        localStorage.removeItem('artesana_products');
        localStorage.removeItem('artesana_cart');
        localStorage.removeItem('artesana_wishlist');
        this.products = this.loadProducts();
        this.cart = this.loadCart();
        this.wishlist = this.loadWishlist();
    }
}

// Create global instance
window.productsDB = new ProductsDatabase();

// Export for use in other modules
window.ProductsDatabase = ProductsDatabase; 