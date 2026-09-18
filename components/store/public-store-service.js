/**
 * Catálogo público de tiendas: agrupa publicaciones y vendedores
 * para la lista de Store y el perfil de tienda.
 */
(function (global) {
    'use strict';

    const DEMO_STORES = [
        {
            id: 'artemola-guna',
            name: 'ArteMola (Guna)',
            desc: 'Colorful molas and textile art from Guna Yala.',
            location: 'Guna Yala',
            sellerName: 'Ana Díaz',
            sellerId: 1,
            avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
            rating: 4.8,
            match: { storeNames: ["ana's handcrafts", 'artemola'], locations: ['guna'], keywords: ['mola'] },
            products: [
                { img: 'https://th.bing.com/th/id/R.f48328c70497e9faba341b77b688c328?rik=LvXXMXJcW5qA%2fQ&riu=http%3a%2f%2fwww.choosepanama.com%2fuploads%2f1%2f1%2f3%2f3%2f11332995%2fmola_orig.jpg&ehk=aU4u1cYEM04G13rFXT%2bNz8GtCBFsWwve8phN4w40Drg%3d&risl=&pid=ImgRaw&r=0', name: 'Mola Textil 1', price: 85, category: 'textiles' },
                { img: 'https://i.etsystatic.com/26283200/r/il/8cb235/2802425507/il_fullxfull.2802425507_f84y.jpg', name: 'Mola Textil 2', price: 92, category: 'textiles' },
                { img: 'https://i.pinimg.com/736x/c0/63/6f/c0636f43c7b8be7e27048ee9139b15a7.jpg', name: 'Mola Textil 3', price: 78, category: 'textiles' }
            ]
        },
        {
            id: 'embera-jewelry',
            name: 'Emberá Jewelry',
            desc: 'Unique jewelry crafted by Emberá artisans.',
            location: 'Emberá-Wounaan',
            sellerName: 'María González',
            sellerId: 3,
            avatar: 'https://i.pinimg.com/736x/de/41/c8/de41c8e9fcf1c07187af9c8ade4a7a0a--colombia-gmail.jpg',
            rating: 4.9,
            match: { storeNames: ["maria's traditional crafts", 'emberá jewelry', 'embera jewelry'], locations: ['emberá', 'embera'], keywords: ['emberá', 'embera', 'collar', 'necklace'] },
            products: [
                { img: 'https://i.pinimg.com/736x/7c/d2/78/7cd278d783a5896880e9069390b527b3.jpg', name: 'Collar Emberá', price: 95, category: 'jewelry' },
                { img: 'https://th.bing.com/th/id/R.6520208e135e2aac2bec5a310c292d0e?rik=5Z9JJuzk%2fgkZlg&pid=ImgRaw&r=0', name: 'Aretes Emberá', price: 48, category: 'jewelry' },
                { img: 'https://th.bing.com/th/id/R.c5460ed9047266bb7f0b52bab3db7e6f?rik=3IMZ16TEnhBI9Q&riu=http%3a%2f%2f2.bp.blogspot.com%2f-NP8n7koDhss%2fUKezOtqE7WI%2fAAAAAAAAABU%2f-j0Pt62bi1A%2fs1600%2fjoyas.jpg&ehk=Ec0nXRI71AEomUC3ZSnSzmQhaaD1DbpOIG1f3QlKPMA%3d&risl=&pid=ImgRaw&r=0', name: 'Pulsera Emberá', price: 42, category: 'jewelry' }
            ]
        },
        {
            id: 'veraguas-handcrafts',
            name: 'Veraguas Handcrafts',
            desc: 'Handmade hats and crafts from Veraguas.',
            location: 'Veraguas',
            sellerName: 'Roberto Silva',
            sellerId: 6,
            avatar: '',
            rating: 4.6,
            match: { storeNames: ['veraguas handcrafts'], locations: ['veraguas'], keywords: ['pintao', 'veraguas'] },
            products: [
                { img: 'https://www.panamaamerica.com.pa/sites/default/files/imagenes/2015/08/03/feria_artesanias-_13.jpg', name: 'Sombrero Pintao', price: 65, category: 'textiles' },
                { img: 'https://tse4.mm.bing.net/th/id/OIP.C2ycS0SImLPXcUxkZ6QY3wHaD4?r=0&rs=1&pid=ImgDetMain&o=7&rm=3', name: 'Cestería Veraguas', price: 55, category: 'textiles' },
                { img: 'https://stories.forbestravelguide.com/wp-content/uploads/2017/10/FacelessDolls-DominicanRepublicMinistryofTourism.jpg', name: 'Muñecas artesanales', price: 40, category: 'sculpture' }
            ]
        },
        {
            id: 'chiriqui-creative',
            name: 'Chiriquí Creative',
            desc: 'Traditional crafts and textiles from Chiriquí.',
            location: 'Chiriquí',
            sellerName: 'Elena Castillo',
            sellerId: 'chiriqui',
            avatar: 'https://randomuser.me/api/portraits/women/6.jpg',
            rating: 4.5,
            match: { storeNames: ['chiriquí creative', 'chiriqui creative'], locations: ['chiriquí', 'chiriqui'], keywords: ['chiriquí', 'chiriqui'] },
            products: [
                { img: 'https://tse4.mm.bing.net/th/id/OIP.orEBHEGmEQ_kivmj57pe1wHaE9?r=0&rs=1&pid=ImgDetMain&o=7&rm=3', name: 'Textil Chiriquí', price: 70, category: 'textiles' },
                { img: 'https://1.bp.blogspot.com/-GGe3Sys9vXo/U3F02q1b0_I/AAAAAAAAACU/BGcSO6Xf6Y0/s1600/CIMG1879.JPG', name: 'Cerámica Chiriquí', price: 88, category: 'ceramics' },
                { img: 'https://i.pinimg.com/originals/1c/8d/8c/1c8d8c2afc03ee863f5db7541713db55.jpg', name: 'Tallado en madera', price: 110, category: 'sculpture' }
            ]
        },
        {
            id: 'ngabe-bugle',
            name: 'Ngäbe-Buglé Creations',
            desc: 'Traditional bags and beadwork from the Ngäbe-Buglé region.',
            location: 'Ngäbe-Buglé',
            sellerName: 'Carlos Pérez',
            sellerId: 7,
            avatar: '',
            rating: 4.9,
            match: { storeNames: ['ngäbe-buglé creations', 'ngabe-bugle creations'], locations: ['ngäbe', 'ngabe'], keywords: ['ngäbe', 'ngabe', 'chácara', 'beadwork'] },
            products: [
                { img: 'https://i.pinimg.com/originals/a5/fd/9c/a5fd9cb2238429e250fa7c640cf9409c.jpg', name: 'Chácara tradicional', price: 150, category: 'textiles' },
                { img: 'https://th.bing.com/th/id/R.03d292ccd021237079e68f4a6d3336f4?rik=63KwXcqiu%2fIGmw&riu=http%3a%2f%2fwww.panamamio.com%2fsystem%2ffiles%2fimages%2fIMG_0637.preview.jpg&ehk=8IFKdnGsAZlCrC03wEXOU%2b9%2b2orOO9Dh1JQnWYbieuk%3d&risl=&pid=ImgRaw&r=0', name: 'Chaquira Ngäbe', price: 68, category: 'jewelry' },
                { img: 'https://th.bing.com/th/id/R.8dc70dba8fbc368e5622fc883cbdc3ea?rik=so47Qftp1vL4xw&pid=ImgRaw&r=0', name: 'Bolso tejido', price: 72, category: 'textiles' }
            ]
        },
        {
            id: 'colon-afroart',
            name: 'Colón Afroart',
            desc: 'Art and accessories with Afro-Antillean influence.',
            location: 'Colón',
            sellerName: 'Lisa Pérez',
            sellerId: 8,
            avatar: 'https://randomuser.me/api/portraits/women/4.jpg',
            rating: 4.8,
            match: { storeNames: ['colón afroart', 'colon afroart'], locations: ['colón', 'colon'], keywords: ['congo', 'afro'] },
            products: [
                { img: 'https://tse2.mm.bing.net/th/id/OIP.qDOr85auzCeqS355yW2K_wHaE8?r=0&rs=1&pid=ImgDetMain&o=7&rm=3', name: 'Máscara Congo', price: 200, category: 'sculpture' },
                { img: 'https://i.etsystatic.com/24810620/r/il/b848a4/2967338314/il_680x540.2967338314_h27d.jpg', name: 'Collar afro', price: 58, category: 'jewelry' },
                { img: 'https://i.pinimg.com/736x/ed/cc/58/edcc582b7a50da41909c2c401ef31aa9--panama-canal-central-america.jpg', name: 'Turbante colorido', price: 45, category: 'textiles' }
            ]
        },
        {
            id: 'cocle-ceramics',
            name: 'Coclé Ceramics',
            desc: 'Ceramics inspired by the pre-Columbian culture of Coclé.',
            location: 'Coclé',
            sellerName: 'Isabella Torres',
            sellerId: 5,
            avatar: 'https://randomuser.me/api/portraits/women/3.jpg',
            rating: 4.7,
            match: { storeNames: ["isabella's art gallery", 'coclé ceramics', 'cocle ceramics'], locations: ['coclé', 'cocle'], keywords: ['coclé', 'cocle', 'vasija', 'ceramic'] },
            products: [
                { img: 'https://th.bing.com/th/id/R.ab11d54b5dfceab0bd417054ffaa78e7?rik=Ln7JJe57VfSCuw&pid=ImgRaw&r=0', name: 'Vasija Coclé', price: 85, category: 'ceramics' },
                { img: 'https://objectsmedia.artkhade.com/PlSk18yu-lg.jpg', name: 'Plato decorado', price: 62, category: 'ceramics' },
                { img: 'https://i.pinimg.com/736x/f6/fd/6c/f6fd6c862286b4b42ad7087abdafbb1e--costa-rica.jpg', name: 'Jarra pintada', price: 74, category: 'ceramics' }
            ]
        },
        {
            id: 'bocas-creative',
            name: 'Bocas Creative',
            desc: 'Handcrafts and weavings from Bocas del Toro.',
            location: 'Bocas del Toro',
            sellerName: 'Sofía Méndez',
            sellerId: 'bocas',
            avatar: '',
            rating: 4.4,
            match: { storeNames: ['bocas creative'], locations: ['bocas'], keywords: ['bocas'] },
            products: [
                { img: 'https://th.bing.com/th/id/R.66770062d58daa71b44997399d356ec1?rik=q0n3IQ7X%2fHKgdg&pid=ImgRaw&r=0&sres=1&sresct=1', name: 'Tejido Bocas', price: 66, category: 'textiles' },
                { img: 'https://utp.ac.pa/sites/default/files/img_5346_0.jpg', name: 'Bolso artesanal', price: 54, category: 'textiles' },
                { img: 'https://th.bing.com/th/id/R.92a6a688a0f6207602160f9cdab087bd?rik=owFOXkJKhkqxkA&riu=http%3a%2f%2f2.bp.blogspot.com%2f-TgiL1cJneBE%2fUIRFczUNkhI%2fAAAAAAAAABs%2fP5W7zMZ_g4c%2fs1600%2fDSC00055.JPG&ehk=hz9hrAV1MqEi2p2GT4Y41Dl15zjxbzMybNBdU%2bQ9Q8M%3d&risl=&pid=ImgRaw&r=0', name: 'Cestería de palma', price: 49, category: 'textiles' }
            ]
        },
        {
            id: 'los-santos-tradition',
            name: 'Los Santos Tradition',
            desc: 'Polleras, hats, and embroidery from Los Santos.',
            location: 'Los Santos',
            sellerName: 'Carmen Herrera',
            sellerId: 'los-santos',
            avatar: '',
            rating: 4.7,
            match: { storeNames: ['los santos tradition'], locations: ['los santos'], keywords: ['pollera', 'tembleque', 'santeñ'] },
            products: [
                { img: 'https://tse1.mm.bing.net/th/id/OIP.kTMA9Neki4nog9NVIN0TigHaFj?r=0&rs=1&pid=ImgDetMain&o=7&rm=3', name: 'Pollera santeña', price: 220, category: 'textiles' },
                { img: 'https://www.bebeours.com/wp-content/uploads/2022/07/acheter-chapeau-panama-800x534.jpg', name: 'Sombrero Panamá', price: 80, category: 'textiles' },
                { img: 'https://i.pinimg.com/736x/bd/d6/0d/bdd60d9156b2e50cc18e2f0209c8228d--panama-canal-folklore.jpg', name: 'Tembleques', price: 95, category: 'jewelry' }
            ]
        }
    ];

    function esc(value) {
        if (global.SecurityUtils?.escapeHtml) return global.SecurityUtils.escapeHtml(value);
        const n = document.createElement('div');
        n.textContent = String(value ?? '');
        return n.innerHTML;
    }

    function t(key, fallback) {
        const lang = localStorage.getItem('lang') || 'es';
        return (global.translations && global.translations[lang] && global.translations[lang][key]) || fallback;
    }

    function initials(name) {
        return String(name || 'AS').split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
    }

    function slug(value) {
        return String(value || '')
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '');
    }

    function getPublicProducts() {
        if (global.userProductsDB?.getPublicProducts) {
            return global.userProductsDB.getPublicProducts();
        }
        return global.productsDB?.getAllProducts?.() || [];
    }

    function productMatchesStore(product, demo) {
        const storeName = String(product.artisan?.store || '').toLowerCase();
        const location = String(product.artisan?.location || product.location || '').toLowerCase();
        const haystack = `${product.name || ''} ${product.description || ''} ${storeName} ${location}`.toLowerCase();
        if (demo.match.storeNames.some((n) => storeName && storeName === n)) return true;
        if (demo.match.locations.some((loc) => location.includes(loc))) return true;
        return demo.match.keywords.some((k) => haystack.includes(k));
    }

    function toFullProduct(demo, item, index) {
        const artisan = {
            id: demo.sellerId,
            name: demo.sellerName,
            avatar: demo.avatar,
            store: demo.name,
            rating: demo.rating,
            location: demo.location
        };
        return {
            id: `storeprod-${demo.id}-${index}`,
            name: item.name,
            description: `${item.name}. ${demo.desc}`,
            price: Number(item.price) || 50,
            originalPrice: Number(item.price) ? Number(item.price) * 1.15 : 60,
            currency: 'USD',
            category: item.category || 'textiles',
            artisan,
            images: [item.img],
            mainImage: item.img,
            tags: ['handmade'],
            stock: 4,
            rating: demo.rating,
            reviews: 6,
            createdAt: '2024-03-01',
            featured: false,
            location: demo.location,
            storeName: demo.name,
            sellerId: demo.sellerId,
            shipping: { estimatedDays: '5-7 business days' }
        };
    }

    function uniqueProducts(list) {
        const seen = new Set();
        return list.filter((p) => {
            const key = String(p.id);
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
        });
    }

    function buildDemoStore(demo, catalog) {
        const matched = catalog.filter((p) => productMatchesStore(p, demo));
        const extras = demo.products.map((item, i) => toFullProduct(demo, item, i));
        const products = uniqueProducts([...matched, ...extras]);
        return {
            id: demo.id,
            name: demo.name,
            desc: demo.desc,
            location: demo.location,
            avatar: demo.avatar || products[0]?.artisan?.avatar || '',
            sellerName: demo.sellerName,
            sellerId: demo.sellerId,
            sellerAvatar: demo.avatar || products[0]?.artisan?.avatar || '',
            rating: demo.rating,
            products,
            featured: !!demo.featured
        };
    }

    function buildUserStores(catalog, usedIds) {
        const extra = [];
        const users = JSON.parse(localStorage.getItem('artesana_users') || '[]');
        users.forEach((user) => {
            const store = typeof user.store === 'string' ? (() => {
                try { return JSON.parse(user.store); } catch { return null; }
            })() : user.store;
            if (!store || !store.name) return;
            const id = `user-${user.id}`;
            if (usedIds.has(id)) return;
            const products = catalog.filter((p) =>
                String(p.userId) === String(user.id) ||
                String(p.sellerId) === String(user.id) ||
                String(p.artisan?.id) === String(user.id)
            );
            extra.push({
                id,
                name: store.name,
                desc: store.desc || t('public_store_seller_desc', 'Tienda de un artesano de ArteSana.'),
                location: store.location || user.location || '',
                avatar: store.photo || user.avatar || '',
                sellerName: user.name || store.ownerName || store.name,
                sellerId: user.id,
                sellerAvatar: user.avatar || store.photo || '',
                rating: user.rating || 0,
                products,
                featured: false
            });
            usedIds.add(id);
        });
        return extra;
    }

    let storesCache = null;

    function getStores() {
        if (storesCache) return storesCache;

        const catalog = getPublicProducts();
        const assigned = new Set();
        const stores = DEMO_STORES.map((demo) => {
            const remaining = catalog.filter((p) => !assigned.has(String(p.id)));
            const store = buildDemoStore(demo, remaining);
            store.products.forEach((p) => assigned.add(String(p.id)));
            return store;
        });

        const leftovers = {};
        catalog.forEach((product) => {
            if (assigned.has(String(product.id))) return;
            const artisanId = product.artisan?.id ?? product.sellerId ?? product.userId;
            if (artisanId == null) return;
            const key = String(artisanId);
            if (!leftovers[key]) {
                leftovers[key] = {
                    id: `artisan-${key}`,
                    name: product.artisan?.store || product.storeName || product.artisan?.name || 'Tienda artesanal',
                    desc: product.artisan?.location
                        ? t('public_store_from', 'Artesanías de') + ' ' + product.artisan.location
                        : t('public_store_seller_desc', 'Tienda de un artesano de ArteSana.'),
                    location: product.artisan?.location || product.location || '',
                    avatar: product.artisan?.avatar || '',
                    sellerName: product.artisan?.name || '',
                    sellerId: artisanId,
                    sellerAvatar: product.artisan?.avatar || '',
                    rating: product.artisan?.rating || product.rating || 0,
                    products: [],
                    featured: false
                };
            }
            leftovers[key].products.push(product);
        });

        const usedIds = new Set(stores.map((s) => s.id));
        Object.values(leftovers).forEach((store) => {
            if (!usedIds.has(store.id)) stores.push(store);
            usedIds.add(store.id);
        });

        storesCache = stores.concat(buildUserStores(catalog, usedIds));
        return storesCache;
    }

    function getStoreById(id) {
        if (id == null || id === '') return null;
        const wanted = String(id);
        return getStores().find((s) => String(s.id) === wanted) || null;
    }

    function getStoreByArtisan(artisanId) {
        if (artisanId == null) return null;
        const wanted = String(artisanId);
        return getStores().find((s) => String(s.sellerId) === wanted) || getStoreById(`artisan-${wanted}`) || getStoreById(`user-${wanted}`);
    }

    function getProductById(id) {
        if (id == null) return null;
        const wanted = String(id);
        for (const store of getStores()) {
            const product = store.products.find((p) => String(p.id) === wanted);
            if (product) return product;
        }
        return null;
    }

    function storeUrl(id) {
        return `tienda.html#${encodeURIComponent(String(id))}`;
    }

    global.PublicStoreService = {
        esc,
        t,
        initials,
        slug,
        getStores,
        getStoreById,
        getStoreByArtisan,
        getProductById,
        storeUrl
    };
})(window);
