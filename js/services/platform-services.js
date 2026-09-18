/**
 * Servicios de plataforma con datos de ejemplo.
 * Conectar endpoints reales según comentarios API en cada método.
 */
(function (global) {
    'use strict';

    const STORAGE_KEYS = {
        notifications: 'artesana_notifications',
        messages: 'artesana_messages',
        chats: 'artesana_chats',
        orders: 'artesana_orders'
    };

    const CHATS_VERSION = '3';
    const DIRECTORS_CHAT_ID = 'chat-directivos';

    function load(key, fallback) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : fallback;
        } catch {
            return fallback;
        }
    }

    function save(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    }

    const sampleNotifications = [
        { id: 1, type: 'order', title: 'Pedido en camino', message: 'Tu pedido #1042 fue enviado.', read: false, createdAt: '2026-06-28T10:00:00Z' },
        { id: 2, type: 'message', title: 'Nuevo mensaje', message: 'El equipo directivo revisó tu consulta.', read: false, createdAt: '2026-06-29T14:30:00Z' },
        { id: 3, type: 'promo', title: 'Producto destacado', message: 'Nueva mola tradicional en Explorar.', read: true, createdAt: '2026-06-25T09:00:00Z' }
    ];

    const sampleOrders = [
        { id: '1042', status: 'shipped', statusLabel: 'Enviado', product: 'Mola Tradicional Guna', total: 89.99, updatedAt: '2026-06-28' },
        { id: '1038', status: 'processing', statusLabel: 'Procesando', product: 'Cerámica Emberá', total: 45.00, updatedAt: '2026-06-26' },
        { id: '1031', status: 'delivered', statusLabel: 'Entregado', product: 'Collar de Tagua', total: 32.50, updatedAt: '2026-06-20' }
    ];

    function getLang() {
        return localStorage.getItem('lang') || 'es';
    }

    function getDirectorsChatDefaults() {
        const lang = getLang();
        const welcome = lang === 'en'
            ? 'Welcome to the ArteSana leadership channel. Write your message here — an AI assistant will reply right away while a director reviews your case.'
            : 'Bienvenido al canal con los directivos de ArteSana. Escribe tu mensaje aquí — un asistente AI te responderá al instante mientras un directivo revisa tu consulta.';
        const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        return {
            id: DIRECTORS_CHAT_ID,
            type: 'directors',
            artisanId: null,
            artisanName: lang === 'en' ? 'ArteSana Leadership' : 'Directivos ArteSana',
            artisanAvatar: 'assets/ArteSana_logo.png',
            lastMessage: welcome,
            unread: 0,
            messages: [
                { id: 1, sender: 'director', text: welcome, time: now, fromAI: true }
            ]
        };
    }

    function normalizeChats(stored) {
        const version = localStorage.getItem('artesana_chats_version');
        const list = Array.isArray(stored) ? stored : [];
        const hasDirectors = list.some(c => c.type === 'directors' || c.id === DIRECTORS_CHAT_ID);

        if (version === CHATS_VERSION) {
            if (!hasDirectors) {
                const withDirectors = [getDirectorsChatDefaults(), ...list];
                save(STORAGE_KEYS.chats, withDirectors);
                return withDirectors;
            }
            return list.length ? list : [getDirectorsChatDefaults()];
        }

        const directorsChat = list.find(c => c.type === 'directors' || c.id === DIRECTORS_CHAT_ID) || getDirectorsChatDefaults();
        const artisanChats = list.filter(c => c.type === 'artisan' && c.artisanId);
        const next = [directorsChat, ...artisanChats];

        localStorage.setItem('artesana_chats_version', CHATS_VERSION);
        save(STORAGE_KEYS.chats, next);
        return next;
    }

    const PlatformServices = {
        // --- Notificaciones ---
        // API: GET /api/notifications
        getNotifications() {
            return load(STORAGE_KEYS.notifications, sampleNotifications);
        },

        // API: PATCH /api/notifications/:id/read
        markNotificationRead(id) {
            const list = PlatformServices.getNotifications().map(n =>
                n.id === id ? { ...n, read: true } : n
            );
            save(STORAGE_KEYS.notifications, list);
            return list;
        },

        getUnreadNotificationCount() {
            return PlatformServices.getNotifications().filter(n => !n.read).length;
        },

        // --- Centro de mensajes (canal directivo + asistente AI) ---
        // API: GET /api/messages
        getMessageThreads() {
            return normalizeChats(load(STORAGE_KEYS.chats, null));
        },

        ensureDirectorsChat() {
            const chats = PlatformServices.getMessageThreads();
            return chats.find(c => c.type === 'directors' || c.id === DIRECTORS_CHAT_ID) || chats[0];
        },

        // API: GET /api/messages/:chatId
        getChatMessages(chatId) {
            const chats = PlatformServices.getMessageThreads();
            return chats.find(c => c.id === chatId)?.messages || [];
        },

        // API: POST /api/messages/:chatId
        sendMessage(chatId, text, sender = 'buyer', meta = {}) {
            const chats = PlatformServices.getMessageThreads();
            const chat = chats.find(c => c.id === chatId);
            if (!chat) return null;

            const msg = {
                id: Date.now(),
                sender,
                text: global.SecurityUtils ? global.SecurityUtils.sanitizeInput(text, 1000) : text,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                fromAI: !!meta.fromAI
            };
            chat.messages.push(msg);
            chat.lastMessage = msg.text;
            save(STORAGE_KEYS.chats, chats);

            if ((sender === 'buyer' || sender === 'user') && chat.type === 'directors') {
                PlatformServices._scheduleDirectorsReply(chatId, msg.text);
            }
            if ((sender === 'buyer' || sender === 'user') && chat.type === 'artisan') {
                PlatformServices._scheduleArtisanReply(chatId);
            }

            return msg;
        },

        _scheduleDirectorsReply(chatId, userText) {
            const delay = 900 + Math.floor(Math.random() * 1100);
            setTimeout(() => {
                const reply = PlatformServices.getDirectorsChatResponse(userText);
                PlatformServices.sendMessage(chatId, reply, 'director', { fromAI: true });
                document.dispatchEvent(new CustomEvent('messages:updated', { detail: { chatId } }));
            }, delay);
        },

        getDirectorsChatResponse(userMessage) {
            const lang = getLang();
            const answer = PlatformServices.getChatbotResponse(userMessage);
            const intros = lang === 'en' ? [
                'Thank you for writing to ArteSana leadership. A director will review this soon. Meanwhile: ',
                'Your message was received by our leadership team. While you wait for a director: ',
                'We got your message. An AI assistant is helping until a director responds: '
            ] : [
                'Gracias por escribir a los directivos de ArteSana. Un directivo revisará esto pronto. Mientras tanto: ',
                'Recibimos tu mensaje en el equipo directivo. Hasta que un directivo responda: ',
                'Tu consulta llegó al canal directivo. Un asistente AI te ayuda mientras esperas: '
            ];
            return intros[Math.floor(Math.random() * intros.length)] + answer;
        },

        _scheduleArtisanReply(chatId) {
            const delay = 800 + Math.floor(Math.random() * 900);
            setTimeout(() => {
                const lang = getLang();
                const reply = lang === 'en'
                    ? 'Thanks for writing! I will reply as soon as I can.'
                    : '¡Gracias por escribir! Te responderé lo más pronto posible.';
                PlatformServices.sendMessage(chatId, reply, 'artisan');
                document.dispatchEvent(new CustomEvent('messages:updated', { detail: { chatId } }));
            }, delay);
        },

        // --- Chat con vendedor o canal directivo ---
        // API: POST /api/chats
        startChatWithArtisan(artisan) {
            if (!artisan || artisan.id == null || artisan.id === '') {
                return PlatformServices.ensureDirectorsChat();
            }

            const chats = PlatformServices.getMessageThreads();
            const artisanId = String(artisan.id);
            const existing = chats.find(c => c.type === 'artisan' && String(c.artisanId) === artisanId);
            if (existing) return existing;

            const lang = getLang();
            const welcome = lang === 'en'
                ? `Hi! This is the chat with ${artisan.name || 'the artisan'}. Send a message about a product or your order.`
                : `¡Hola! Este es el chat con ${artisan.name || 'el artesano'}. Escribe sobre un producto o tu pedido.`;
            const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const chat = {
                id: 'chat-artisan-' + artisanId,
                type: 'artisan',
                artisanId,
                artisanName: artisan.name || (lang === 'en' ? 'Artisan' : 'Artesano'),
                artisanAvatar: artisan.avatar || '',
                lastMessage: welcome,
                unread: 0,
                messages: [
                    { id: Date.now(), sender: 'artisan', text: welcome, time: now }
                ]
            };
            chats.splice(1, 0, chat);
            save(STORAGE_KEYS.chats, chats);
            return chat;
        },

        // --- Estados de pedidos ---
        // API: GET /api/orders
        getOrders() {
            return load(STORAGE_KEYS.orders, sampleOrders);
        },

        // API: GET /api/orders/:id
        getOrderById(id) {
            return PlatformServices.getOrders().find(o => o.id === id);
        },

        getOrderStatusClass(status) {
            const map = {
                pending: 'status-pending',
                processing: 'status-processing',
                shipped: 'status-shipped',
                delivered: 'status-delivered',
                cancelled: 'status-cancelled'
            };
            return map[status] || 'status-pending';
        },

        // --- Productos destacados ---
        // API: GET /api/products/featured
        getFeaturedProducts(limit = 6) {
            if (global.userProductsDB) {
                const all = global.userProductsDB.getAllProducts();
                const featured = all.filter(p => p.tags && p.tags.includes('featured'));
                return (featured.length ? featured : all).slice(0, limit);
            }
            return [];
        },

        // --- Chatbot de ayuda ---
        // API: POST /api/chatbot
        getChatbotResponse(userMessage) {
            const msg = (userMessage || '').toLowerCase();
            const lang = localStorage.getItem('lang') || 'es';

            const responses = lang === 'en' ? {
                shipping: 'We ship worldwide with protected packaging. Delivery times vary by region (5-15 business days).',
                returns: 'You can request a return within 14 days if the product arrives damaged.',
                payment: 'We accept credit cards, PayPal and bank transfer at checkout.',
                artisan: 'Artisans can create their store from Profile > My Store section.',
                default: 'I can help with shipping, returns, payments or creating your store. What do you need?'
            } : {
                shipping: 'Enviamos a todo el mundo con empaque protegido. Entrega en 5-15 días hábiles según región.',
                returns: 'Puedes solicitar devolución en 14 días si el producto llega dañado.',
                payment: 'Aceptamos tarjetas, PayPal y transferencia en el checkout.',
                artisan: 'Los artesanos pueden crear su tienda desde Perfil > Mi Tienda.',
                default: 'Puedo ayudarte con envíos, devoluciones, pagos o crear tu tienda. ¿Qué necesitas?'
            };

            if (/env[ií]o|shipping|entrega/.test(msg)) return responses.shipping;
            if (/devol|return|reembol/.test(msg)) return responses.returns;
            if (/pago|payment|tarjeta|paypal/.test(msg)) return responses.payment;
            if (/tienda|artesano|store|vender/.test(msg)) return responses.artisan;
            return responses.default;
        }
    };

    global.PlatformServices = PlatformServices;
})(window);
