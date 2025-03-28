// Navbar scroll effect
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Dark Mode Toggle
const darkModeToggle = document.getElementById('darkModeToggle');
const icon = darkModeToggle.querySelector('i');
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

// Check for saved dark mode preference
if (localStorage.getItem('darkMode') === 'enabled' || (!localStorage.getItem('darkMode') && prefersDarkScheme.matches)) {
    document.body.classList.add('dark-mode');
    icon.classList.remove('fa-sun');
    icon.classList.add('fa-moon');
}

// Toggle dark mode
darkModeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    
    // Animate icon change
    icon.style.transform = 'rotate(180deg)';
    
    setTimeout(() => {
        if (document.body.classList.contains('dark-mode')) {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
            localStorage.setItem('darkMode', 'enabled');
        } else {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
            localStorage.setItem('darkMode', 'disabled');
        }
        icon.style.transform = 'rotate(0deg)';
    }, 200);
});

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Animate elements on scroll
const animateOnScroll = () => {
    const elements = document.querySelectorAll('.feature-card');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementBottom = element.getBoundingClientRect().bottom;
        
        if (elementTop < window.innerHeight && elementBottom > 0) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
};

// Initial animation for feature cards
document.querySelectorAll('.feature-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'all 0.6s ease';
});

window.addEventListener('scroll', animateOnScroll);
window.addEventListener('load', animateOnScroll);

// Add hover effect to buttons
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('mouseenter', () => {
        button.style.transform = 'translateY(-3px)';
    });
    
    button.addEventListener('mouseleave', () => {
        button.style.transform = 'translateY(0)';
    });
});

// Add loading animation to hero section
document.addEventListener('DOMContentLoaded', () => {
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.style.opacity = '0';
        heroContent.style.transform = 'translateY(20px)';
        setTimeout(() => {
            heroContent.style.opacity = '1';
            heroContent.style.transform = 'translateY(0)';
        }, 500);
    }
});

// Counter Animation
function animateCounter(element, target) {
    let current = 0;
    const duration = 2000; // 2 seconds
    const step = target / (duration / 16); // Update every 16ms (60fps)
    
    function update() {
        current += step;
        if (current < target) {
            element.textContent = Math.round(current);
            requestAnimationFrame(update);
        } else {
            element.textContent = target;
        }
    }
    
    update();
}

// Intersection Observer for Counter Animation
const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const counter = entry.target;
            const target = parseInt(counter.getAttribute('data-target'));
            animateCounter(counter, target);
            counterObserver.unobserve(counter);
        }
    });
}, { threshold: 0.5 });

// Observe all counter elements
document.querySelectorAll('.counter').forEach(counter => {
    counterObserver.observe(counter);
});

// Form Validation
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Basic form validation
        const name = this.querySelector('input[name="name"]').value;
        const email = this.querySelector('input[name="email"]').value;
        const message = this.querySelector('textarea[name="message"]').value;
        
        let isValid = true;
        let errorMessage = '';
        
        if (!name.trim()) {
            errorMessage += 'Please enter your name.\n';
            isValid = false;
        }
        
        if (!email.trim() || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            errorMessage += 'Please enter a valid email address.\n';
            isValid = false;
        }
        
        if (!message.trim()) {
            errorMessage += 'Please enter your message.\n';
            isValid = false;
        }
        
        if (!isValid) {
            alert(errorMessage);
            return;
        }
        
        // Here you would typically send the form data to your server
        alert('Thank you for your message! We will get back to you soon.');
        this.reset();
    });
}

// Testimonial Cards Hover Effect
document.querySelectorAll('.testimonial-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
}); 