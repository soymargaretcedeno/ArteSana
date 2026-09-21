/**
 * Item individual de conversación.
 */
(function (global) {
    'use strict';

    const U = global.MessagesUtils;

    global.MessagesConversationItem = {
        render(thread, isActive) {
            const avatar = thread.artisanAvatar
                ? `<img class="messages-avatar" src="${U.esc(thread.artisanAvatar)}" alt="" loading="lazy">`
                : `<div class="messages-avatar-placeholder" aria-hidden="true">${U.esc(U.getInitials(thread.artisanName))}</div>`;

            const lastMsg = thread.lastMessage || U.t('msg_no_messages_yet', 'Sin mensajes aún');
            const lastTime = thread.messages && thread.messages.length
                ? U.formatTime(thread.messages[thread.messages.length - 1].time)
                : '';
            const unread = thread.unread > 0
                ? `<span class="messages-unread-badge" aria-label="${thread.unread} sin leer">${thread.unread}</span>`
                : '';

            return `
                <div class="messages-conversation-item${isActive ? ' active' : ''}"
                     role="listitem"
                     tabindex="0"
                     data-chat-id="${U.esc(thread.id)}"
                     aria-label="${U.esc(thread.artisanName)}">
                    ${avatar}
                    <div class="messages-conversation-body">
                        <div class="messages-conversation-top">
                            <span class="messages-conversation-name">${U.esc(thread.artisanName)}</span>
                            <span class="messages-conversation-time">${U.esc(lastTime)}</span>
                        </div>
                        <div class="messages-conversation-preview">
                            <span class="messages-conversation-last">${U.esc(lastMsg)}</span>
                            ${unread}
                        </div>
                    </div>
                </div>`;
        }
    };
})(window);
