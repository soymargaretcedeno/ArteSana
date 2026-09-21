// Theme management
(function applyStoredThemeNow() {
    try {
        const stored = localStorage.getItem('theme') === 'dark' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', stored);
    } catch (err) {}
})();

let currentTheme = localStorage.getItem('theme') === 'dark' ? 'dark' : 'light';

function setTheme(theme) {
    const next = theme === 'dark' ? 'dark' : 'light';
    const changed = document.documentElement.getAttribute('data-theme') !== next;
    currentTheme = next;
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    updateThemeIcon(next);

    if (next === 'dark') {
        overrideInlineStyles();
    }

    if (changed) {
        document.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme: next } }));
    }
}

function overrideInlineStyles() {
    const elementsWithInlineStyles = document.querySelectorAll('[style*="background"], [style*="color"]');

    elementsWithInlineStyles.forEach(element => {
        const style = element.getAttribute('style');
        if (style) {
            if (style.includes('background: #fff') || style.includes('background: white') ||
                style.includes('background:#fff') || style.includes('background:white')) {
                element.style.setProperty('background', 'var(--card-bg)', 'important');
            }

            if (style.includes('color: #333') || style.includes('color: #666') ||
                style.includes('color:#333') || style.includes('color:#666')) {
                element.style.setProperty('color', 'var(--text-color)', 'important');
            }

            if (style.includes('color: #a22a22') || style.includes('color:#a22a22')) {
                element.style.setProperty('color', 'var(--primary-color)', 'important');
            }

            if (style.includes('color: #6b6657') || style.includes('color:#6b6657') ||
                style.includes('color: #575443') || style.includes('color:#575443')) {
                element.style.setProperty('color', 'var(--text-color)', 'important');
            }
        }
    });
}

function toggleTheme() {
    setTheme(currentTheme === 'light' ? 'dark' : 'light');
}

function updateThemeIcon(theme) {
    const isDark = theme === 'dark';
    const labelKey = isDark ? 'theme_dark' : 'theme_light';
    const fallback = isDark ? 'Modo oscuro' : 'Modo claro';
    const label = window.t ? window.t(labelKey, fallback) : fallback;

    document.querySelectorAll('header-component, header-user-component').forEach((header) => {
        const btn = header.shadowRoot && header.shadowRoot.querySelector('.theme-toggle');
        if (!btn) return;
        btn.classList.toggle('is-dark', isDark);
        btn.setAttribute('aria-label', label);
        btn.setAttribute('title', label);
        btn.setAttribute('data-i18n-aria', labelKey);
    });

    const themeIcon = document.querySelector('.theme-toggle i');
    if (themeIcon) {
        themeIcon.className = isDark ? 'fas fa-moon' : 'fas fa-sun';
    }
}

function initTheme() {
    setTheme(currentTheme);
}

document.addEventListener('DOMContentLoaded', initTheme);

window.setTheme = setTheme;
window.toggleTheme = toggleTheme;
window.updateThemeIcon = updateThemeIcon;
window.initTheme = initTheme;
