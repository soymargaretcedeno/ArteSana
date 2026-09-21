/**
 * Overlay principal de mensajería — Web Component.
 * Desktop: dos columnas | Mobile: navegación estilo WhatsApp.
 */
class MessagesOverlay extends HTMLElement {
    constructor() {
        super();
        this.activeChatId = null;
        this.mobileView = 'list';
        this._resizeHandler = this._onResize.bind(this);
        this._escHandler = (e) => {
            if (e.key === 'Escape' && this.classList.contains('open')) this.close();
        };
        this._onMessagesUpdated = (e) => {
            if (!this.classList.contains('open')) return;
            const chatId = e.detail?.chatId;
            if (chatId && chatId === this.activeChatId) {
                this._refreshActiveChat();
            }
            this._refreshList();
        };
    }

    connectedCallback() {
        document.addEventListener('keydown', this._escHandler);
        document.addEventListener('messages:updated', this._onMessagesUpdated);
    }

    disconnectedCallback() {
        window.removeEventListener('resize', this._resizeHandler);
        document.removeEventListener('keydown', this._escHandler);
        document.removeEventListener('messages:updated', this._onMessagesUpdated);
    }

    t(key, fallback) {
        return window.MessagesUtils.t(key, fallback);
    }

    getThread(chatId) {
        return window.PlatformServices.getMessageThreads().find(c => c.id === chatId) || null;
    }

    render() {
        const ConvList = window.MessagesConversationList;
        const ChatWin = window.MessagesChatWindow;
        const thread = this.activeChatId ? this.getThread(this.activeChatId) : null;

        this.innerHTML = `
            <div class="messages-overlay${this.classList.contains('open') ? ' open' : ''} ${this._mobileClass()}"
                 role="dialog" aria-modal="true" aria-label="${window.MessagesUtils.esc(this.t('messages_center', 'Mensajes'))}">
                <div class="messages-backdrop" id="msgBackdrop"></div>
                <div class="messages-container">
                    ${ConvList.render(this.activeChatId)}
                    ${ChatWin.render(thread)}
                </div>
            </div>`;

        this._bindInternal();
    }

    _mobileClass() {
        if (!MessagesOverlay.isMobile()) return '';
        return this.mobileView === 'chat' ? 'mobile-chat-view' : 'mobile-list-view';
    }

    static isMobile() {
        return window.MessagesUtils.isMobile();
    }

    _bindInternal() {
        const overlay = this.querySelector('.messages-overlay');
        const ConvList = window.MessagesConversationList;

        overlay.querySelector('#msgBackdrop')?.addEventListener('click', () => this.close());
        overlay.querySelector('#msgCloseSidebar')?.addEventListener('click', () => this.close());

        ConvList.bindSearch(overlay, () => this.activeChatId, (chatId) => this.selectChat(chatId));
        ConvList.bindItems(overlay, (chatId) => this.selectChat(chatId));

        const thread = this.activeChatId ? this.getThread(this.activeChatId) : null;
        window.MessagesChatWindow.bind(overlay, thread, {
            onBack: () => this.goToList(),
            onSent: () => this._refreshList()
        });
    }

    _onResize() {
        if (!this.classList.contains('open')) return;
        if (!MessagesOverlay.isMobile() && this.mobileView === 'list' && this.activeChatId) {
            /* desktop keeps both panels */
        }
        const overlay = this.querySelector('.messages-overlay');
        if (overlay) {
            overlay.className = `messages-overlay open ${this._mobileClass()}`;
        }
    }

    _refreshList() {
        const overlay = this.querySelector('.messages-overlay');
        if (!overlay) return;
        window.MessagesConversationList.updateList(overlay, this.activeChatId, '');
        window.MessagesConversationList.bindItems(overlay, (chatId) => this.selectChat(chatId));
    }

    _refreshActiveChat() {
        const overlay = this.querySelector('.messages-overlay');
        const thread = this.activeChatId ? this.getThread(this.activeChatId) : null;
        if (!overlay || !thread) return;
        const area = overlay.querySelector('#msgMessagesArea');
        if (area) {
            area.innerHTML = window.MessagesBubble.renderAll(thread.messages);
            window.MessagesChatWindow.scrollToBottom(overlay);
        }
    }

    selectChat(chatId) {
        this.activeChatId = chatId;
        window.MessagesUtils.markThreadRead(chatId);

        if (MessagesOverlay.isMobile()) {
            this.mobileView = 'chat';
            history.pushState({ messagesView: 'chat', chatId }, '', `#messages/${chatId}`);
        }

        this.render();

        const item = this.querySelector(`[data-chat-id="${chatId}"]`);
        item?.focus();
    }

    goToList() {
        if (MessagesOverlay.isMobile() && this.mobileView === 'chat') {
            history.back();
            return;
        }
        this.mobileView = 'list';
        this.render();
    }

    open(chatId) {
        if (chatId) {
            this.activeChatId = chatId;
            if (MessagesOverlay.isMobile()) this.mobileView = 'chat';
        } else {
            const threads = (window.PlatformServices && window.PlatformServices.getMessageThreads)
                ? window.PlatformServices.getMessageThreads()
                : [];
            const directors = threads.find(t => t.type === 'directors') || threads[0];
            if (directors) {
                this.activeChatId = directors.id;
                if (MessagesOverlay.isMobile()) this.mobileView = 'chat';
            } else {
                this.mobileView = 'list';
            }
        }

        this.classList.add('open');
        this.render();
        document.body.style.overflow = 'hidden';
        window.addEventListener('resize', this._resizeHandler);

        if (MessagesOverlay.isMobile() && !location.hash.startsWith('#messages')) {
            history.pushState({ messagesView: 'list' }, '', '#messages');
        }

        requestAnimationFrame(() => {
            this.querySelector('#msgSearchInput')?.focus();
        });

        document.dispatchEvent(new CustomEvent('messages:opened'));
    }

    close() {
        this.classList.remove('open');
        const overlay = this.querySelector('.messages-overlay');
        overlay?.classList.remove('open');
        document.body.style.overflow = '';
        window.removeEventListener('resize', this._resizeHandler);

        setTimeout(() => {
            this.activeChatId = null;
            this.mobileView = 'list';
            if (location.hash.startsWith('#messages')) {
                history.replaceState(null, '', location.pathname + location.search);
            }
        }, 260);

        document.dispatchEvent(new CustomEvent('messages:closed'));
    }

    handlePopState(state) {
        if (!this.classList.contains('open')) return;

        if (!state || !state.messagesView) {
            this.classList.remove('open');
            const overlay = this.querySelector('.messages-overlay');
            overlay?.classList.remove('open');
            document.body.style.overflow = '';
            window.removeEventListener('resize', this._resizeHandler);
            this.activeChatId = null;
            this.mobileView = 'list';
            document.dispatchEvent(new CustomEvent('messages:closed'));
            return;
        }

        if (state.messagesView === 'chat' && state.chatId) {
            this.activeChatId = state.chatId;
            this.mobileView = 'chat';
        } else {
            this.activeChatId = state.chatId || null;
            this.mobileView = 'list';
        }
        this.render();
    }
}

if (!customElements.get('messages-overlay')) {
    customElements.define('messages-overlay', MessagesOverlay);
}
