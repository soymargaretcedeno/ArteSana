/**

 * Add to Cart desde tarjetas de producto — botón amarillo + modal verde.

 */

(function (global) {

    'use strict';



    function esc(value) {

        if (global.SecurityUtils?.escapeHtml) return global.SecurityUtils.escapeHtml(value);

        const node = document.createElement('div');

        node.textContent = String(value ?? '');

        return node.innerHTML;

    }



    function isOwnProduct(product) {

        const user = global.localDB?.getCurrentUser();

        if (!user || !product) return false;

        return String(product.userId) === String(user.id) || String(product.sellerId) === String(user.id);

    }



    function getProduct(productId) {

        if (global.userProductsDB?.getProductById) {

            return global.userProductsDB.getProductById(productId);

        }

        return global.productsDB?.getProductById(productId) || null;

    }



    function closeCartModal() {

        const modal = document.querySelector('.cart-options-modal');

        if (!modal) return;

        modal.remove();

        if (!document.querySelector('.cart-options-modal')) {

            document.body.style.overflow = '';

        }

    }



    function showCartOptionsModal(productName) {

        closeCartModal();



        const modal = document.createElement('div');

        modal.className = 'cart-options-modal';

        modal.setAttribute('role', 'dialog');

        modal.setAttribute('aria-modal', 'true');

        modal.setAttribute('aria-labelledby', 'cartAddedTitle');

        modal.innerHTML = `

            <div class="modal-content">

                <div class="modal-header">

                    <h4 id="cartAddedTitle">Product Added!</h4>

                    <button type="button" class="close-btn" aria-label="Close">

                        <i class="fas fa-times"></i>

                    </button>

                </div>

                <div class="modal-body">

                    <p>"${esc(productName)}" has been added to cart!</p>

                    <div class="cart-options">

                        <button type="button" class="btn btn-primary cart-modal-view">

                            <i class="fas fa-shopping-cart"></i> View Cart

                        </button>

                        <button type="button" class="btn btn-outline-primary cart-modal-continue">

                            <i class="fas fa-shopping-bag"></i> Continue Shopping

                        </button>

                    </div>

                </div>

            </div>`;



        document.body.appendChild(modal);

        document.body.style.overflow = 'hidden';



        modal.querySelector('.close-btn').addEventListener('click', closeCartModal);

        modal.querySelector('.cart-modal-view').addEventListener('click', () => {

            global.location.href = 'cart.html';

        });

        modal.querySelector('.cart-modal-continue').addEventListener('click', closeCartModal);

        modal.addEventListener('click', (e) => {

            if (e.target === modal) closeCartModal();

        });

    }



    function markButtonAdded(evt) {

        const cartBtn = evt?.target?.closest?.('.add-to-cart-btn');

        if (!cartBtn) return;

        cartBtn.innerHTML = '<i class="fas fa-check"></i>';

        cartBtn.classList.add('added');

        setTimeout(() => {

            cartBtn.innerHTML = '<i class="fas fa-shopping-cart"></i>';

            cartBtn.classList.remove('added');

        }, 1800);

    }



    function addToCartFromCard(productId, evt) {

        if (evt) {

            evt.stopPropagation();

            evt.preventDefault();

        }



        const product = getProduct(productId);

        if (!product) {

            alert('Producto no encontrado');

            return false;

        }

        if (isOwnProduct(product)) {

            return false;

        }



        const success = global.productsDB?.addToCart(productId, 1);

        if (!success) {

            alert('Error al agregar producto al carrito');

            return false;

        }



        markButtonAdded(evt);

        global.productsDB.updateCartCount();

        global.ecommerceConfirmation?.updateCartBadge();

        showCartOptionsModal(product.name);

        return true;

    }



    global.ProductCardCart = {

        addToCartFromCard,

        showCartOptionsModal,

        closeCartModal,

        isOwnProduct

    };



    global.addToCartFromCard = addToCartFromCard;

})(window);


