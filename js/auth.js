document.addEventListener('DOMContentLoaded', () => {
    // Get elements
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const showRegisterLink = document.getElementById('showRegister');
    const showLoginLink = document.getElementById('showLogin');
    const registerParagraph = document.querySelector('.auth-footer p:first-child');
    const loginParagraph = document.querySelector('.auth-footer p:last-child');

    // Check for dark mode preference
    const darkMode = localStorage.getItem('darkMode') === 'true';
    if (darkMode) {
        document.body.classList.add('dark-mode');
    }

    // Form switching functionality
    showRegisterLink.addEventListener('click', (e) => {
        e.preventDefault();
        loginForm.classList.add('d-none');
        registerForm.classList.remove('d-none');
        registerParagraph.classList.add('d-none');
        loginParagraph.classList.remove('d-none');
    });

    showLoginLink.addEventListener('click', (e) => {
        e.preventDefault();
        registerForm.classList.add('d-none');
        loginForm.classList.remove('d-none');
        loginParagraph.classList.add('d-none');
        registerParagraph.classList.remove('d-none');
    });

    // Form submission handling
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        const rememberMe = document.getElementById('rememberMe').checked;

        // Here you would typically make an API call to your backend
        console.log('Login attempt:', { email, password, rememberMe });
        
        // For demo purposes, show success message
        alert('Login successful!');
    });

    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('registerName').value;
        const email = document.getElementById('registerEmail').value;
        const password = document.getElementById('registerPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (password !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }

        // Here you would typically make an API call to your backend
        console.log('Register attempt:', { name, email, password });
        
        // For demo purposes, show success message
        alert('Registration successful!');
    });
}); 