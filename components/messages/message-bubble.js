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
            return `
                <div class="messages-bubble ${cls}" role="listitem">
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
