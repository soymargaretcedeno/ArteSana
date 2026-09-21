document.addEventListener('DOMContentLoaded', function() {
    // Quantity buttons functionality
    const quantityBtns = document.querySelectorAll('.quantity-btn');
    quantityBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const input = this.parentElement.querySelector('.quantity-input');
            const currentValue = parseInt(input.value);
            
            if (this.classList.contains('plus') && currentValue < parseInt(input.max)) {
                input.value = currentValue + 1;
            } else if (this.classList.contains('minus') && currentValue > parseInt(input.min)) {
                input.value = currentValue - 1;
            }
            
            updateCartTotal();
        });
    });

    // Remove item functionality
    const removeButtons = document.querySelectorAll('.remove-item');
    removeButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const cartItem = this.closest('.cart-item');
            cartItem.style.opacity = '0';
            cartItem.style.transform = 'translateX(-20px)';
            
            setTimeout(() => {
                cartItem.remove();
                updateCartCount();
                updateCartTotal();
                checkEmptyCart();
            }, 300);
        });
    });

    // Promo code functionality
    const promoButton = document.querySelector('.promo-code button');
    promoButton.addEventListener('click', function() {
        const input = document.querySelector('.promo-code input');
        if (input.value.trim().toLowerCase() === 'artesana10') {
            applyDiscount(10);
            showToast('¡Código promocional aplicado!', 'success');
            input.value = '';
        } else {
            showToast('Código promocional inválido', 'error');
        }
    });

    // Shipping calculator
    const shippingInputs = document.querySelectorAll('.shipping-estimate input, .shipping-estimate select');
    shippingInputs.forEach(input => {
        input.addEventListener('change', calculateShipping);
    });

    // Helper functions
    function updateCartTotal() {
        const items = document.querySelectorAll('.cart-item');
        let subtotal = 0;

        items.forEach(item => {
            const price = parseFloat(item.querySelector('.current-price').textContent.replace('$', ''));
            const quantity = parseInt(item.querySelector('.quantity-input').value);
            subtotal += price * quantity;
        });

        const shipping = parseFloat(document.querySelector('.summary-item:nth-child(3) span:last-child').textContent.replace('$', ''));
        const discount = parseFloat(document.querySelector('.summary-item:nth-child(2) span:last-child').textContent.replace('$', '')) || 0;

        document.querySelector('.summary-item:first-child span:last-child').textContent = `$${subtotal.toFixed(2)}`;
        document.querySelector('.summary-item.total span:last-child').textContent = `$${(subtotal + shipping + discount).toFixed(2)}`;
    }

    function updateCartCount() {
        const itemCount = document.querySelectorAll('.cart-item').length;
        const cartCount = document.querySelector('.cart-count');
        cartCount.textContent = itemCount;

        // Update header cart count if it exists
        const headerCartCount = document.querySelector('.nav-buttons .badge');
        if (headerCartCount) {
            headerCartCount.textContent = itemCount;
        }
    }

    function checkEmptyCart() {
        const items = document.querySelectorAll('.cart-item');
        const emptyMessage = document.querySelector('.empty-cart-message');
        const cartContent = document.querySelector('.cart-items-wrapper');
        const cartSummary = document.querySelector('.cart-summary');

        if (items.length === 0) {
            emptyMessage.style.display = 'block';
            cartSummary.style.display = 'none';
        }
    }

    function applyDiscount(percentage) {
        const subtotal = parseFloat(document.querySelector('.summary-item:first-child span:last-child').textContent.replace('$', ''));
        const discountAmount = -(subtotal * (percentage / 100));
        document.querySelector('.summary-item:nth-child(2) span:last-child').textContent = `$${discountAmount.toFixed(2)}`;
        updateCartTotal();
    }

    function calculateShipping() {
        const country = document.querySelector('.shipping-estimate select').value;
        let shippingCost = 12; // Default shipping cost

        if (country === 'Panamá') {
            shippingCost = 8;
        } else if (country === 'Costa Rica') {
            shippingCost = 15;
        } else if (country === 'Colombia') {
            shippingCost = 20;
        }

        document.querySelector('.summary-item:nth-child(3) span:last-child').textContent = `$${shippingCost.toFixed(2)}`;
        updateCartTotal();
    }

    function showToast(message, type) {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('show');
        }, 100);

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // Initialize
    updateCartTotal();
}); 