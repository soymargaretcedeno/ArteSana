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
                    <h3>${U.esc(U.t('msg_select_chat', 'Chat con directivos'))}</h3>
                    <p>${U.esc(U.t('msg_select_chat_desc', 'Selecciona el canal directivo para escribir al equipo de ArteSana. Un asistente AI responderá mientras un directivo revisa tu mensaje.'))}</p>
                </div>`;
        }
    };
})(window);
