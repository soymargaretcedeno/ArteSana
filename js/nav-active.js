/**
 * Detección de sección activa del navbar — compartido por ambos headers.
 * Indica en qué parte del sitio está el usuario (Inicio, Explorar, Tienda, Contacto).
 */
(function (global) {
    'use strict';

    if (global.NavActive) return;

    const SECTION_PAGES = {
        dashboard: ['index.html'],
        explore: [
            'explorar.html',
            'product.html',
            'compare.html',
            'ceramics.html',
            'textiles.html',
            'jewelry.html',
            'sculpture.html',
            'add-product.html'
        ],
        store: ['store.html', 'tienda.html'],
        contact: ['contact.html']
    };

    function getCurrentPage() {
        const path = global.location.pathname || '';
        let page = path.substring(path.lastIndexOf('/') + 1);
        page = (page || 'index.html').split('?')[0].split('#')[0];
        return page;
    }

    function getActiveNavSection(page) {
        const current = page || getCurrentPage();
        for (const [section, pages] of Object.entries(SECTION_PAGES)) {
            if (pages.includes(current)) return section;
        }
        return null;
    }

    global.NavActive = {
        SECTION_PAGES,
        getCurrentPage,
        getActiveNavSection
    };
})(window);
