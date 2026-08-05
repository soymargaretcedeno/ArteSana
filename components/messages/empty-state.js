/**
 * Estado vacío cuando no hay conversación seleccionada.
 */
(function (global) {
    'use strict';

    const U = global.MessagesUtils;

    global.MessagesEmptyState = {
        render() {
            return `
                <div class="messages-empty" role="status">
                    <div class="messages-empty-icon">${U.icons.chat}</div>
                    <h3>${U.esc(U.t('msg_select_chat', 'Selecciona una conversación'))}</h3>
                    <p>${U.esc(U.t('msg_select_chat_desc', 'Elige un chat de la lista para ver el historial de mensajes.'))}</p>
                </div>`;
        }
    };
})(window);
