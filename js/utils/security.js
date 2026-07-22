/**
 * Utilidades de seguridad: sanitización, validación y protección XSS.
 * Conectar validaciones del servidor en producción (API backend).
 */
(function (global) {
    'use strict';

    const SecurityUtils = {
        escapeHtml(str) {
            if (str == null) return '';
            const div = document.createElement('div');
            div.textContent = String(str);
            return div.innerHTML;
        },

        sanitizeInput(input, maxLength = 500) {
            if (input == null) return '';
            return String(input)
                .trim()
                .slice(0, maxLength)
                .replace(/[<>]/g, '');
        },

        validateEmail(email) {
            const sanitized = SecurityUtils.sanitizeInput(email, 254);
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(sanitized);
        },

        validatePassword(password, minLength = 6) {
            return typeof password === 'string' && password.length >= minLength;
        },

        validateRequired(value) {
            return SecurityUtils.sanitizeInput(value).length > 0;
        },

        validatePhone(phone) {
            const cleaned = String(phone).replace(/[\s\-()]/g, '');
            return /^\+?[0-9]{7,15}$/.test(cleaned);
        },

        /** Genera HTML seguro para insertar en innerHTML con datos de usuario */
        safeText(str) {
            return SecurityUtils.escapeHtml(str);
        }
    };

    global.SecurityUtils = SecurityUtils;
})(window);
