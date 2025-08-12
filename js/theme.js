// Theme management
let currentTheme = localStorage.getItem('theme') || 'light';

function setTheme(theme) {
    currentTheme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    updateThemeIcon(theme);
    
    // Dispatch custom event for components
    document.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme } }));
    
    // Override inline styles for dark mode
    if (theme === 'dark') {
        overrideInlineStyles();
    }
}

function overrideInlineStyles() {
    // Override common inline styles that might interfere with dark mode
    const elementsWithInlineStyles = document.querySelectorAll('[style*="background"], [style*="color"]');
    
    elementsWithInlineStyles.forEach(element => {
        const style = element.getAttribute('style');
        if (style) {
            // Override white backgrounds
            if (style.includes('background: #fff') || style.includes('background: white') || 
                style.includes('background:#fff') || style.includes('background:white')) {
                element.style.setProperty('background', 'var(--card-bg)', 'important');
            }
            
            // Override dark text colors
            if (style.includes('color: #333') || style.includes('color: #666') || 
                style.includes('color:#333') || style.includes('color:#666')) {
                element.style.setProperty('color', 'var(--text-color)', 'important');
            }
            
            // Override specific brand colors
            if (style.includes('color: #a22a22') || style.includes('color:#a22a22')) {
                element.style.setProperty('color', 'var(--primary-color)', 'important');
            }
            
            if (style.includes('color: #6b6657') || style.includes('color:#6b6657') ||
                style.includes('color: #575443') || style.includes('color:#575443')) {
                element.style.setProperty('color', 'var(--text-color)', 'important');
            }
        }
    });
    
    // Override modal styles
    const modals = document.querySelectorAll('.modal-content');
    modals.forEach(modal => {
        modal.style.setProperty('background', 'var(--card-bg)', 'important');
        modal.style.setProperty('border-color', 'var(--border-color)', 'important');
    });
    
    // Override form elements
    const formElements = document.querySelectorAll('.form-control, .form-select, input, textarea, select');
    formElements.forEach(element => {
        element.style.setProperty('background', 'var(--dark-bg)', 'important');
        element.style.setProperty('color', 'var(--text-color)', 'important');
        element.style.setProperty('border-color', 'var(--border-color)', 'important');
    });
    
    // Override card backgrounds
    const cards = document.querySelectorAll('.card, .store-card, .product-card, .feature-card');
    cards.forEach(card => {
        card.style.setProperty('background', 'var(--card-bg)', 'important');
        card.style.setProperty('border-color', 'var(--border-color)', 'important');
    });
}

function toggleTheme() {
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
}

function updateThemeIcon(theme) {
    const headerComponent = document.querySelector('header-component');
    const headerUserComponent = document.querySelector('header-user-component');

    // Check header-component first
    if (headerComponent && headerComponent.shadowRoot) {
        const themeToggle = headerComponent.shadowRoot.querySelector('.theme-toggle .icon');
        if (themeToggle) {
            const path = themeToggle.querySelector('path');
            if (path) {
                if (theme === 'dark') {
                    // Sun icon path
                    path.setAttribute('d', 'M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z');
                } else {
                    // Moon icon path
                    path.setAttribute('d', 'M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z');
                }
            }
            return;
        }
    }

    // Check header-user-component if header-component not found
    if (headerUserComponent && headerUserComponent.shadowRoot) {
        const themeToggle = headerUserComponent.shadowRoot.querySelector('.theme-toggle .icon');
        if (themeToggle) {
            const path = themeToggle.querySelector('path');
            if (path) {
                if (theme === 'dark') {
                    // Sun icon path
                    path.setAttribute('d', 'M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z');
                } else {
                    // Moon icon path
                    path.setAttribute('d', 'M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z');
                }
            }
            return;
        }
    }

    // Fallback for any other theme toggles outside web components
    const themeIcon = document.querySelector('.theme-toggle i');
    if (themeIcon) {
        themeIcon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }
}

function initTheme() {
    setTheme(currentTheme);
}

// Initialize theme on page load
document.addEventListener('DOMContentLoaded', initTheme);

// Listen for theme changes from other components
document.addEventListener('themeChanged', (event) => {
    if (event.detail && event.detail.theme) {
        setTheme(event.detail.theme);
    }
});

// Make functions globally available
window.setTheme = setTheme;
window.toggleTheme = toggleTheme;
window.updateThemeIcon = updateThemeIcon;
window.initTheme = initTheme; 