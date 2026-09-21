/**
 * Barra de búsqueda de conversaciones.
 */
(function (global) {
    'use strict';

    const U = global.MessagesUtils;

    global.MessagesSearchBar = {
        render(placeholder) {
            const ph = placeholder || U.t('msg_search', 'Buscar conversaciones...');
            return `
                <div class="messages-search-wrap">
                    <div class="messages-search" role="search">
                        ${U.icons.search}
                        <input type="search"
                               id="msgSearchInput"
                               placeholder="${U.esc(ph)}"
                               aria-label="${U.esc(ph)}"
                               autocomplete="off">
                    </div>
                </div>`;
        },

        bind(container, onSearch) {
            const input = container.querySelector('#msgSearchInput');
            if (!input) return;
            input.addEventListener('input', () => onSearch(input.value.trim().toLowerCase()));
        }
    };
})(window);
