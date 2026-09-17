/**
 * CTA para clientes al final de Explore: "¿Quieres comenzar a vender?"
 */
class ClientSellCta extends HTMLElement {
    connectedCallback() {
        this.render();
    }

    t(key, fallback) {
        const lang = localStorage.getItem('lang') || 'es';
        return (window.translations && window.translations[lang] && window.translations[lang][key]) || fallback;
    }

    render() {
        const user = window.RoleService?.getCurrentUser();
        const isSeller = user && window.RoleService.isArtisan(user);

        if (isSeller) {
            this.innerHTML = '';
            this.style.display = 'none';
            return;
        }

        this.innerHTML = `
            <section class="client-sell-cta py-5" aria-label="${this.t('role_sell_cta_title', 'Comenzar a vender')}">
                <div class="container">
                    <div class="client-sell-card text-center p-4 p-md-5 mx-auto" style="max-width:720px;background:linear-gradient(135deg,rgba(150,38,38,0.06) 0%,rgba(255,215,0,0.08) 100%);border-radius:20px;border:1px solid rgba(128,0,0,0.12);">
                        <div class="mb-3" style="font-size:2.5rem;color:#800000;"><i class="fas fa-store" aria-hidden="true"></i></div>
                        <h2 class="mb-3" style="font-family:'Playfair Display',serif;color:#800000;font-weight:700;" data-i18n="role_sell_cta_title">${this.t('role_sell_cta_title', '¿Quieres comenzar a vender?')}</h2>
                        <p class="text-muted mb-4" data-i18n="role_sell_cta_desc">${this.t('role_sell_cta_desc', 'Crea tu propia tienda, publica productos y comienza a recibir órdenes.')}</p>
                        <a href="perfil.html#create-store" class="btn btn-lg" id="clientSellBtn" style="background:#800000;color:#fff;border-radius:30px;font-weight:600;padding:12px 36px;" data-i18n="create_my_store">${this.t('create_my_store', 'Crear mi tienda')}</a>
                    </div>
                </div>
            </section>`;

        const btn = this.querySelector('#clientSellBtn');
        btn?.addEventListener('click', (e) => {
            if (!user) {
                e.preventDefault();
                document.querySelector('auth-modal')?.open('register');
            }
        });
    }
}

customElements.define('client-sell-cta', ClientSellCta);
