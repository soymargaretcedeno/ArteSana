/**
 * Lazy loading de imágenes con Intersection Observer (fallback nativo loading="lazy").
 */
(function (global) {
    'use strict';

    function enhanceLazyImages(root) {
        const scope = root || document;
        const images = scope.querySelectorAll('img:not([loading])');

        images.forEach(img => {
            if (!img.closest('.hero-section') && !img.hasAttribute('data-eager')) {
                img.loading = 'lazy';
                img.decoding = 'async';
            }
        });

        if (!('IntersectionObserver' in window)) return;

        const lazyBg = scope.querySelectorAll('[data-bg-lazy]');
        if (!lazyBg.length) return;

        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                const el = entry.target;
                const bg = el.getAttribute('data-bg-lazy');
                if (bg) el.style.backgroundImage = bg;
                obs.unobserve(el);
            });
        }, { rootMargin: '200px' });

        lazyBg.forEach(el => observer.observe(el));
    }

    global.LazyImages = { enhance: enhanceLazyImages };

    document.addEventListener('DOMContentLoaded', () => enhanceLazyImages());
})(window);
