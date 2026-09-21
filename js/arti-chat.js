/**
 * Arti, guía de ArteSana: cambia de pose, objeto y esquina según la página y el tema.
 */
(function (global) {
    'use strict';

    const POSES = {
        greet: 'assets/arti-hero.png',
        talk: 'assets/arti-guide-clear.png',
        shop: 'assets/arti-basket-clear.png'
    };

    function t(key, fallback) {
        return window.t ? window.t(key, fallback) : fallback;
    }

    const PAGE_THEMES = {
        home: { pose: 'greet', corner: 'left', hintKey: 'arti_hint_home', hide: true },
        explore: { pose: 'talk', corner: 'left', hintKey: 'arti_hint_explore' },
        store: { pose: 'shop', corner: 'left', hintKey: 'arti_hint_store' },
        product: { pose: 'talk', corner: 'left', hintKey: 'arti_hint_product' },
        messages: { pose: 'talk', corner: 'left', hintKey: 'arti_hint_messages' },
        profile: { pose: 'shop', corner: 'left', hintKey: 'arti_hint_profile' },
        cart: { pose: 'shop', corner: 'left', hintKey: 'arti_hint_cart' },
        default: { pose: 'greet', corner: 'left', hintKey: 'arti_hint_default' }
    };

    function replies() {
        return {
            hola: { pose: 'greet', text: t('arti_reply_hola', '¡Hola! Soy Arti, tu guía en ArteSana.') },
            categorias: { pose: 'talk', text: t('arti_reply_categorias', 'Tenemos cestería, textiles, cerámica, joyería y madera.') },
            artesanos: { pose: 'talk', text: t('arti_reply_artesanos', 'Cada pieza la hace un artesano panameño.') },
            vender: { pose: 'shop', text: t('arti_reply_vender', 'Si eres artesano, inicia sesión y publica tus piezas.') },
            envios: { pose: 'shop', text: t('arti_reply_envios', 'Hacemos envíos a todo Panamá y también internacionales.') },
            comprar: { pose: 'shop', text: t('arti_reply_comprar', 'Explora, guarda favoritos y paga seguro.') },
            default: { pose: 'talk', text: t('arti_reply_default', 'Puedo ayudarte con categorías, artesanos, envíos o cómo vender.') }
        };
    }

    function detectPage() {
        const file = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
        if (!file || file === 'index.html') return 'home';
        if (/explorar|ceramic|textil|jewel|sculpt/.test(file)) return 'explore';
        if (/store|tienda/.test(file)) return 'store';
        if (/mensaje/.test(file)) return 'messages';
        if (/perfil|add-product|seleccionar-rol/.test(file)) return 'profile';
        if (/cart|checkout|order/.test(file)) return 'cart';
        if (/product/.test(file)) return 'product';
        return 'default';
    }

    function currentTheme() {
        return document.documentElement.getAttribute('data-theme') || localStorage.getItem('theme') || 'light';
    }

    function loadCss() {
        if (document.querySelector('link[href="css/arti.css"]')) return;
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'css/arti.css';
        document.head.appendChild(link);
    }

    function ensureModal() {
        let modal = document.getElementById('artiModal');
        if (modal) return modal;
        modal = document.createElement('div');
        modal.className = 'arti-modal';
        modal.id = 'artiModal';
        modal.setAttribute('role', 'dialog');
        modal.setAttribute('aria-modal', 'true');
        modal.setAttribute('aria-labelledby', 'artiModalTitle');
        modal.innerHTML = `
            <div class="arti-modal-card arti-chat-card">
                <div class="arti-chat-head">
                    <img id="artiChatPose" src="${POSES.greet}" alt="Arti">
                    <div>
                    <h3 id="artiModalTitle">${t('arti_title', 'Hola, soy Arti')}</h3>
                    <p>${t('arti_subtitle', 'Tu guía en ArteSana')}</p>
                </div>
                <button type="button" class="arti-chat-close" id="closeArtiModal" aria-label="${t('close', 'Cerrar')}">×</button>
            </div>
            <div class="arti-chat-messages" id="artiChatMessages"></div>
            <div class="arti-chat-prompts">
                <button type="button" data-arti-prompt="categorias">${t('arti_prompt_cats', 'Categorías')}</button>
                <button type="button" data-arti-prompt="artesanos">${t('arti_prompt_artisans', 'Artesanos')}</button>
                <button type="button" data-arti-prompt="vender">${t('arti_prompt_sell', 'Quiero vender')}</button>
                <button type="button" data-arti-prompt="envios">${t('arti_prompt_ship', 'Envíos')}</button>
            </div>
            <form class="arti-chat-form" id="artiChatForm">
                <input id="artiChatInput" type="text" placeholder="${t('arti_input_ph', 'Escríbele a Arti...')}" autocomplete="off">
                <button type="submit">${t('arti_send', 'Enviar')}</button>
                </form>
            </div>`;
        document.body.appendChild(modal);
        return modal;
    }

    function ensureCompanion(theme) {
        let btn = document.getElementById('artiCompanion');
        if (!btn) {
            btn = document.createElement('button');
            btn.type = 'button';
            btn.id = 'artiCompanion';
            btn.className = 'arti-companion';
            btn.setAttribute('aria-label', t('arti_talk', 'Hablar con Arti'));
            btn.innerHTML = `
                <span class="arti-hint" id="artiHint"></span>
                <img class="arti-companion-figure" id="artiCompanionImg" alt="Arti">
            `;
            document.body.appendChild(btn);
        }
        applyPageTheme(btn, theme);
        return btn;
    }

    function applyPageTheme(btn, pageTheme) {
        const theme = currentTheme();
        let { pose, hint } = pageTheme;
        const corner = 'left';
        if (theme === 'dark' && pose === 'greet') pose = 'talk';
        btn.dataset.pose = pose;
        btn.dataset.corner = corner;
        btn.dataset.theme = theme;
        if (pageTheme.hide) {
            btn.hidden = true;
            btn.classList.add('is-hidden');
        } else {
            btn.hidden = false;
            btn.classList.remove('is-hidden');
        }
        const img = btn.querySelector('#artiCompanionImg');
        if (img) img.src = POSES[pose] || POSES.greet;
        const hintEl = btn.querySelector('#artiHint');
        if (hintEl) hintEl.textContent = t(pageTheme.hintKey || 'arti_hint_default', pageTheme.hint || '');
    }

    function setPose(img, pose) {
        if (!img) return;
        img.src = POSES[pose] || POSES.talk;
        const companion = document.getElementById('artiCompanion');
        if (companion) {
            companion.dataset.pose = pose;
            const figure = companion.querySelector('#artiCompanionImg');
            if (figure) figure.src = POSES[pose] || POSES.talk;
        }
    }

    function addBubble(list, text, from) {
        if (!list) return;
        const el = document.createElement('div');
        el.className = 'arti-bubble arti-bubble-' + from;
        el.textContent = text;
        list.appendChild(el);
        list.scrollTop = list.scrollHeight;
    }

    function replyTo(raw) {
        const q = (raw || '').toLowerCase();
        const R = replies();
        if (/hola|buenas|hey|hello|hi\b/.test(q)) return R.hola;
        if (/categ|mola|cerám|ceram|joy|textil|madera|cester|categor/.test(q)) return R.categorias;
        if (/artesano|tienda|vendedor|artisan|seller/.test(q)) return R.artesanos;
        if (/vend|public|tienda mía|soy artesano|sell|publish/.test(q)) return R.vender;
        if (/enví|envi|envio|ship/.test(q)) return R.envios;
        if (/compr|precio|carrito|favorit|buy|cart|price/.test(q)) return R.comprar;
        return R.default;
    }

    function applyArtiI18n() {
        const modal = document.getElementById('artiModal');
        if (!modal) return;
        const title = modal.querySelector('#artiModalTitle');
        const subtitle = modal.querySelector('.arti-chat-head p');
        const close = modal.querySelector('#closeArtiModal');
        const input = modal.querySelector('#artiChatInput');
        const send = modal.querySelector('.arti-chat-form button[type="submit"]');
        if (title) title.textContent = t('arti_title', title.textContent);
        if (subtitle) subtitle.textContent = t('arti_subtitle', subtitle.textContent);
        if (close) close.setAttribute('aria-label', t('close', 'Cerrar'));
        if (input) input.setAttribute('placeholder', t('arti_input_ph', input.placeholder));
        if (send) send.textContent = t('arti_send', send.textContent);
        modal.querySelectorAll('[data-arti-prompt]').forEach((btn) => {
            const map = {
                categorias: 'arti_prompt_cats',
                artesanos: 'arti_prompt_artisans',
                vender: 'arti_prompt_sell',
                envios: 'arti_prompt_ship'
            };
            const key = map[btn.getAttribute('data-arti-prompt')];
            if (key) btn.textContent = t(key, btn.textContent);
        });
    }

    function init() {
        if (document.body.dataset.artiReady === 'true') return;
        document.body.dataset.artiReady = 'true';
        loadCss();

        const pageKey = detectPage();
        const pageTheme = PAGE_THEMES[pageKey] || PAGE_THEMES.default;
        const modal = ensureModal();
        const companion = ensureCompanion(pageTheme);
        const img = document.getElementById('artiChatPose');
        const list = document.getElementById('artiChatMessages');
        const form = document.getElementById('artiChatForm');
        const input = document.getElementById('artiChatInput');

        const open = () => {
            modal.classList.add('open');
            companion.classList.add('is-hidden');
            if (list && !list.dataset.started) {
                list.dataset.started = 'true';
                setPose(img, pageTheme.pose);
                addBubble(list, replies().hola.text, 'arti');
            }
            requestAnimationFrame(() => input?.focus());
        };

        const close = () => {
            modal.classList.remove('open');
            if (!pageTheme.hide) companion.classList.remove('is-hidden');
        };

        companion.addEventListener('click', open);
        document.getElementById('openArtiInfo')?.addEventListener('click', open);
        document.getElementById('openArtiChat')?.addEventListener('click', open);
        document.getElementById('closeArtiModal')?.addEventListener('click', close);
        modal.addEventListener('click', (e) => { if (e.target === modal) close(); });
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('open')) close();
        });

        document.querySelectorAll('[data-arti-prompt]').forEach((btn) => {
            btn.addEventListener('click', () => {
                const prompt = btn.getAttribute('data-arti-prompt');
                const answer = replyTo(prompt);
                addBubble(list, btn.textContent, 'user');
                setPose(img, answer.pose);
                setTimeout(() => addBubble(list, answer.text, 'arti'), 280);
            });
        });

        form?.addEventListener('submit', (e) => {
            e.preventDefault();
            const text = (input.value || '').trim();
            if (!text) return;
            addBubble(list, text, 'user');
            input.value = '';
            const answer = replyTo(text);
            setPose(img, answer.pose);
            setTimeout(() => addBubble(list, answer.text, 'arti'), 280);
        });

        document.addEventListener('themeChanged', () => applyPageTheme(companion, pageTheme));
        window.addEventListener('languageChanged', () => {
            applyArtiI18n();
            applyPageTheme(companion, pageTheme);
        });
        applyArtiI18n();
        window.addEventListener('storage', (e) => {
            if (e.key === 'theme') applyPageTheme(companion, pageTheme);
        });
    }

    global.ArtiGuide = { init, detectPage, POSES };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})(window);
