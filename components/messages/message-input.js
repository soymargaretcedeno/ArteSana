/**
 * Área de entrada de mensajes con emoji, adjuntar y enviar.
 */
(function (global) {
    'use strict';

    const U = global.MessagesUtils;

    global.MessagesInput = {
        render() {
            const placeholder = U.t('msg_type_placeholder', 'Escribe un mensaje...');
            return `
                <div class="messages-input-area">
                    <div class="messages-input-actions">
                        <button type="button" class="messages-input-action-btn" id="msgEmojiBtn"
                                aria-label="${U.esc(U.t('msg_emoji', 'Emoji'))}" title="${U.esc(U.t('msg_emoji', 'Emoji'))}">
                            ${U.icons.emoji}
                        </button>
                        <button type="button" class="messages-input-action-btn" id="msgAttachBtn"
                                aria-label="${U.esc(U.t('msg_attach', 'Adjuntar archivo'))}" title="${U.esc(U.t('msg_attach', 'Adjuntar archivo'))}">
                            ${U.icons.attach}
                        </button>
                        <input type="file" id="msgFileInput" hidden aria-hidden="true">
                    </div>
                    <textarea class="messages-input-field" id="msgInputField"
                              placeholder="${U.esc(placeholder)}"
                              aria-label="${U.esc(placeholder)}"
                              rows="1"></textarea>
                    <button type="button" class="messages-send-btn" id="msgSendBtn"
                            aria-label="${U.esc(U.t('msg_send', 'Enviar'))}" disabled>
                        ${U.icons.send}
                    </button>
                </div>`;
        },

        bind(container, chatId, onSent) {
            const field = container.querySelector('#msgInputField');
            const sendBtn = container.querySelector('#msgSendBtn');
            const attachBtn = container.querySelector('#msgAttachBtn');
            const fileInput = container.querySelector('#msgFileInput');
            const emojiBtn = container.querySelector('#msgEmojiBtn');

            if (!field || !sendBtn) return;

            const updateSendState = () => {
                sendBtn.disabled = !field.value.trim();
            };

            field.addEventListener('input', () => {
                field.style.height = 'auto';
                field.style.height = Math.min(field.scrollHeight, 100) + 'px';
                updateSendState();
            });

            const send = () => {
                const text = field.value.trim();
                if (!text || !chatId) return;
                const msg = global.PlatformServices.sendMessage(chatId, text);
                if (msg) {
                    field.value = '';
                    field.style.height = 'auto';
                    updateSendState();
                    onSent(msg);
                }
            };

            sendBtn.addEventListener('click', send);
            field.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    send();
                }
            });

            if (attachBtn && fileInput) {
                attachBtn.addEventListener('click', () => fileInput.click());
                fileInput.addEventListener('change', () => {
                    if (fileInput.files.length) {
                        field.value = (field.value ? field.value + ' ' : '') +
                            `[${U.t('msg_file_attached', 'Archivo')}: ${fileInput.files[0].name}]`;
                        updateSendState();
                        fileInput.value = '';
                    }
                });
            }

            if (emojiBtn) {
                const emojis = ['😊', '👍', '❤️', '🎨', '✨', '🙏'];
                emojiBtn.addEventListener('click', () => {
                    field.value += emojis[Math.floor(Math.random() * emojis.length)];
                    field.focus();
                    updateSendState();
                });
            }
        }
    };
})(window);
