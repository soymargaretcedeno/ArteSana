class CtaSection extends HTMLElement {
  static get observedAttributes() {
    return ['title', 'subtitle', 'button-text', 'button-link'];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
    // Escuchar cambios de idioma
    window.addEventListener('languageChanged', this._onLanguageChange);
    window.addEventListener('storage', this._onLanguageChange);
  }

  disconnectedCallback() {
    window.removeEventListener('languageChanged', this._onLanguageChange);
    window.removeEventListener('storage', this._onLanguageChange);
  }

  _onLanguageChange = () => {
    this.render();
  };

  attributeChangedCallback() {
    this.render();
  }

  render() {
    const lang = localStorage.getItem('lang') || 'es';
    // Claves globales sugeridas para CTA
    const titleKey = this.getAttribute('title-i18n') || 'cta_title';
    const subtitleKey = this.getAttribute('subtitle-i18n') || 'cta_subtitle';
    const buttonKey = this.getAttribute('button-text-i18n') || 'cta_button';
    const title = (window.translations && window.translations[lang] && window.translations[lang][titleKey]) || this.getAttribute('title') || 'Join the ArteSana Movement!';
    const subtitle = (window.translations && window.translations[lang] && window.translations[lang][subtitleKey]) || this.getAttribute('subtitle') || 'Become part of a vibrant community of artisans and art lovers. Create your free store or discover unique handcrafts.';
    const buttonText = (window.translations && window.translations[lang] && window.translations[lang][buttonKey]) || this.getAttribute('button-text') || 'Start Now';
    const buttonLink = this.getAttribute('button-link') || 'perfil.html#my-store-section';
    this.shadowRoot.innerHTML = `
      <style>
        .cta-root {
          background: url('https://thumbs.dreamstime.com/b/artes-de-panam%C3%A1-18961136.jpg') center/cover;
          color: #ffffff;
          padding: 80px 0 70px 0;
          text-align: center;
          box-shadow: 0 10px 40px rgba(0,0,0,0.15);
          position: relative;
          overflow: hidden;
        }
        .cta-root::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0; bottom: 0;
          background: linear-gradient(135deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.75) 50%, rgba(0,0,0,0.9) 100%);
          z-index: 1;
        }
        .cta-content {
          position: relative;
          z-index: 2;
          max-width: 800px;
          margin: 0 auto;
          padding: 0 20px;
        }
        .cta-title {
          font-size: 3rem;
          font-weight: 900;
          margin-bottom: 20px;
          color: #ffffff;
          letter-spacing: 2px;
          text-shadow: 0 4px 20px rgba(0,0,0,0.5);
          line-height: 1.2;
        }
        .cta-subtitle {
          font-size: 1.4rem;
          margin-bottom: 40px;
          color: #ffffff;
          opacity: 0.95;
          font-weight: 400;
          line-height: 1.6;
          text-shadow: 0 2px 10px rgba(0,0,0,0.3);
        }
        .cta-btn {
          background: linear-gradient(135deg, #800000 0%, #A22A2A 100%);
          color: #ffffff;
          font-weight: 700;
          font-size: 1.3rem;
          padding: 20px 60px;
          border-radius: 50px;
          border: 2px solid rgba(255,255,255,0.3);
          box-shadow: 0 8px 25px rgba(128,0,0,0.4);
          transition: all 0.3s ease;
          text-decoration: none;
          display: inline-block;
          letter-spacing: 1px;
          cursor: pointer;
          position: relative;
          overflow: hidden;
        }
        .cta-btn::before {
          content: '';
          position: absolute;
          top: 0; left: -100%;
          width: 100%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transition: left 0.5s;
        }
        .cta-btn:hover {
          background: linear-gradient(135deg, #600000 0%, #800000 100%);
          color: #ffffff;
          transform: translateY(-3px) scale(1.05);
          box-shadow: 0 12px 35px rgba(128,0,0,0.6);
          border-color: rgba(255,255,255,0.5);
        }
        .cta-btn:hover::before {
          left: 100%;
        }
        @media (max-width: 768px) {
          .cta-title { font-size: 2rem; }
          .cta-subtitle { font-size: 1.1rem; }
          .cta-btn { font-size: 1.1rem; padding: 16px 40px; }
          .cta-root { padding: 60px 0 50px 0; }
        }
        @media (max-width: 480px) {
          .cta-title { font-size: 1.6rem; }
          .cta-subtitle { font-size: 1rem; }
          .cta-btn { font-size: 1rem; padding: 14px 32px; }
          .cta-root { padding: 50px 0 40px 0; }
        }
      </style>
      <section class="cta-root">
        <div class="cta-content">
          <h2 class="cta-title">${title}</h2>
          <p class="cta-subtitle">${subtitle}</p>
          <button class="cta-btn" onclick="openSignUpModal()">${buttonText}</button>
        </div>
      </section>
    `;
  }
}
customElements.define('cta-section', CtaSection);

// Global function to open sign-up modal
window.openSignUpModal = function() {
    const authModal = document.querySelector('auth-modal');
    if (authModal && typeof authModal.open === 'function') {
        authModal.open('register');
    }
}; 