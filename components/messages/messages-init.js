/**
 * Inicialización del módulo de mensajería para index y explorar.
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
        'components/messages/chat-window.js',
        'components/messages/messages-overlay.js'
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

    async function initEnhancedMessages() {
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
    }

    global.MessagesInit = { init: initEnhancedMessages };

    document.addEventListener('DOMContentLoaded', () => {
        if (document.body.dataset.enhancedMessages === 'true') {
            initEnhancedMessages();
        }
    });
})(window);
