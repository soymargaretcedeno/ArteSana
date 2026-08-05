/**
 * Lista de conversaciones con búsqueda y scroll.
 */
(function (global) {
    'use strict';

    const U = global.MessagesUtils;
    const Item = global.MessagesConversationItem;
    const SearchBar = global.MessagesSearchBar;

    global.MessagesConversationList = {
        render(activeChatId) {
            const threads = U.sortThreads(global.PlatformServices.getMessageThreads());

            return `
                <aside class="messages-sidebar" role="complementary" aria-label="${U.esc(U.t('messages_center', 'Mensajes'))}">
                    <div class="messages-sidebar-header">
                        <h2>${U.esc(U.t('messages_center', 'Mensajes'))}</h2>
                        <button class="messages-close-btn" id="msgCloseSidebar" aria-label="${U.esc(U.t('msg_close', 'Cerrar'))}">
                            ${U.icons.close}
                        </button>
                    </div>
                    ${SearchBar.render()}
                    <div class="messages-conversation-list" id="msgConversationList" role="list">
                        ${threads.length
                            ? threads.map(t => Item.render(t, t.id === activeChatId)).join('')
                            : `<div class="messages-no-results">${U.esc(U.t('no_messages', 'No hay conversaciones.'))}</div>`}
                    </div>
                </aside>`;
        },

        updateList(container, activeChatId, filter) {
            let threads = U.sortThreads(global.PlatformServices.getMessageThreads());
            if (filter) {
                threads = threads.filter(t =>
                    (t.artisanName || '').toLowerCase().includes(filter) ||
                    (t.lastMessage || '').toLowerCase().includes(filter)
                );
            }

            const list = container.querySelector('#msgConversationList');
            if (!list) return;

            list.innerHTML = threads.length
                ? threads.map(t => Item.render(t, t.id === activeChatId)).join('')
                : `<div class="messages-no-results">${U.esc(U.t('msg_no_results', 'No se encontraron conversaciones.'))}</div>`;
        },

        bindSearch(container, activeChatId, onSelect) {
            SearchBar.bind(container, (filter) => {
                this.updateList(container, activeChatId, filter);
                this.bindItems(container, onSelect);
            });
        },

        bindItems(container, onSelect) {
            container.querySelectorAll('.messages-conversation-item').forEach(item => {
                const handler = () => onSelect(item.dataset.chatId);
                item.addEventListener('click', handler);
                item.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handler();
                    }
                });
            });
        }
    };
})(window);
