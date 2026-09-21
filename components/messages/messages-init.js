/**
 * Inicialización global del módulo de mensajería (overlay completo).
 */
(function (global) {
    'use strict';

    const MESSAGE_SCRIPTS = [
        'components/messages/messages-utils.js',
        'components/messages/search-bar.js',
        'components/messages/conversation-item.js',
        'components/messages/conversation-list.js',
        'components/messages/message-bubble.js',
        'components/messages/empty-state.js',
        'components/messages/message-input.js',
        'components/messages/chat-header.js',
        'components/messages/call-overlay.js',
        'components/messages/chat-window.js',
        'components/messages/messages-overlay.js',
        'components/messages/messages-bridge.js'
    ];

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

    function loadCss(href) {
        if (document.querySelector(`link[href="${href}"]`)) return;
        const l = document.createElement('link');
        l.rel = 'stylesheet';
        l.href = href;
        document.head.appendChild(l);
    }

    let _initPromise = null;

    async function initEnhancedMessages() {
        if (_initPromise) return _initPromise;

        _initPromise = (async () => {
            loadCss('components/messages/messages.css');

            for (const src of MESSAGE_SCRIPTS) {
                try {
                    await loadScript(src);
                } catch (e) {
                    console.warn('MessagesInit: failed to load', src);
                }
            }

            if (!document.querySelector('messages-overlay')) {
                document.body.appendChild(document.createElement('messages-overlay'));
            }

            window.addEventListener('popstate', (e) => {
                const overlay = document.querySelector('messages-overlay');
                if (overlay) overlay.handlePopState(e.state);
            });

            document.body.dataset.enhancedMessages = 'true';
            document.dispatchEvent(new CustomEvent('messages:ready'));
        })();

        try {
            await _initPromise;
        } catch (err) {
            _initPromise = null;
            throw err;
        }
    }

    global.MessagesInit = { init: initEnhancedMessages };

    document.addEventListener('DOMContentLoaded', () => {
        if (document.body.dataset.enhancedMessages === 'true' ||
            document.querySelector('script[src*="messages-init.js"]')) {
            initEnhancedMessages();
        }
    });
})(window);
