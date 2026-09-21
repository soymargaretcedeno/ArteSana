/**
 * Burbuja de mensaje individual.
 */
(function (global) {
    'use strict';

    const U = global.MessagesUtils;

    global.MessagesBubble = {
        render(msg) {
            const isOutgoing = msg.sender === 'buyer' || msg.sender === 'user';
            const cls = isOutgoing ? 'outgoing' : 'incoming';
            const aiLabel = (!isOutgoing && msg.fromAI)
                ? `<span class="messages-bubble-label">${U.esc(U.t('msg_ai_label', 'Asistente AI'))}</span>`
                : '';
            return `
                <div class="messages-bubble ${cls}" role="listitem">
                    ${aiLabel}
                    ${U.esc(msg.text)}
                    <span class="messages-bubble-time">${U.esc(msg.time || '')}</span>
                </div>`;
        },

        renderAll(messages) {
            if (!messages || !messages.length) return '';
            return messages.map(m => this.render(m)).join('');
        }
    };
})(window);
