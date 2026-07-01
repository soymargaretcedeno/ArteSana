/**
 * Inicialización central de scripts comunes (carga diferida de utilidades).
 */
(function (global) {
    'use strict';

    const CORE_SCRIPTS = [
        'js/utils/security.js',
        'js/utils/seo-meta.js',
        'js/utils/lazy-images.js',
        'js/utils/form-validation.js',
        'js/services/platform-services.js'
    ];

    const OPTIONAL_SCRIPTS = {
        auth: 'js/utils/auth-guard.js',
        widgets: 'components/platform-widgets.js'
    };

    function loadScript(src) {
        return new Promise((resolve, reject) => {
            if (document.querySelector(`script[src="${src}"]`)) {
                resolve();
                return;
            }
            const s = document.createElement('script');
            s.src = src;
            s.defer = true;
            s.onload = resolve;
            s.onerror = reject;
            document.head.appendChild(s);
        });
    }

    async function initApp(options = {}) {
        const opts = {
            auth: true,
            widgets: true,
            contactForm: '.contact-form form',
            ...options
        };

        for (const src of CORE_SCRIPTS) {
            try { await loadScript(src); } catch (e) { console.warn('AppCore: failed to load', src); }
        }

        if (opts.auth) {
            try { await loadScript(OPTIONAL_SCRIPTS.auth); } catch (e) { /* optional */ }
        }

        if (opts.widgets) {
            try {
                await loadScript(OPTIONAL_SCRIPTS.widgets);
                if (!document.querySelector('platform-widgets')) {
                    document.body.appendChild(document.createElement('platform-widgets'));
                }
            } catch (e) { /* optional */ }
        }

        if (opts.contactForm && global.FormValidation) {
            global.FormValidation.bindContactForm(opts.contactForm);
        }

        document.dispatchEvent(new CustomEvent('app:ready'));
    }

    global.AppCore = { init: initApp, loadScript };

    document.addEventListener('DOMContentLoaded', () => {
        if (document.body.dataset.appCore !== 'manual') {
            initApp();
        }
    });
})(window);
