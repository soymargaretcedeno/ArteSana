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
            return JSON.parse(storedProducts);
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
                    "https://i.pinimg.com/236x/3c/b4/34/3cb43405e2743c559af87e7f52a45e9b.jpg",
                    "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&crop=center",
                    "https://www.gunayala.org/wp-content/uploads/2019/07/mola-guna.jpg"
                ],
                mainImage: "https://i.pinimg.com/236x/3c/b4/34/3cb43405e2743c559af87e7f52a45e9b.jpg",
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
                    "https://i.etsystatic.com/19591055/r/il/9d752b/3083844437/il_fullxfull.3083844437_eh8s.jpg",
                                    "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop&crop=center",
                "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&crop=center"
                ],
                mainImage: "https://i.etsystatic.com/19591055/r/il/9d752b/3083844437/il_fullxfull.3083844437_eh8s.jpg",
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
                    "https://th.bing.com/th/id/R.1b32c1b2827ba4e4c84550d131b11ce4?rik=j8%2fbx0mUWFBkdw&riu=http%3a%2f%2fwww.diaadia.com.pa%2fsites%2fdefault%2ffiles%2f2022-01%2fvidreadas+1.jpg&ehk=Mp0CZwpLdt5L8v3kKSB4zV92l4DI310G73oTkUgtWRA%3d&risl=&pid=ImgRaw&r=0",
                                    "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop&crop=center",
                "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&crop=center"
                ],
                mainImage: "https://th.bing.com/th/id/R.1b32c1b2827ba4e4c84550d131b11ce4?rik=j8%2fbx0mUWFBkdw&riu=http%3a%2f%2fwww.diaadia.com.pa%2fsites%2fdefault%2ffiles%2f2022-01%2fvidreadas+1.jpg&ehk=Mp0CZwpLdt5L8v3kKSB4zV92l4DI310G73oTkUgtWRA%3d&risl=&pid=ImgRaw&r=0",
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
                    "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&crop=center",
                    "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop&crop=center"
                ],
                mainImage: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&crop=center",
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
                    "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop&crop=center",
                    "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&crop=center"
                ],
                mainImage: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop&crop=center",
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
                    "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&crop=center",
                    "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800&h=600&fit=crop&crop=center"
                ],
                mainImage: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&crop=center",
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

        const existingItem = this.cart.find(item => item.productId === productId);
        
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
        this.cart = this.cart.filter(item => item.productId !== productId);
        this.saveCart();
    }

    // Update cart item quantity
    updateCartQuantity(productId, quantity) {
        const item = this.cart.find(item => item.productId === productId);
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
    }

    // Calculate shipping cost
    calculateShipping(cartItems, country = 'Panamá') {
        const totalWeight = cartItems.reduce((weight, item) => {
            return weight + (item.product.shipping.weight * item.quantity);
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
        const order = {
            id: Date.now(),
            items: cartItems,
            subtotal: this.getCartTotal(),
            shipping: this.calculateShipping(cartItems, shippingInfo.country),
            tax: this.getCartTotal() * 0.07, // 7% tax
            total: 0,
            shippingInfo: shippingInfo,
            paymentInfo: paymentInfo,
            status: 'pending',
            createdAt: new Date().toISOString(),
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