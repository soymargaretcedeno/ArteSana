/**
 * Ventana de chat completa con historial e input.
 */
(function (global) {
    'use strict';

    const U = global.MessagesUtils;
    const Header = global.MessagesChatHeader;
    const Bubble = global.MessagesBubble;
    const Input = global.MessagesInput;
    const Empty = global.MessagesEmptyState;

    global.MessagesChatWindow = {
        render(thread) {
            if (!thread) {
                return `<main class="messages-chat" role="main">${Empty.render()}</main>`;
            }

            const messages = thread.messages || [];
            return `
                <main class="messages-chat" role="main" aria-label="${U.esc(U.t('msg_chat_with', 'Chat con'))} ${U.esc(thread.artisanName)}">
                    ${Header.render(thread)}
                    <div class="messages-messages-area" id="msgMessagesArea" role="log" aria-live="polite">
                        ${Bubble.renderAll(messages)}
                    </div>
                    ${Input.render()}
                </main>`;
        },

        scrollToBottom(container) {
            const area = container.querySelector('#msgMessagesArea');
            if (area) {
                requestAnimationFrame(() => {
                    area.scrollTop = area.scrollHeight;
                });
            }
        },

        appendMessage(container, msg) {
            const area = container.querySelector('#msgMessagesArea');
            if (!area) return;
            area.insertAdjacentHTML('beforeend', Bubble.render(msg));
            this.scrollToBottom(container);
        },

        bind(container, thread, callbacks) {
            if (!thread) return;

            const backBtn = container.querySelector('#msgBackBtn');
            if (backBtn && callbacks.onBack) {
                backBtn.addEventListener('click', callbacks.onBack);
            }

            Input.bind(container, thread.id, (msg) => {
                this.appendMessage(container, msg);
                if (callbacks.onSent) callbacks.onSent(msg);
            });

            const callBtn = container.querySelector('#msgCallBtn');
            const videoBtn = container.querySelector('#msgVideoBtn');
            callBtn?.addEventListener('click', (event) => {
                event.preventDefault();
                global.MessagesCall?.start(thread, 'audio');
            });
            videoBtn?.addEventListener('click', (event) => {
                event.preventDefault();
                global.MessagesCall?.start(thread, 'video');
            });

            this.scrollToBottom(container);
        }
    };
})(window);
