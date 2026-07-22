/**
 * Validación reutilizable de formularios.
 */
(function (global) {
    'use strict';

    const FormValidation = {
        showFieldError(input, message) {
            input.classList.add('is-invalid');
            input.setAttribute('aria-invalid', 'true');
            let feedback = input.parentElement.querySelector('.invalid-feedback');
            if (!feedback) {
                feedback = document.createElement('div');
                feedback.className = 'invalid-feedback';
                feedback.setAttribute('role', 'alert');
                input.parentElement.appendChild(feedback);
            }
            feedback.textContent = message;
        },

        clearFieldError(input) {
            input.classList.remove('is-invalid');
            input.removeAttribute('aria-invalid');
            const feedback = input.parentElement.querySelector('.invalid-feedback');
            if (feedback) feedback.remove();
        },

        validateContactForm(form) {
            const lang = localStorage.getItem('lang') || 'es';
            const messages = {
                es: {
                    name: 'Ingresa tu nombre.',
                    email: 'Ingresa un correo válido.',
                    subject: 'Ingresa un asunto.',
                    message: 'Escribe tu mensaje.'
                },
                en: {
                    name: 'Please enter your name.',
                    email: 'Please enter a valid email.',
                    subject: 'Please enter a subject.',
                    message: 'Please enter your message.'
                }
            };
            const t = messages[lang] || messages.es;

            const name = form.querySelector('[name="name"], #contactName');
            const email = form.querySelector('[name="email"], #contactEmail');
            const subject = form.querySelector('[name="subject"], #contactSubject');
            const message = form.querySelector('[name="message"], #contactMessage');

            let valid = true;
            [name, email, subject, message].forEach(el => el && FormValidation.clearFieldError(el));

            if (name && !global.SecurityUtils.validateRequired(name.value)) {
                FormValidation.showFieldError(name, t.name);
                valid = false;
            }
            if (email && !global.SecurityUtils.validateEmail(email.value)) {
                FormValidation.showFieldError(email, t.email);
                valid = false;
            }
            if (subject && !global.SecurityUtils.validateRequired(subject.value)) {
                FormValidation.showFieldError(subject, t.subject);
                valid = false;
            }
            if (message && !global.SecurityUtils.validateRequired(message.value)) {
                FormValidation.showFieldError(message, t.message);
                valid = false;
            }

            return valid;
        },

        bindContactForm(formSelector) {
            const form = document.querySelector(formSelector);
            if (!form) return;

            form.addEventListener('submit', (e) => {
                e.preventDefault();
                if (!FormValidation.validateContactForm(form)) {
                    const firstInvalid = form.querySelector('.is-invalid');
                    if (firstInvalid) firstInvalid.focus();
                    return;
                }

                // API: POST /api/contact con datos sanitizados
                const payload = {
                    name: global.SecurityUtils.sanitizeInput(form.querySelector('[name="name"], #contactName')?.value),
                    email: global.SecurityUtils.sanitizeInput(form.querySelector('[name="email"], #contactEmail')?.value, 254),
                    subject: global.SecurityUtils.sanitizeInput(form.querySelector('[name="subject"], #contactSubject')?.value),
                    message: global.SecurityUtils.sanitizeInput(form.querySelector('[name="message"], #contactMessage')?.value, 2000)
                };

                form.dispatchEvent(new CustomEvent('contact:valid', { detail: payload, bubbles: true }));

                const lang = localStorage.getItem('lang') || 'es';
                const successMsg = lang === 'en'
                    ? 'Thank you! We will reply within 24 hours.'
                    : '¡Gracias! Te responderemos en menos de 24 horas.';
                alert(successMsg);
                form.reset();
            });
        }
    };

    global.FormValidation = FormValidation;
})(window);
