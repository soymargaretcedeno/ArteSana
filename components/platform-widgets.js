/**
 * Widgets flotantes: chatbot de ayuda, centro de mensajes y notificaciones.
 * Misma paleta visual; panel oculto hasta interacción del usuario.
 */
class PlatformWidgets extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.activePanel = null;
        this._onMessagesOpened = () => this.hideAllButtons();
        this._onMessagesClosed = () => this.showAllButtons();
    }

    connectedCallback() {
        this.render();
        this.bindEvents();
        this.updateBadge();
        this._onLang = () => this.updateI18nTexts();
        window.addEventListener('languageChanged', this._onLang);
        document.addEventListener('messages:opened', this._onMessagesOpened);
        document.addEventListener('messages:closed', this._onMessagesClosed);
    }

    disconnectedCallback() {
        window.removeEventListener('languageChanged', this._onLang);
        document.removeEventListener('messages:opened', this._onMessagesOpened);
        document.removeEventListener('messages:closed', this._onMessagesClosed);
    }

    isEnhancedMessages() {
        return document.body.dataset.enhancedMessages === 'true';
    }

    t(key, fallback) {
        const lang = localStorage.getItem('lang') || 'es';
        return (window.translations && window.translations[lang] && window.translations[lang][key]) || fallback;
    }

    render() {
        const unread = window.PlatformServices ? window.PlatformServices.getUnreadNotificationCount() : 0;

        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    font-family: 'Poppins', sans-serif;
                    font-size: 16px;
                    line-height: 1.4;
                }
                .platform-widgets {
                    position: fixed;
                    bottom: 18px;
                    right: 18px;
                    z-index: 9990;
                    display: flex;
                    flex-direction: column;
                    gap: 6px;
                    align-items: flex-end;
                    width: auto;
                }
                .widget-btn {
                    width: auto;
                    min-height: 32px;
                    height: 32px;
                    border-radius: 999px;
                    border: none;
                    background: #8F1111;
                    color: #fff;
                    cursor: pointer;
                    box-shadow: 0 3px 10px rgba(61, 42, 29, 0.16);
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    gap: 6px;
                    padding: 0 10px 0 8px;
                    font-size: 0.72rem;
                    font-weight: 600;
                    font-family: 'Poppins', sans-serif;
                    transition: background 0.2s ease, box-shadow 0.2s ease;
                    position: relative;
                    white-space: nowrap;
                }
                .widget-btn svg {
                    width: 14px;
                    height: 14px;
                    flex-shrink: 0;
                }
                .widget-btn:hover, .widget-btn:focus-visible {
                    background: #a31616;
                    box-shadow: 0 8px 20px rgba(61, 42, 29, 0.22);
                    outline: 2px solid #D4A017;
                    outline-offset: 2px;
                }
                .widget-btn.is-open {
                    background: #6B4423;
                }
                .widget-badge {
                    margin-left: 2px;
                    background: #D4A017;
                    color: #000;
                    font-size: 0.62rem;
                    font-weight: 700;
                    min-width: 14px;
                    height: 14px;
                    padding: 0 4px;
                    border-radius: 999px;
                    display: ${unread ? 'flex' : 'none'};
                    align-items: center;
                    justify-content: center;
                }
                .widget-panel {
                    display: none;
                    position: fixed;
                    bottom: 88px;
                    right: 18px;
                    width: min(320px, calc(100vw - 32px));
                    max-height: min(380px, calc(100vh - 140px));
                    background: #fff;
                    border-radius: 16px;
                    box-shadow: 0 12px 40px rgba(0,0,0,0.2);
                    overflow: hidden;
                    flex-direction: column;
                    font-family: 'Poppins', sans-serif;
                }
                .widget-panel.open { display: flex; }
                .panel-header {
                    background: #8F1111;
                    color: #fff;
                    padding: 14px 16px;
                    font-weight: 600;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .panel-close {
                    background: none;
                    border: none;
                    color: #fff;
                    cursor: pointer;
                    font-size: 1.2rem;
                    padding: 4px;
                }
                .panel-body {
                    padding: 12px;
                    overflow-y: auto;
                    flex: 1;
                    font-size: 0.9rem;
                    color: #333;
                }
                .chat-messages { display: flex; flex-direction: column; gap: 8px; margin-bottom: 10px; max-height: 220px; overflow-y: auto; }
                #panelHelp .panel-body {
                    display: flex;
                    flex-direction: column;
                    min-height: 220px;
                    padding: 12px;
                }
                #panelHelp .chat-messages {
                    flex: 1;
                    min-height: 140px;
                    max-height: none;
                    margin-bottom: 10px;
                }
                .chat-msg { padding: 8px 12px; border-radius: 12px; max-width: 85%; }
                .chat-msg.bot, .chat-msg.artisan { background: #f5f5f5; align-self: flex-start; }
                .chat-msg.user, .chat-msg.buyer { background: #8F1111; color: #fff; align-self: flex-end; }
                .chat-input-row { display: flex; gap: 8px; }
                .chat-input-row input {
                    flex: 1;
                    border: 1px solid #ddd;
                    border-radius: 8px;
                    padding: 10px 12px;
                    font-family: inherit;
                    font-size: 0.95rem;
                }
                .chat-input-row button {
                    background: #8F1111;
                    color: #fff;
                    border: none;
                    border-radius: 8px;
                    padding: 10px 14px;
                    cursor: pointer;
                }
                .notif-item {
                    padding: 12px 10px;
                    border-bottom: 1px solid #eee;
                    cursor: pointer;
                    line-height: 1.45;
                }
                .notif-item.unread { background: rgba(150,38,38,0.06); font-weight: 600; }
                .notif-item:hover { background: rgba(150,38,38,0.04); }
                @media (max-width: 576px) {
                    .platform-widgets { bottom: 14px; right: 12px; }
                    .widget-panel { right: 12px; bottom: 82px; width: calc(100vw - 24px); }
                }
            </style>
            <div class="platform-widgets" role="complementary" aria-label="Ayuda y notificaciones">
                <div class="widget-panel" id="panelHelp" role="dialog" aria-label="Preguntas">
                    <div class="panel-header">
                        <span data-i18n="help_chatbot">${this.t('help_chatbot', 'Preguntas')}</span>
                        <button class="panel-close" data-close aria-label="Cerrar" data-i18n-aria="close">&times;</button>
                    </div>
                    <div class="panel-body">
                        <div class="chat-messages" id="helpMessages"></div>
                        <div class="chat-input-row">
                            <input type="text" id="helpInput" placeholder="${this.t('help_placeholder', 'Escribe tu pregunta...')}" data-i18n-placeholder="help_placeholder" aria-label="Mensaje de ayuda">
                            <button type="button" id="helpSend" aria-label="Enviar">
                                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
                            </button>
                        </div>
                    </div>
                </div>
                <div class="widget-panel" id="panelNotifications" role="dialog" aria-label="Notificaciones">
                    <div class="panel-header">
                        <span data-i18n="notifications">${this.t('notifications', 'Notificaciones')}</span>
                        <button class="panel-close" data-close aria-label="Cerrar" data-i18n-aria="close">&times;</button>
                    </div>
                    <div class="panel-body" id="notificationsList"></div>
                </div>
                <button class="widget-btn" id="btnNotifications" aria-label="Notificaciones" title="Notificaciones">
                    <svg class="icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/></svg>
                    <span data-i18n="notifications">${this.t('notifications', 'Notificaciones')}</span>
                    <span class="widget-badge" id="notifBadge">${unread}</span>
                </button>
                <button class="widget-btn" id="btnHelp" aria-label="Preguntas" title="Preguntas">
                    <svg class="icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/></svg>
                    <span data-i18n="questions_widget">${this.t('questions_widget', 'Preguntas')}</span>
                </button>
            </div>
        `;
    }

    bindEvents() {
        const root = this.shadowRoot;
        root.getElementById('btnHelp').addEventListener('click', () => this.togglePanel('panelHelp'));
        root.getElementById('btnNotifications').addEventListener('click', () => {
            this.renderNotifications();
            this.togglePanel('panelNotifications');
        });

        root.querySelectorAll('[data-close]').forEach(btn => {
            btn.addEventListener('click', () => this.closeAllPanels());
        });

        const helpSend = root.getElementById('helpSend');
        const helpInput = root.getElementById('helpInput');
        const sendHelp = () => {
            const text = helpInput.value.trim();
            if (!text) return;
            this.appendHelpMessage('user', text);
            helpInput.value = '';
            setTimeout(() => {
                const reply = window.PlatformServices.getChatbotResponse(text);
                this.appendHelpMessage('bot', reply);
            }, 400);
        };
        helpSend.addEventListener('click', sendHelp);
        helpInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') sendHelp();
        });

        if (!root.getElementById('helpMessages').children.length) {
            this.appendHelpMessage('bot', this.t('help_welcome', '¡Hola! Soy el asistente de ArteSana. ¿En qué puedo ayudarte?'));
        }
    }

    updateI18nTexts() {
        const lang = window.currentLang ? window.currentLang() : 'es';
        if (window.applyI18nToRoot) window.applyI18nToRoot(this.shadowRoot, lang);
        const notif = this.t('notifications', 'Notificaciones');
        const help = this.t('questions_widget', 'Preguntas');
        const nBtn = this.shadowRoot.getElementById('btnNotifications');
        const hBtn = this.shadowRoot.getElementById('btnHelp');
        if (nBtn) { nBtn.setAttribute('aria-label', notif); nBtn.setAttribute('title', notif); }
        if (hBtn) { hBtn.setAttribute('aria-label', help); hBtn.setAttribute('title', help); }
    }

    appendHelpMessage(role, text) {
        const el = document.createElement('div');
        el.className = 'chat-msg ' + role;
        el.textContent = text;
        this.shadowRoot.getElementById('helpMessages').appendChild(el);
    }

    renderMessages() {
        const list = this.shadowRoot.getElementById('messagesList');
        const threads = window.PlatformServices.getMessageThreads();
        const esc = window.SecurityUtils.escapeHtml;
        list.innerHTML = threads.length ? threads.map(t => `
            <div class="thread-item" data-chat="${t.id}">
                <strong>${esc(t.artisanName)}</strong>
                <div style="font-size:0.85rem;color:#666;">${esc(t.lastMessage || 'Sin mensajes')}</div>
            </div>
        `).join('') : `<p>${this.t('no_messages', 'No hay conversaciones.')} <!-- API: GET /api/messages --></p>`;
    }

    renderNotifications() {
        const list = this.shadowRoot.getElementById('notificationsList');
        const notifs = window.PlatformServices.getNotifications();
        const esc = window.SecurityUtils.escapeHtml;
        list.innerHTML = notifs.map(n => `
            <div class="notif-item ${n.read ? '' : 'unread'}" data-id="${n.id}">
                <strong>${esc(n.title)}</strong>
                <div style="font-size:0.85rem;">${esc(n.message)}</div>
            </div>
        `).join('');

        list.querySelectorAll('.notif-item').forEach(item => {
            item.addEventListener('click', () => {
                window.PlatformServices.markNotificationRead(Number(item.dataset.id));
                item.classList.remove('unread');
                this.updateBadge();
            });
        });
    }

    openMessagesOverlay() {
        this.closeAllPanels();
        this.hideAllButtons();
        if (typeof window.openArteSanaMessages === 'function') {
            window.openArteSanaMessages();
            return;
        }
        const overlay = document.querySelector('messages-overlay');
        if (overlay && typeof overlay.open === 'function') {
            overlay.open();
        } else {
            window.location.href = 'mensajes.html';
        }
    }

    hideAllButtons() {
        this.shadowRoot.querySelectorAll('.widget-btn').forEach(btn => btn.classList.add('hidden-btn'));
    }

    showAllButtons() {
        this.shadowRoot.querySelectorAll('.widget-btn').forEach(btn => btn.classList.remove('hidden-btn'));
    }

    togglePanel(id) {
        const panel = this.shadowRoot.getElementById(id);
        if (!panel) return;
        const isOpen = panel.classList.contains('open');
        this.closeAllPanels();
        if (!isOpen) {
            panel.classList.add('open');
            this.activePanel = id;
            const btnId = id === 'panelHelp' ? 'btnHelp' : 'btnNotifications';
            this.shadowRoot.getElementById(btnId)?.classList.add('is-open');
        }
    }

    closeAllPanels() {
        this.shadowRoot.querySelectorAll('.widget-panel').forEach(p => p.classList.remove('open'));
        this.shadowRoot.querySelectorAll('.widget-btn').forEach(btn => btn.classList.remove('is-open'));
        this.activePanel = null;
    }

    updateBadge() {
        const count = window.PlatformServices.getUnreadNotificationCount();
        const badge = this.shadowRoot.getElementById('notifBadge');
        if (badge) {
            badge.textContent = count;
            badge.style.display = count > 0 ? 'flex' : 'none';
        }
    }
}

customElements.define('platform-widgets', PlatformWidgets);
