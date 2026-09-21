/**
 * Inyección de meta tags SEO y Open Graph por página.
 */
(function (global) {
    'use strict';

    const DEFAULTS = {
        siteName: 'ArteSana',
        locale: 'es_PA',
        twitterCard: 'summary_large_image',
        image: 'assets/ArteSana_logo.png',
        description: 'Marketplace de artesanías panameñas. Conectamos artesanos locales con amantes del arte en todo el mundo.'
    };

    const PAGE_SEO = {
        'index.html': {
            title: 'ArteSana - Marketplace de Artesanías Panameñas',
            description: 'Descubre creaciones únicas de artesanos panameños. Comercio justo, envíos internacionales y tiendas personalizadas.',
            keywords: 'artesanías panameñas, marketplace, artesanos, mola, cerámica, textiles'
        },
        'explorar.html': {
            title: 'Explorar Artesanías - ArteSana',
            description: 'Explora tesoros artesanales de Panamá: cerámica, textiles, joyería y esculturas de artesanos certificados.'
        },
        'store.html': {
            title: 'Tienda - ArteSana',
            description: 'Visita las tiendas de artesanos panameños en ArteSana.'
        },
        'contact.html': {
            title: 'Contacto - ArteSana',
            description: 'Contáctanos para soporte, colaboraciones o preguntas sobre artesanías panameñas.'
        },
        'cart.html': {
            title: 'Carrito de Compras - ArteSana',
            description: 'Revisa los productos artesanales en tu carrito.'
        },
        'checkout.html': {
            title: 'Checkout - ArteSana',
            description: 'Finaliza tu compra de artesanías panameñas de forma segura.'
        },
        'perfil.html': {
            title: 'Mi Perfil - ArteSana',
            description: 'Gestiona tu perfil, productos y pedidos en ArteSana.'
        },
        'product.html': {
            title: 'Detalle de Producto - ArteSana',
            description: 'Información detallada del producto artesanal.'
        }
    };

    function getCurrentPage() {
        const path = window.location.pathname;
        return path.substring(path.lastIndexOf('/') + 1) || 'index.html';
    }

    function setMeta(name, content, attr = 'name') {
        if (!content) return;
        let el = document.querySelector(`meta[${attr}="${name}"]`);
        if (!el) {
            el = document.createElement('meta');
            el.setAttribute(attr, name);
            document.head.appendChild(el);
        }
        el.setAttribute('content', content);
    }

    function applySeoMeta(customConfig) {
        const page = getCurrentPage();
        const config = { ...DEFAULTS, ...(PAGE_SEO[page] || {}), ...(customConfig || {}) };
        const origin = window.location.origin;
        const canonical = config.canonical || (origin + window.location.pathname);

        if (config.title) {
            document.title = config.title;
        }

        setMeta('description', config.description);
        if (config.keywords) setMeta('keywords', config.keywords);
        setMeta('robots', config.robots || 'index, follow');

        setMeta('og:title', config.title, 'property');
        setMeta('og:description', config.description, 'property');
        setMeta('og:type', config.type || 'website', 'property');
        setMeta('og:url', canonical, 'property');
        setMeta('og:site_name', config.siteName, 'property');
        setMeta('og:locale', config.locale, 'property');
        setMeta('og:image', config.image.startsWith('http') ? config.image : origin + '/' + config.image.replace(/^\//, ''), 'property');

        setMeta('twitter:card', config.twitterCard);
        setMeta('twitter:title', config.title);
        setMeta('twitter:description', config.description);

        let linkCanonical = document.querySelector('link[rel="canonical"]');
        if (!linkCanonical) {
            linkCanonical = document.createElement('link');
            linkCanonical.rel = 'canonical';
            document.head.appendChild(linkCanonical);
        }
        linkCanonical.href = canonical;
    }

    global.SeoMeta = { applySeoMeta, PAGE_SEO, DEFAULTS };

    document.addEventListener('DOMContentLoaded', () => applySeoMeta());
})(window);
