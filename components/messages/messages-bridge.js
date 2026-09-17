/**
 * Puente de integración global entre platform-widgets y el overlay de mensajería.
 */
(function (global) {
    'use strict';

    function waitForWidgets() {
        return new Promise((resolve) => {
            const check = () => {
                const widgets = document.querySelector('platform-widgets');
                if (widgets && widgets.shadowRoot) {
                    resolve(widgets);
                    return;
                }
                setTimeout(check, 50);
            };
            check();
        });
    }

    document.addEventListener('messages:ready', async () => {
        await waitForWidgets();
    });

    document.addEventListener('DOMContentLoaded', () => {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') return;
            if (e.altKey && e.key === 'm') {
                e.preventDefault();
                document.querySelector('messages-overlay')?.open();
            }
        });
    });
})(window);
