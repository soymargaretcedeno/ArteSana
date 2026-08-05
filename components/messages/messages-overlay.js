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
    }

    connectedCallback() {
        document.addEventListener('keydown', this._escHandler);
    }

    disconnectedCallback() {
        window.removeEventListener('resize', this._resizeHandler);
        document.removeEventListener('keydown', this._escHandler);
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

        ConvList.bindSearch(overlay, this.activeChatId, (chatId) => this.selectChat(chatId));
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
        this.mobileView = 'list';
        if (MessagesOverlay.isMobile()) {
            history.pushState({ messagesView: 'list' }, '', '#messages');
        }
        this.render();
    }

    open(chatId) {
        if (chatId) {
            this.activeChatId = chatId;
            if (MessagesOverlay.isMobile()) this.mobileView = 'chat';
        } else {
            this.mobileView = 'list';
        }

        this.classList.add('open');
        this.render();
        document.body.style.overflow = 'hidden';
        window.addEventListener('resize', this._resizeHandler);

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
        if (state && state.messagesView === 'chat' && state.chatId) {
            this.activeChatId = state.chatId;
            this.mobileView = 'chat';
        } else {
            this.mobileView = 'list';
        }
        this.render();
    }
}

customElements.define('messages-overlay', MessagesOverlay);
