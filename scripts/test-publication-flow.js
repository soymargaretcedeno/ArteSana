/**
 * Prueba E2E del flujo: Crear publicación → Explore → Detalle → Carrito
 * Ejecutar: node scripts/test-publication-flow.js
 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.join(__dirname, '..');

function createMockElement() {
    return {
        textContent: '',
        innerHTML: '',
        src: '',
        onload: null,
        onerror: null,
        appendChild: () => {},
        classList: { add: () => {}, remove: () => {}, toggle: () => {} }
    };
}

function createStorage() {
    const map = new Map();
    return {
        getItem: (k) => (map.has(k) ? map.get(k) : null),
        setItem: (k, v) => map.set(k, String(v)),
        removeItem: (k) => map.delete(k),
        _dump: () => Object.fromEntries(map)
    };
}

function loadScript(file, context) {
    const code = fs.readFileSync(path.join(root, file), 'utf8');
    vm.runInContext(code, context, { filename: file });
}

function setupContext() {
    const localStorage = createStorage();
    const document = {
        dispatchEvent: () => {},
        querySelector: () => null,
        querySelectorAll: () => [],
        createElement: () => createMockElement(),
        head: { appendChild: () => {} },
        body: { appendChild: () => {}, dataset: {} }
    };

    const context = {
        console,
        localStorage,
        document,
        window: {},
        setTimeout,
        clearTimeout,
        Date,
        JSON,
        parseInt,
        Number,
        String,
        Array,
        Math,
        isNaN,
        CustomEvent: class CustomEvent {
            constructor(type, opts = {}) {
                this.type = type;
                this.detail = opts.detail;
            }
        },
        translations: { es: {}, en: {} }
    };
    context.window = context;
    return vm.createContext(context);
}

function assert(cond, msg) {
    if (!cond) throw new Error('FAIL: ' + msg);
}

function run() {
    const ctx = setupContext();

    loadScript('js/local-database.js', ctx);
    loadScript('js/products-database.js', ctx);
    loadScript('js/user-products-database.js', ctx);
    loadScript('components/roles/role-service.js', ctx);
    loadScript('components/store/store-service.js', ctx);

    const { localStorage, window } = ctx;

    // Limpiar productos de prueba previos
    localStorage.removeItem('artesana_user_products');

    // Vendedor A
    const userA = {
        id: 'seller_a',
        name: 'Vendedor A Test',
        email: 'a@test.com',
        role: 'artisan',
        roleSelected: true,
        avatar: 'data:image/png;base64,aaa',
        location: 'Panamá'
    };
    localStorage.setItem('artesana_users', JSON.stringify([userA]));
    localStorage.setItem('artesana_current_user', JSON.stringify(userA));
    localStorage.setItem('myStore', JSON.stringify({
        name: 'Tienda A',
        location: 'Panamá',
        userId: 'seller_a',
        photo: ''
    }));

    window.localDB = new window.LocalDatabase();
    window.userProductsDB = new window.UserProductsDatabase();
    window.productsDB = new window.ProductsDatabase();

    const imageData = 'data:image/jpeg;base64,/9j/4AAQSkZJRg==';

    const resultA = window.StoreService.publishProduct({
        images: [imageData, imageData + '2'],
        title: 'Sombrero pintado fino',
        price: '85',
        category: 'textiles',
        productCondition: 'Manualidad',
        description: 'Sombrero artesanal pintado a mano.',
        location: 'Panamá',
        materials: 'Fibra natural',
        technique: 'Tejido manual',
        elaborationTime: '2 semanas',
        dimensions: '30 × 20 cm',
        culturalStory: 'Pieza con tradición guna.'
    });

    assert(resultA.success, 'Publicación vendedor A: ' + JSON.stringify(resultA));
    const productA = resultA.product;
    assert(productA.name === 'Sombrero pintado fino', 'Título incorrecto');
    assert(productA.price === 85, 'Precio incorrecto');
    assert(productA.sellerId === 'seller_a', 'sellerId incorrecto');
    assert(productA.publicationStatus === 'active', 'Estado publicación incorrecto');
    assert(productA.mainImage === imageData, 'Imagen principal incorrecta');
    assert(productA.artisan.name === 'Vendedor A Test', 'Artesano incorrecto');

    // Mis publicaciones A
    const pubsA = window.StoreService.getSellerProducts('seller_a');
    assert(pubsA.some(p => p.id === productA.id), 'No aparece en Mis publicaciones A');

    // Explore
    const explore = window.userProductsDB.getPublicProducts();
    assert(explore.some(p => p.id === productA.id), 'No aparece en Explore');

    // Detalle
    const detail = window.userProductsDB.getProductById(productA.id);
    assert(detail && detail.description === 'Sombrero artesanal pintado a mano.', 'Detalle incorrecto');
    assert(detail.culturalStory === 'Pieza con tradición guna.', 'Historia cultural incorrecta');

    // Carrito
    const cartOk = window.productsDB.addToCart(productA.id, 1);
    assert(cartOk, 'No se pudo agregar al carrito');
    const cartItems = window.productsDB.getCartItems();
    assert(cartItems.length === 1 && cartItems[0].product.name === 'Sombrero pintado fino', 'Carrito incorrecto');

    // Persistencia F5
    const stored = JSON.parse(localStorage.getItem('artesana_user_products'));
    assert(stored.some(p => p.id === productA.id), 'No persiste en localStorage');

    // Vendedor B
    const userB = {
        id: 'seller_b',
        name: 'Vendedor B Test',
        email: 'b@test.com',
        role: 'artisan',
        roleSelected: true,
        avatar: 'data:image/png;base64,bbb'
    };
    localStorage.setItem('artesana_users', JSON.stringify([userA, userB]));
    localStorage.setItem('artesana_current_user', JSON.stringify(userB));
    localStorage.setItem('myStore', JSON.stringify({
        name: 'Tienda B',
        location: 'Colón',
        userId: 'seller_b'
    }));
    window.localDB.saveCurrentUser(userB);

    const resultB = window.StoreService.publishProduct({
        images: [imageData + 'b'],
        title: 'Collar Emberá Test',
        price: '45.50',
        category: 'jewelry',
        productCondition: 'Nuevo',
        description: 'Collar de prueba B.',
        location: 'Colón'
    });
    assert(resultB.success, 'Publicación vendedor B falló');
    const productB = resultB.product;

    const pubsA2 = window.StoreService.getSellerProducts('seller_a');
    const pubsB = window.StoreService.getSellerProducts('seller_b');
    assert(pubsA2.some(p => p.id === productA.id) && !pubsA2.some(p => p.id === productB.id), 'Aisleamiento A incorrecto');
    assert(pubsB.some(p => p.id === productB.id) && !pubsB.some(p => p.id === productA.id), 'Aisleamiento B incorrecto');

    const explore2 = window.userProductsDB.getPublicProducts();
    assert(explore2.some(p => p.id === productA.id) && explore2.some(p => p.id === productB.id), 'Ambos en Explore');

    // B no puede eliminar producto de A
    const delForbidden = window.StoreService.deletePublication(productA.id);
    assert(!delForbidden.success, 'B pudo eliminar producto de A');

    // A elimina su producto
    localStorage.setItem('artesana_current_user', JSON.stringify(userA));
    window.localDB.saveCurrentUser(userA);
    const delOk = window.StoreService.deletePublication(productA.id);
    assert(delOk.success, 'A no pudo eliminar su producto');

    const explore3 = window.userProductsDB.getPublicProducts();
    assert(!explore3.some(p => p.id === productA.id), 'Eliminado sigue en Explore');
    assert(window.userProductsDB.getProductById(productA.id) === null, 'Eliminado accesible en detalle público');

    // Carrito conserva referencia (getProductById sin filtro en productsDB)
    const cartAfterDelete = window.productsDB.getCartItems();
    assert(cartAfterDelete.length === 1, 'Carrito vaciado incorrectamente tras soft delete');

    console.log('✓ Todas las pruebas pasaron (12/12)');
    console.log('  Producto A:', productA.id);
    console.log('  Producto B:', productB.id);
}

try {
    run();
    process.exit(0);
} catch (e) {
    console.error(e.message);
    process.exit(1);
}
