/**
 * Cabecera del chat con avatar, estado y acciones.
 */
(function (global) {
    'use strict';

    const U = global.MessagesUtils;

    global.MessagesChatHeader = {
        render(thread) {
            if (!thread) return '';

            const avatar = thread.artisanAvatar
                ? `<img class="messages-avatar" src="${U.esc(thread.artisanAvatar)}" alt="" style="width:40px;height:40px;">`
                : `<div class="messages-avatar-placeholder" style="width:40px;height:40px;font-size:0.9rem;" aria-hidden="true">${U.esc(U.getInitials(thread.artisanName))}</div>`;

            return `
                <header class="messages-chat-header">
                    <button class="messages-back-btn" id="msgBackBtn"
                            aria-label="${U.esc(U.t('msg_back', 'Regresar'))}">
                        ${U.icons.back}
                    </button>
                    ${avatar}
                    <div class="messages-chat-header-info">
                        <p class="messages-chat-header-name">${U.esc(thread.artisanName)}</p>
                        <p class="messages-chat-header-status">${U.esc(U.t('msg_online', 'En línea'))}</p>
                    </div>
                    <div class="messages-chat-actions">
                        <button class="messages-icon-btn" aria-label="${U.esc(U.t('msg_call', 'Llamada'))}" title="${U.esc(U.t('msg_call', 'Llamada'))}">
                            ${U.icons.phone}
                        </button>
                        <button class="messages-icon-btn" aria-label="${U.esc(U.t('msg_video_call', 'Videollamada'))}" title="${U.esc(U.t('msg_video_call', 'Videollamada'))}">
                            ${U.icons.video}
                        </button>
                        <button class="messages-icon-btn" aria-label="${U.esc(U.t('msg_options', 'Opciones'))}" title="${U.esc(U.t('msg_options', 'Opciones'))}">
                            ${U.icons.menu}
                        </button>
                    </div>
                </header>`;
        }
    };
})(window);
