/**
 * Validación reutilizable de formularios.
 */
(function (global) {
    'use strict';

    global.ArteSanaContact = {
        email: 'ArteSana919@gmail.com',
        phoneDisplay: '+507 6396-2388',
        phoneTel: '+50763962388',
        whatsapp: '50763962388',
        address: '',
        instagram: '',
        facebook: '',
        twitter: ''
    };

    function tMsg(key, fallback) {
        return global.t ? global.t(key, fallback) : fallback;
    }

    function applyContactInfo() {
        const info = global.ArteSanaContact || {};
        const visit = document.getElementById('contactVisitBlock');
        const addressEl = document.getElementById('contactAddressText');
        if (visit) {
            if (info.address) {
                visit.hidden = false;
                if (addressEl) addressEl.textContent = info.address;
            } else {
                visit.hidden = true;
            }
        }
        const social = document.getElementById('contactSocial');
        if (social) {
            const items = [
                { href: info.instagram, label: 'Instagram', icon: 'fa-instagram' },
                { href: info.facebook, label: 'Facebook', icon: 'fa-facebook' },
                { href: info.twitter, label: 'X', icon: 'fa-x-twitter' }
            ].filter((item) => item.href);
            if (!items.length) {
                social.hidden = true;
                social.innerHTML = '';
            } else {
                social.hidden = false;
                social.innerHTML = items.map((item) => (
                    `<a href="${item.href}" target="_blank" rel="noopener noreferrer" class="contact-social-link" aria-label="${item.label}"><i class="fab ${item.icon}" aria-hidden="true"></i></a>`
                )).join('');
            }
        }
    }

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
            const messages = {
                name: tMsg('contact_err_name', 'Ingresa tu nombre.'),
                email: tMsg('contact_err_email', 'Ingresa un correo válido.'),
                subject: tMsg('contact_err_subject', 'Ingresa un asunto.'),
                message: tMsg('contact_err_message', 'Escribe tu mensaje.')
            };

            const name = form.querySelector('[name="name"], #contactName');
            const email = form.querySelector('[name="email"], #contactEmail');
            const subject = form.querySelector('[name="subject"], #contactSubject');
            const message = form.querySelector('[name="message"], #contactMessage');

            let valid = true;
            [name, email, subject, message].forEach(el => el && FormValidation.clearFieldError(el));

            if (name && !global.SecurityUtils.validateRequired(name.value)) {
                FormValidation.showFieldError(name, messages.name);
                valid = false;
            }
            if (email && !global.SecurityUtils.validateEmail(email.value)) {
                FormValidation.showFieldError(email, messages.email);
                valid = false;
            }
            if (subject && !global.SecurityUtils.validateRequired(subject.value)) {
                FormValidation.showFieldError(subject, messages.subject);
                valid = false;
            }
            if (message && !global.SecurityUtils.validateRequired(message.value)) {
                FormValidation.showFieldError(message, messages.message);
                valid = false;
            }

            return valid;
        },

        bindContactForm(formSelector) {
            applyContactInfo();
            const form = document.querySelector(formSelector);
            if (!form) return;

            form.addEventListener('submit', (e) => {
                e.preventDefault();
                if (!FormValidation.validateContactForm(form)) {
                    const firstInvalid = form.querySelector('.is-invalid');
                    if (firstInvalid) firstInvalid.focus();
                    return;
                }

                const payload = {
                    name: global.SecurityUtils.sanitizeInput(form.querySelector('[name="name"], #contactName')?.value),
                    email: global.SecurityUtils.sanitizeInput(form.querySelector('[name="email"], #contactEmail')?.value, 254),
                    subject: global.SecurityUtils.sanitizeInput(form.querySelector('[name="subject"], #contactSubject')?.value),
                    message: global.SecurityUtils.sanitizeInput(form.querySelector('[name="message"], #contactMessage')?.value, 2000)
                };

                const to = (global.ArteSanaContact && global.ArteSanaContact.email) || 'ArteSana919@gmail.com';
                const body = [
                    `Nombre: ${payload.name}`,
                    `Correo: ${payload.email}`,
                    '',
                    payload.message
                ].join('\n');
                window.location.href = `mailto:${to}?subject=${encodeURIComponent(payload.subject)}&body=${encodeURIComponent(body)}`;
            });
        }
    };

    global.FormValidation = FormValidation;
    global.applyArteSanaContact = applyContactInfo;
})(window);
