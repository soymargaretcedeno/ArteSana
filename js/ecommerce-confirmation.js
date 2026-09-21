// E-commerce Confirmation System for ArteSana
// This file provides enhanced confirmation functionality and visual feedback

class EcommerceConfirmation {
    constructor() {
        this.init();
    }

    init() {
        // Add global confirmation methods
        window.showEnhancedToast = this.showEnhancedToast.bind(this);
        window.showCartConfirmation = this.showCartConfirmation.bind(this);
        window.showFavoriteConfirmation = this.showFavoriteConfirmation.bind(this);
        window.showComparisonConfirmation = this.showComparisonConfirmation.bind(this);
        window.updateCartBadge = this.updateCartBadge.bind(this);
    }

    // Enhanced toast notification with better styling
    showEnhancedToast(message, type = 'success', duration = 3000) {
        const toast = document.createElement('div');
        toast.className = `enhanced-toast ${type}`;
        
        const icon = this.getIconForType(type);
        
        toast.innerHTML = `
            <div class="toast-content">
                <i class="${icon}"></i>
                <span>${message}</span>
            </div>
            <div class="toast-progress"></div>
        `;
        
        // Add styles
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${this.getBackgroundColor(type)};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.2);
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 350px;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            font-weight: 500;
        `;
        
        // Add progress bar styles
        const progressBar = toast.querySelector('.toast-progress');
        progressBar.style.cssText = `
            position: absolute;
            bottom: 0;
            left: 0;
            height: 3px;
            background: rgba(255,255,255,0.3);
            width: 100%;
            border-radius: 0 0 12px 12px;
            overflow: hidden;
        `;
        
        const progressFill = document.createElement('div');
        progressFill.style.cssText = `
            height: 100%;
            background: rgba(255,255,255,0.8);
            width: 100%;
            transform: translateX(-100%);
            transition: transform ${duration}ms linear;
        `;
        progressBar.appendChild(progressFill);
        
        document.body.appendChild(toast);

        // Animate in
        setTimeout(() => {
            toast.style.transform = 'translateX(0)';
            progressFill.style.transform = 'translateX(0)';
        }, 100);

        // Animate out
        setTimeout(() => {
            toast.style.transform = 'translateX(100%)';
            setTimeout(() => toast.remove(), 300);
        }, duration);
    }

    // Cart confirmation with enhanced feedback
    showCartConfirmation(productId, quantity = 1) {
        const product = window.userProductsDB.getProductById(productId) || window.productsDB.getProductById(productId);
        
        if (product) {
            this.showEnhancedToast(
                `✅ ${quantity}x "${product.name}" added to cart!`,
                'success',
                4000
            );
            
            // Update cart badge
            this.updateCartBadge();
            
            // Show cart preview if available
            this.showCartPreview(product, quantity);
        }
    }

    // Favorite confirmation
    showFavoriteConfirmation(productId, isAdding = true) {
        const product = window.userProductsDB?.getProductById?.(productId)
            || window.productsDB?.getProductById?.(productId);
        const name = product?.name || 'Producto';
        const message = isAdding
            ? `❤️ "${name}" added to favorites!`
            : `💔 "${name}" removed from favorites`;
        this.showEnhancedToast(message, isAdding ? 'success' : 'info', 3000);
    }

    // Comparison confirmation
    showComparisonConfirmation(productId, isAdding = true) {
        const product = window.userProductsDB.getProductById(productId) || window.productsDB.getProductById(productId);
        
        if (product) {
            const message = isAdding 
                ? `⚖️ "${product.name}" added to comparison!`
                : `❌ "${product.name}" removed from comparison`;
            
            this.showEnhancedToast(message, isAdding ? 'success' : 'info', 3000);
        }
    }

    // Update cart badge in header
    updateCartBadge() {
        const cartCount = window.productsDB.getCartCount();
        const cartBadges = document.querySelectorAll('.cart-badge, .cart-count');
        
        cartBadges.forEach(badge => {
            badge.textContent = cartCount;
            badge.style.display = cartCount > 0 ? 'block' : 'none';
            
            // Add animation
            badge.style.animation = 'cartPulse 0.5s ease';
            setTimeout(() => {
                badge.style.animation = '';
            }, 500);
        });
    }

    // Show cart preview
    showCartPreview(product, quantity) {
        const preview = document.createElement('div');
        preview.className = 'cart-preview';
        preview.innerHTML = `
            <div class="cart-preview-content">
                <img src="${product.mainImage}" alt="${product.name}" class="cart-preview-image">
                <div class="cart-preview-info">
                    <h4>${product.name}</h4>
                    <p>Quantity: ${quantity}</p>
                    <p class="cart-preview-price">$${(product.price * quantity).toFixed(2)}</p>
                </div>
                <button class="cart-preview-close" onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        preview.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            background: white;
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.15);
            z-index: 9999;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 300px;
            border: 1px solid #e0e0e0;
        `;
        
        document.body.appendChild(preview);
        
        // Animate in
        setTimeout(() => {
            preview.style.transform = 'translateX(0)';
        }, 100);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            preview.style.transform = 'translateX(100%)';
            setTimeout(() => preview.remove(), 300);
        }, 5000);
    }

    // Get icon for toast type
    getIconForType(type) {
        const icons = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            warning: 'fas fa-exclamation-triangle',
            info: 'fas fa-info-circle'
        };
        return icons[type] || icons.info;
    }

    // Get background color for toast type
    getBackgroundColor(type) {
        const colors = {
            success: '#4caf50',
            error: '#f44336',
            warning: '#ff9800',
            info: '#2196f3'
        };
        return colors[type] || colors.info;
    }

    // Enhanced add to cart function
    static enhancedAddToCart(productId, quantity = 1) {
        const success = window.productsDB.addToCart(productId, quantity);
        
        if (success) {
            window.ecommerceConfirmation.showCartConfirmation(productId, quantity);
            return true;
        } else {
            window.ecommerceConfirmation.showEnhancedToast('Failed to add product to cart', 'error');
            return false;
        }
    }

    // Enhanced toggle favorite function
    static enhancedToggleFavorite(productId) {
        const isInFavorites = window.userProductsDB.isInFavorites(productId);
        
        if (isInFavorites) {
            window.userProductsDB.removeFromFavorites(productId);
            window.ecommerceConfirmation.showFavoriteConfirmation(productId, false);
        } else {
            window.userProductsDB.addToFavorites(productId);
            window.ecommerceConfirmation.showFavoriteConfirmation(productId, true);
        }
        
        return !isInFavorites;
    }

    // Enhanced toggle comparison function
    static enhancedToggleComparison(productId) {
        const isInComparison = window.userProductsDB.isInComparison(productId);
        
        if (isInComparison) {
            window.userProductsDB.removeFromComparison(productId);
            window.ecommerceConfirmation.showComparisonConfirmation(productId, false);
        } else {
            window.userProductsDB.addToComparison(productId);
            window.ecommerceConfirmation.showComparisonConfirmation(productId, true);
        }
        
        return !isInComparison;
    }
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes cartPulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.2); }
        100% { transform: scale(1); }
    }
    
    .cart-preview-content {
        display: flex;
        align-items: center;
        padding: 1rem;
        gap: 1rem;
    }
    
    .cart-preview-image {
        width: 50px;
        height: 50px;
        object-fit: cover;
        border-radius: 8px;
    }
    
    .cart-preview-info h4 {
        margin: 0;
        font-size: 0.9rem;
        color: #333;
    }
    
    .cart-preview-info p {
        margin: 0.2rem 0;
        font-size: 0.8rem;
        color: #666;
    }
    
    .cart-preview-price {
        font-weight: bold;
        color: #a22a22 !important;
    }
    
    .cart-preview-close {
        background: none;
        border: none;
        color: #999;
        cursor: pointer;
        padding: 0.5rem;
        border-radius: 50%;
        transition: background-color 0.2s;
    }
    
    .cart-preview-close:hover {
        background-color: #f0f0f0;
        color: #666;
    }
    
    .toast-content {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }
    
    .toast-content i {
        font-size: 1.2rem;
    }
`;

document.head.appendChild(style);

// Initialize the confirmation system
window.ecommerceConfirmation = new EcommerceConfirmation();

// Export for use in other modules
window.EcommerceConfirmation = EcommerceConfirmation; 