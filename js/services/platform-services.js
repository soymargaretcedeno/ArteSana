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
        { id: 2, type: 'message', title: 'Nuevo mensaje', message: 'Ana Díaz respondió sobre tu consulta.', read: false, createdAt: '2026-06-29T14:30:00Z' },
        { id: 3, type: 'promo', title: 'Producto destacado', message: 'Nueva mola tradicional en Explorar.', read: true, createdAt: '2026-06-25T09:00:00Z' }
    ];

    const sampleOrders = [
        { id: '1042', status: 'shipped', statusLabel: 'Enviado', product: 'Mola Tradicional Guna', total: 89.99, updatedAt: '2026-06-28' },
        { id: '1038', status: 'processing', statusLabel: 'Procesando', product: 'Cerámica Emberá', total: 45.00, updatedAt: '2026-06-26' },
        { id: '1031', status: 'delivered', statusLabel: 'Entregado', product: 'Collar de Tagua', total: 32.50, updatedAt: '2026-06-20' }
    ];

    const sampleChats = [
        {
            id: 'chat-1',
            artisanId: 1,
            artisanName: 'Ana Díaz',
            artisanAvatar: 'https://randomuser.me/api/portraits/women/1.jpg',
            lastMessage: '¡Claro! Puedo personalizar el diseño.',
            unread: 1,
            messages: [
                { id: 1, sender: 'buyer', text: '¿Pueden hacer la mola en otro color?', time: '10:30' },
                { id: 2, sender: 'artisan', text: '¡Claro! Puedo personalizar el diseño.', time: '10:45' }
            ]
        }
    ];

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

        // --- Centro de mensajes ---
        // API: GET /api/messages
        getMessageThreads() {
            return load(STORAGE_KEYS.chats, sampleChats);
        },

        // API: GET /api/messages/:chatId
        getChatMessages(chatId) {
            const chats = PlatformServices.getMessageThreads();
            return chats.find(c => c.id === chatId)?.messages || [];
        },

        // API: POST /api/messages/:chatId
        sendMessage(chatId, text, sender = 'buyer') {
            const chats = PlatformServices.getMessageThreads();
            const chat = chats.find(c => c.id === chatId);
            if (!chat) return null;

            const msg = {
                id: Date.now(),
                sender,
                text: global.SecurityUtils ? global.SecurityUtils.sanitizeInput(text, 1000) : text,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            chat.messages.push(msg);
            chat.lastMessage = msg.text;
            if (sender === 'buyer') chat.unread = (chat.unread || 0) + 1;
            else chat.unread = 0;
            save(STORAGE_KEYS.chats, chats);
            return msg;
        },

        // --- Chat comprador-artesano ---
        // API: POST /api/chats (iniciar conversación con artesano)
        startChatWithArtisan(artisanId, artisanName, artisanAvatar, options = {}) {
            const chats = PlatformServices.getMessageThreads();
            const buyer = global.localDB && global.localDB.getCurrentUser();
            const buyerId = options.buyerId || (buyer && buyer.id) || null;
            const storeId = options.storeId || null;

            const existing = chats.find(c =>
                c.artisanId === artisanId &&
                (buyerId == null || c.buyerId == null || c.buyerId === buyerId) &&
                (!storeId || !c.storeId || c.storeId === storeId)
            );
            if (existing) return existing;

            const chat = {
                id: 'chat-' + artisanId + '-' + (buyerId || 'guest') + '-' + Date.now(),
                artisanId,
                artisanName,
                artisanAvatar: artisanAvatar || '',
                storeId,
                storeName: options.storeName || '',
                buyerId,
                buyerName: (buyer && buyer.name) || options.buyerName || 'Visitante',
                lastMessage: '',
                unread: 0,
                messages: []
            };
            chats.unshift(chat);
            save(STORAGE_KEYS.chats, chats);
            return chat;
        },

        /** Hilos donde el usuario es el vendedor */
        getSellerThreads(artisanId) {
            return PlatformServices.getMessageThreads().filter(c => c.artisanId === artisanId);
        },

        /** Hilos del comprador actual */
        getBuyerThreads(buyerId) {
            return PlatformServices.getMessageThreads().filter(c =>
                c.buyerId === buyerId || (!c.buyerId && c.artisanId !== buyerId)
            );
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
                artisan: 'To sell, choose Seller when you register, or use “Become a seller” at the end of Explore.',
                default: 'I can help with shipping, returns, payments or creating your store. What do you need?'
            } : {
                shipping: 'Enviamos a todo el mundo con empaque protegido. Entrega en 5-15 días hábiles según región.',
                returns: 'Puedes solicitar devolución en 14 días si el producto llega dañado.',
                payment: 'Aceptamos tarjetas, PayPal y transferencia en el checkout.',
                artisan: 'Para vender, elige Vendedor al registrarte, o usa “Convertirme en vendedor” al final de Explorar.',
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
